import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies(); // Додаємо await
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    // Якщо є будь-який токен, повертаємо успіх (без рекурсії!)
    if (accessToken || refreshToken) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // If no tokens, check with external GoIT API
    try {
      const response = await fetch(
        "https://notehub-api.goit.study/auth/session",
        {
          headers: {
            Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}`,
          },
        },
      );

      if (response.ok) {
        const userData = await response.json();
        if (userData) {
          return NextResponse.json(
            { success: true, user: userData },
            { status: 200 },
          );
        }
      }
    } catch (error) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    return NextResponse.json({ success: false }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
