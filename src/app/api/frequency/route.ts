import { NextResponse } from "next/server";
import { z } from "zod";

import { buildFrequencyResponse } from "@/features/submit-wish";
import { AppError } from "@/shared/lib/errors";

const requestSchema = z.object({
  wish: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = requestSchema.parse(await request.json());
    const response = await buildFrequencyResponse(body.wish);

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        {
          code: error.code,
          error: error.message,
        },
        { status: error.status },
      );
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          code: "INVALID_REQUEST",
          error: "소원은 문자열이어야 해요.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        code: "INTERNAL_ERROR",
        error: "주파수를 만드는 동안 예기치 못한 문제가 생겼어요.",
      },
      { status: 500 },
    );
  }
}
