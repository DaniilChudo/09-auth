import { api } from "@/app/api/api";
import { Note } from "../../types/note";
import { User } from "../../types/user";

// --- Note functions ---

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

// --- Auth functions ---

/**
 * Реєстрація користувача.
 * Приймає об'єкт з email та password.
 * username видалено, оскільки бекенд GoIT зазвичай його не потребує при реєстрації.
 */
export const register = async (credentials: {
  email: string;
  password: string;
}): Promise<User> => {
  const { data } = await api.post<User>("/auth/register", credentials);
  return data;
};

/**
 * Логін користувача.
 * Приймає об'єкт { email, password }.
 */
export const login = async (credentials: {
  email: string;
  password: string;
}): Promise<User> => {
  const { data } = await api.post<User>("/auth/login", credentials);
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

export const updateMe = async (userData: {
  username: string;
}): Promise<User> => {
  const { data } = await api.patch<User>("/users/me", userData);
  return data;
};
