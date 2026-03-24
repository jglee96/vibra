"use client";

import { startTransition, useState } from "react";

import type { FrequencyResult } from "@/entities/frequency";
import { requestFrequency } from "@/features/submit-wish/api/request-frequency";

type SubmitWishState = {
  error: string | null;
  isPending: boolean;
  result: FrequencyResult | null;
};

export function useSubmitWish() {
  const [state, setState] = useState<SubmitWishState>({
    error: null,
    isPending: false,
    result: null,
  });

  async function submitWish(wish: string) {
    setState((current) => ({
      ...current,
      error: null,
      isPending: true,
    }));

    try {
      const result = await requestFrequency(wish);

      startTransition(() => {
        setState({
          error: null,
          isPending: false,
          result,
        });
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "소원을 읽어내는 도중 문제가 생겼어요. 다시 시도해주세요.";

      startTransition(() => {
        setState({
          error: message,
          isPending: false,
          result: null,
        });
      });
    }
  }

  return {
    ...state,
    submitWish,
  };
}
