import { frequencyResultSchema } from "@/entities/frequency";
import { AppError } from "@/shared/lib/errors";

export async function requestFrequency(wish: string) {
  const response = await fetch("/api/frequency", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ wish }),
  });

  const payload = await response.json();

  if (!response.ok) {
    const message =
      typeof payload?.error === "string"
        ? payload.error
        : "주파수를 해석하는 중 문제가 생겼어요. 잠시 후 다시 시도해주세요.";

    throw new AppError(message, response.status, payload?.code ?? "REQUEST_FAILED");
  }

  return frequencyResultSchema.parse(payload);
}
