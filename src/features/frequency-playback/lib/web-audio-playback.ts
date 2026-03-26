import type {
  AutomationCurve,
  ResolvedVoicePlan,
  WebAudioPlaybackPlan,
} from "@/entities/frequency";

export type ActiveFrequencyPlayback = {
  durationSec: number;
  stop: () => void;
};

let audioContextPromise: Promise<AudioContext> | null = null;

function getAudioContextCtor() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext ?? null;
}

async function getAudioContext() {
  const AudioContextCtor = getAudioContextCtor();

  if (!AudioContextCtor) {
    throw new Error("이 브라우저는 WebAudio를 지원하지 않아요.");
  }

  audioContextPromise ??= Promise.resolve(new AudioContextCtor());

  return audioContextPromise;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function scheduleCurve(
  audioParam: AudioParam,
  curve: AutomationCurve,
  startAt: number,
  multiplier = 1,
) {
  const [firstPoint, ...restPoints] = curve.points;

  if (!firstPoint) {
    return;
  }

  audioParam.cancelScheduledValues(startAt);
  audioParam.setValueAtTime(firstPoint.value * multiplier, startAt + firstPoint.timeSec);

  for (const point of restPoints) {
    audioParam.linearRampToValueAtTime(point.value * multiplier, startAt + point.timeSec);
  }
}

function getCurveValueAtTime(curve: AutomationCurve, timeSec: number) {
  const points = curve.points;

  if (points.length === 0) {
    return 0;
  }

  if (timeSec <= points[0]!.timeSec) {
    return points[0]!.value;
  }

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1]!;
    const current = points[index]!;

    if (timeSec <= current.timeSec) {
      const span = current.timeSec - previous.timeSec || 1;
      const progress = (timeSec - previous.timeSec) / span;

      return previous.value + (current.value - previous.value) * progress;
    }
  }

  return points.at(-1)?.value ?? 0;
}

function createVoicePair(
  context: AudioContext,
  voice: ResolvedVoicePlan,
  voiceInput: GainNode,
  startAt: number,
  stopAt: number,
) {
  const leftPan = context.createStereoPanner();
  const leftGain = context.createGain();
  const leftOsc = context.createOscillator();
  const rightPan = context.createStereoPanner();
  const rightGain = context.createGain();
  const rightOsc = context.createOscillator();

  const leftPanCurve: AutomationCurve = {
    interpolation: "linear",
    points: voice.pan.points.map((point) => ({
      timeSec: point.timeSec,
      value: clamp(point.value - 0.35, -1, 1),
    })),
  };
  const rightPanCurve: AutomationCurve = {
    interpolation: "linear",
    points: voice.pan.points.map((point) => ({
      timeSec: point.timeSec,
      value: clamp(point.value + 0.35, -1, 1),
    })),
  };

  leftGain.gain.value = 0.5;
  rightGain.gain.value = 0.5;
  leftOsc.type = "sine";
  rightOsc.type = "sine";
  leftOsc.frequency.setValueAtTime(voice.frequencyHz, startAt);
  rightOsc.frequency.setValueAtTime(voice.frequencyHz + voice.stereoOffsetHz, startAt);
  scheduleCurve(leftPan.pan, leftPanCurve, startAt);
  scheduleCurve(rightPan.pan, rightPanCurve, startAt);

  leftOsc.connect(leftGain);
  leftGain.connect(leftPan);
  leftPan.connect(voiceInput);
  rightOsc.connect(rightGain);
  rightGain.connect(rightPan);
  rightPan.connect(voiceInput);

  leftOsc.start(startAt);
  rightOsc.start(startAt);
  leftOsc.stop(stopAt);
  rightOsc.stop(stopAt);

  return {
    disconnect() {
      leftOsc.disconnect();
      leftGain.disconnect();
      leftPan.disconnect();
      rightOsc.disconnect();
      rightGain.disconnect();
      rightPan.disconnect();
    },
    oscillators: [leftOsc, rightOsc],
  };
}

function schedulePulseGain(
  context: AudioContext,
  voice: ResolvedVoicePlan,
  pulseGain: GainNode,
  startAt: number,
  durationSec: number,
) {
  if (!voice.pulseHz || !voice.pulseDepth) {
    pulseGain.gain.setValueAtTime(1, startAt);
    return;
  }

  const periodSec = 1 / voice.pulseHz;
  let timeSec = 0;

  pulseGain.gain.setValueAtTime(0.0001, startAt);

  while (timeSec < durationSec) {
    const pulseDepth = getCurveValueAtTime(voice.pulseDepth, timeSec);
    const riseAt = startAt + timeSec;
    const peakAt = riseAt + Math.min(periodSec * 0.24, 0.45);
    const fallAt = riseAt + Math.min(periodSec * 0.62, 0.9);

    pulseGain.gain.setValueAtTime(0.0001, riseAt);
    pulseGain.gain.linearRampToValueAtTime(pulseDepth, peakAt);
    pulseGain.gain.linearRampToValueAtTime(0.0001, fallAt);
    timeSec += periodSec;
  }
}

