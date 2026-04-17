import { cookies } from "next/headers";
import { Note } from "../../types/note";
import { User } from "../../types/user";
import { api } from "@/app/api/api";
import { AxiosResponse } from "axios";

// Note functions
export const fetchNotes = async (
  page = 1,
  perPage = 12,
  search = "",
  tag?: string,
): Promise<{ notes: Note[]; totalPages: number }> => {
  const cookieStore = await cookies();
  const params: Record<string, string | number> = { page, perPage, search };
  if (tag && tag !== "all") params.tag = tag;

  const { data } = await api.get<{ notes: Note[]; totalPages: number }>(
    "notes",
    {
      params,
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
  );
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();
  const { data } = await api.get<Note>(`notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};

// User functions
export const getMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const { data } = await api.get<User>("users/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};

export const checkSession = async (): Promise<AxiosResponse<User | null>> => {
  const cookieStore = await cookies();
  try {
    const response = await api.get<User | null>("auth/session", {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return response;
  } catch (error: any) {
    return error.response;
  }
};
