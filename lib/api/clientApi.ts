import api from "./api";
import { Note } from "../../types/note";
import { User } from "../../types/user";

// Note functions
export const fetchNotes = async (
  page = 1,
  perPage = 12,
  search = "",
  tag?: string,
): Promise<{ notes: Note[]; totalPages: number }> => {
  const params: Record<string, string | number> = { page, perPage, search };
  if (tag && tag !== "all") params.tag = tag;
  const { data } = await api.get<{ notes: Note[]; totalPages: number }>(
    "/notes",
    { params },
  );
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (
  note: Omit<Note, "id" | "createdAt" | "updatedAt">,
): Promise<Note> => {
  const { data } = await api.post<Note>("/notes", note);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};

// Auth functions
export const register = async (
  email: string,
  password: string,
): Promise<User> => {
  const { data } = await api.post<User>("/auth/register", { email, password });
  return data;
};

export const login = async (email: string, password: string): Promise<User> => {
  const { data } = await api.post<User>("/auth/login", { email, password });
  return data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const checkSession = async (): Promise<User | null> => {
  try {
    const { data } = await api.get<User>("/auth/session");
    return data;
  } catch (error) {
    return null;
  }
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>("/users/me");
  return data;
};

export const updateMe = async (userData: Partial<User>): Promise<User> => {
  const { data } = await api.patch<User>("/users/me", userData);
  return data;
};