function createVoiceGraph(
  context: AudioContext,
  voice: ResolvedVoicePlan,
  mixBus: GainNode,
  startAt: number,
  stopAt: number,
) {
  const voiceGain = context.createGain();
  const pulseGain = context.createGain();
  const voiceFilter = context.createBiquadFilter();
  const cleanupNodes: AudioNode[] = [voiceGain, pulseGain, voiceFilter];
  const cleanupCallbacks: Array<() => void> = [];

  voiceFilter.type = "lowpass";
  pulseGain.gain.value = 1;
  scheduleCurve(voiceGain.gain, voice.gain, startAt);
  scheduleCurve(voiceFilter.frequency, voice.filterHz, startAt);
  schedulePulseGain(context, voice, pulseGain, startAt, stopAt - startAt);

  pulseGain.connect(voiceGain);
  voiceGain.connect(voiceFilter);
  voiceFilter.connect(mixBus);

  const pair = createVoicePair(context, voice, pulseGain, startAt, stopAt);
  cleanupCallbacks.push(pair.disconnect);

  if (voice.modulationRateHz && voice.modulationDepth) {
    const lfo = context.createOscillator();
    const lfoDepth = context.createGain();
    const filterLfoDepth = context.createGain();

    lfo.type = "sine";
    lfo.frequency.setValueAtTime(voice.modulationRateHz, startAt);
    lfoDepth.gain.setValueAtTime(voice.modulationDepth, startAt);
    filterLfoDepth.gain.setValueAtTime(
      Math.max(voice.modulationDepth * 5200, 140),
      startAt,
    );
    lfo.connect(lfoDepth);
    lfo.connect(filterLfoDepth);
    lfoDepth.connect(voiceGain.gain);
    filterLfoDepth.connect(voiceFilter.frequency);
    lfo.start(startAt);
    lfo.stop(stopAt);
    cleanupNodes.push(lfo, lfoDepth, filterLfoDepth);
  }

  return () => {
    for (const callback of cleanupCallbacks) {
      callback();
    }

    for (const node of cleanupNodes) {
      node.disconnect();
    }
  };
}

export async function startFrequencyPlayback(
  plan: WebAudioPlaybackPlan,
): Promise<ActiveFrequencyPlayback> {
  const context = await getAudioContext();

  if (context.state === "suspended") {
    await context.resume();
  }

  const startAt = context.currentTime + 0.03;
  const stopAt = startAt + plan.durationSec + 0.1;
  const inputBus = context.createGain();
  const highpass = context.createBiquadFilter();
  const lowpass = context.createBiquadFilter();
  const compressor = context.createDynamicsCompressor();
  const masterGain = context.createGain();
  const delaySend = context.createGain();
  const delay = context.createDelay(1);
  const feedback = context.createGain();
  const cleanupCallbacks: Array<() => void> = [];

  highpass.type = "highpass";
  scheduleCurve(highpass.frequency, plan.effectBus.highpassHz, startAt);
  lowpass.type = "lowpass";
  scheduleCurve(lowpass.frequency, plan.effectBus.lowpassHz, startAt);
  compressor.attack.value = plan.effectBus.compressor.attack;
  compressor.knee.value = plan.effectBus.compressor.knee;
  compressor.ratio.value = plan.effectBus.compressor.ratio;
  compressor.release.value = plan.effectBus.compressor.release;
  compressor.threshold.value = plan.effectBus.compressor.threshold;
  scheduleCurve(masterGain.gain, plan.effectBus.masterGain, startAt);
  scheduleCurve(delaySend.gain, plan.effectBus.delayMix, startAt);
  scheduleCurve(delay.delayTime, plan.effectBus.delayTimeSec, startAt);
  feedback.gain.value = plan.effectBus.delayFeedback;

  inputBus.connect(highpass);
  highpass.connect(lowpass);
  lowpass.connect(compressor);
  compressor.connect(masterGain);
  masterGain.connect(context.destination);

  inputBus.connect(delaySend);
  delaySend.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(compressor);

  cleanupCallbacks.push(() => {
    delay.disconnect();
    delaySend.disconnect();
    feedback.disconnect();
    inputBus.disconnect();
    highpass.disconnect();
    lowpass.disconnect();
    compressor.disconnect();
    masterGain.disconnect();
  });

  for (const voice of plan.voices) {
    cleanupCallbacks.push(createVoiceGraph(context, voice, inputBus, startAt, stopAt));
  }

  return {
    durationSec: plan.durationSec,
    stop() {
      for (const callback of cleanupCallbacks) {
        callback();
      }
    },
  };
}
