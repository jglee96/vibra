import { buildFfmpegArgs } from "@/entities/frequency/lib/build-ffmpeg-args";

describe("buildFfmpegArgs", () => {
  it("creates lavfi args that output an mp3 file", () => {
    const args = buildFfmpegArgs({
      durationSec: 180,
      baseHz: 128,
      binauralOffsetHz: 4.2,
      droneLayers: [
        { wave: "sine", freq: 64, gain: 0.1 },
        { wave: "sine", freq: 128, gain: 0.16 },
        { wave: "sine", freq: 191.7, gain: 0.08 },
      ],
      pulseHz: 0.18,
      reverbMix: 0.2,
      fadeInSec: 8,
      fadeOutSec: 12,
    });

    expect(args).toContain("lavfi");
    expect(args.at(-1)).toBe("vibra-output.mp3");
    expect(args.join(" ")).toContain("aevalsrc=");
    expect(args.join(" ")).toContain("libmp3lame");
  });
});
