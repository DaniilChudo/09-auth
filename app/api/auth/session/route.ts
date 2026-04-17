import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import axios from "axios";
import { parse } from "cookie";
import { logErrorResponse } from "../../_utils/utils";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  // 1. ВИПРАВЛЕНО: Рання перевірка наявності токенів (вимога ментора)
  if (!accessToken && !refreshToken) {
    return NextResponse.json({ success: false }, { status: 200 });
  }

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/session`,
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
      },
    );

    const setCookieHeader = response.headers["set-cookie"];

    // 2. ВИПРАВЛЕНО: Парсинг і ручне встановлення кук (вимога ментора)
    if (setCookieHeader) {
      const cookiesToSet = Array.isArray(setCookieHeader)
        ? setCookieHeader
        : [setCookieHeader];

      for (const cookieStr of cookiesToSet) {
        const parsedCookie = parse(cookieStr);
        const cookieEntries = Object.entries(parsedCookie);

        if (cookieEntries.length > 0) {
          const [name, value] = cookieEntries[0];

          // Встановлюємо тільки якщо значення є рядком (вирішує помилку TS 2345)
          if (
            (name === "accessToken" || name === "refreshToken") &&
            typeof value === "string"
          ) {
            cookieStore.set(name, value, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              path: "/",
              expires: parsedCookie.expires
                ? new Date(parsedCookie.expires)
                : undefined,
              sameSite: "lax",
            });
          }
        }
      }
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Якщо сервер відповів 200, але нових кук немає — це теж успіх
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      logErrorResponse(error);
    }
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
