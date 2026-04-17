import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import axios from "axios";
import { logErrorResponse } from "../../_utils/utils";

export async function GET() {
  const cookieStore = await cookies();

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/session`,
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
      },
    );

    if (!response.headers["set-cookie"]) {
      return NextResponse.json({ success: false }, { status: 200 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      logErrorResponse(error);
    }
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
