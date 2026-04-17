import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import axios from "axios";
import { logErrorResponse } from "../../_utils/utils";

export async function GET() {
  const cookieStore = await cookies();

  try {
    // 1. Запит до API йде завжди (без ранніх виходів)
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/session`,
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
      },
    );

    // 2. Сувора вимога ментора: якщо бекенд не прислав нові куки — повертаємо false
    if (!response.headers["set-cookie"]) {
      return NextResponse.json({ success: false }, { status: 200 });
    }

    // 3. Успішна сесія
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    // 4. Спеціальна обробка: логуємо тільки помилки Axios
    if (axios.isAxiosError(error)) {
      logErrorResponse(error);
    }

    // 5. Для будь-яких помилок повертаємо 200 та success: false
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
