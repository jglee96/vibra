"use client";

import { startTransition, useEffect, useMemo, useState } from "react";

import type { FrequencyResult } from "@/entities/frequency";
import { renderFrequencyAudio } from "@/features/render-frequency-audio/lib/render-frequency-audio";

type AudioRenderState = {
  error: string | null;
  fileName: string | null;
  isRendering: boolean;
  url: string | null;
};

export function useRenderedFrequencyAudio(result: FrequencyResult | null) {
  const [state, setState] = useState<AudioRenderState>({
    error: null,
    fileName: null,
    isRendering: false,
    url: null,
  });

  const resultKey = useMemo(() => {
    if (!result) {
      return null;
    }

    return JSON.stringify({
      title: result.title,
      ffmpegArgs: result.ffmpegArgs,
    });
  }, [result]);

  useEffect(() => {
    if (!result || !resultKey) {
      return;
    }

    let cancelled = false;
    let previousUrl: string | null = null;

    startTransition(() => {
      setState((current) => {
        previousUrl = current.url;

        return {
          error: null,
          fileName: `${result.title.replace(/\s+/g, "-")}.mp3`,
          isRendering: true,
          url: null,
        };
      });
    });

    void renderFrequencyAudio(result.ffmpegArgs)
      .then(({ url }) => {
        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }

        if (previousUrl) {
          URL.revokeObjectURL(previousUrl);
        }

        startTransition(() => {
          setState({
            error: null,
            fileName: `${result.title.replace(/\s+/g, "-")}.mp3`,
            isRendering: false,
            url,
          });
        });
      })
      .catch((error) => {
        const message =
          error instanceof Error
            ? error.message
            : "브라우저에서 오디오를 만드는 중 문제가 생겼어요.";

        startTransition(() => {
          setState({
            error: message,
            fileName: null,
            isRendering: false,
            url: null,
          });
        });
      });

    return () => {
      cancelled = true;

      if (previousUrl) {
        URL.revokeObjectURL(previousUrl);
      }
    };
  }, [result, resultKey]);

  return state;
}
