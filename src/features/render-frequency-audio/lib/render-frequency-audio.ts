import type { FFmpeg } from "@ffmpeg/ffmpeg";

import { getOutputFileName } from "@/entities/frequency";

const ffmpegVersion = "0.12.10";
const ffmpegBaseUrl = `https://cdn.jsdelivr.net/npm/@ffmpeg/core@${ffmpegVersion}/dist/umd`;

let ffmpegPromise: Promise<FFmpeg> | null = null;

async function getLoadedFfmpeg() {
  const activePromise =
    ffmpegPromise ??
    (ffmpegPromise = (async () => {
      const [{ FFmpeg }, { toBlobURL }] = await Promise.all([
        import("@ffmpeg/ffmpeg"),
        import("@ffmpeg/util"),
      ]);

      const ffmpeg = new FFmpeg();

      await ffmpeg.load({
        coreURL: await toBlobURL(`${ffmpegBaseUrl}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${ffmpegBaseUrl}/ffmpeg-core.wasm`, "application/wasm"),
      });

      return ffmpeg;
    })());

  return activePromise;
}

export async function renderFrequencyAudio(ffmpegArgs: string[]) {
  const ffmpeg = await getLoadedFfmpeg();
  const outputFile = getOutputFileName();

  try {
    await ffmpeg.deleteFile(outputFile);
  } catch {
    // Ignore stale outputs between renders.
  }

  await ffmpeg.exec(ffmpegArgs);
  const file = await ffmpeg.readFile(outputFile);

  if (!(file instanceof Uint8Array)) {
    throw new Error("생성된 오디오를 읽어오지 못했어요.");
  }

  const blobBytes = new Uint8Array(file.byteLength);
  blobBytes.set(file);

  const blob = new Blob([blobBytes], { type: "audio/mpeg" });

  return {
    blob,
    url: URL.createObjectURL(blob),
  };
}
