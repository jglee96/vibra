"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { buildWebAudioPlaybackPlan, type FrequencyResult } from "@/entities/frequency";
import { startFrequencyPlayback, type ActiveFrequencyPlayback } from "@/features/frequency-playback/lib/web-audio-playback";

type PlaybackStatus = "idle" | "ready" | "playing" | "error";

type FrequencyPlaybackState = {
  error: string | null;
  isPlaying: boolean;
  play: () => Promise<void>;
  status: PlaybackStatus;
  stop: () => void;
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "브라우저 오디오를 시작하지 못했어요.";
}

export function useFrequencyPlayback(result: FrequencyResult | null): FrequencyPlaybackState {
  const activeRef = useRef<ActiveFrequencyPlayback | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const [status, setStatus] = useState<PlaybackStatus>(result ? "ready" : "idle");
  const [error, setError] = useState<string | null>(null);
  const plan = useMemo(
    () => (result ? buildWebAudioPlaybackPlan(result) : null),
    [result],
  );

  function stop() {
    activeRef.current?.stop();
    activeRef.current = null;

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setStatus(plan ? "ready" : "idle");
  }

  async function play() {
    if (!plan) {
      return;
    }

    stop();

    try {
      const playback = await startFrequencyPlayback(plan);

      activeRef.current = playback;
      setError(null);
      setStatus("playing");
      timeoutRef.current = window.setTimeout(() => {
        activeRef.current = null;
        timeoutRef.current = null;
        setStatus("ready");
      }, playback.durationSec * 1000);
    } catch (playbackError) {
      console.error("WebAudio playback failed", playbackError);
      setError(getErrorMessage(playbackError));
      setStatus("error");
    }
  }

  useEffect(() => {
    stop();
    setError(null);
    setStatus(plan ? "ready" : "idle");

    return () => {
      stop();
    };
  }, [plan]);

  return {
    error,
    isPlaying: status === "playing",
    play,
    status,
    stop,
  };
}
