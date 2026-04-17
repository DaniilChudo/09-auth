import axios from "axios";
import { Note } from "../../types/note";
import { User } from "../../types/user";

const baseURL = process.env.NEXT_PUBLIC_API_URL + "/api";

// Note functions
export const fetchNotes = async (
  page = 1,
  perPage = 12,
  search = "",
  tag?: string,
  cookies?: string,
): Promise<{ notes: Note[]; totalPages: number }> => {
  const params: Record<string, string | number> = { page, perPage, search };
  if (tag && tag !== "all") params.tag = tag;

  const headers: Record<string, string> = {};
  if (cookies) {
    headers.Cookie = cookies;
  }

  const { data } = await axios.get<{ notes: Note[]; totalPages: number }>(
    `${baseURL}/notes`,
    { params, headers },
  );
  return data;
};

export const fetchNoteById = async (
  id: string,
  cookies?: string,
): Promise<Note> => {
  const headers: Record<string, string> = {};
  if (cookies) {
    headers.Cookie = cookies;
  }

  const { data } = await axios.get<Note>(`${baseURL}/notes/${id}`, { headers });
  return data;
};

// User functions
export const getMe = async (cookies?: string): Promise<User> => {
  const headers: Record<string, string> = {};
  if (cookies) {
    headers.Cookie = cookies;
  }

  const { data } = await axios.get<User>(`${baseURL}/users/me`, { headers });
  return data;
};

export const checkSession = async (cookies?: string): Promise<User | null> => {
  const headers: Record<string, string> = {};
  if (cookies) {
    headers.Cookie = cookies;
  }

  try {
    const { data } = await axios.get<User>(`${baseURL}/auth/session`, {
      headers,
    });
    return data;
  } catch (error) {
    return null;
  }
};
