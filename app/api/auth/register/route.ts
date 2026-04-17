import { NextRequest, NextResponse } from "next/server";
import api from "@/app/api/api";
import { cookies } from "next/headers";
import { parse } from "cookie";
import { isAxiosError } from "axios";

const logError = (data: any) => {
  console.error("API Error Details:", JSON.stringify(data, null, 2));
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiRes = await api.post(
      "https://notehub-api.goit.study/users/signup",
      body,
    );

    const cookieStore = await cookies();
    const setCookie = apiRes.headers["set-cookie"];

    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

      for (const cookieStr of cookieArray) {
        const parsed = parse(cookieStr);

        const cookieNames = Object.keys(parsed).filter(
          (key) =>
            ![
              "Expires",
              "Path",
              "Max-Age",
              "HttpOnly",
              "Secure",
              "SameSite",
            ].includes(key),
        );

        for (const name of cookieNames) {
          const value = parsed[name];
          if (value !== undefined) {
            cookieStore.set(name, value, {
              expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
              path: parsed.Path || "/",
              maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
            });
          }
        }
      }
    }

    return NextResponse.json(apiRes.data, { status: apiRes.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logError(error.response?.data);
      return NextResponse.json(
        {
          error: error.message,
          details: error.response?.data || "Registration failed",
        },
        { status: error.response?.status || 500 },
      );
    }

    logError({ message: (error as Error).message });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
