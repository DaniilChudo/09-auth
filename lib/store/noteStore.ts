import { create } from "zustand";
import { persist } from "zustand/middleware";
import { NoteTag } from "@/types/note";

interface NoteStore {
  draft: {
    title: string;
    content: string;
    tag: NoteTag;
  };
  setDraft: (draft: Partial<NoteStore["draft"]>) => void;
  clearDraft: () => void;
}

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: {
        title: "",
        content: "",
        tag: "Todo",
      },
      setDraft: (newDraft) =>
        set((state) => ({
          draft: { ...state.draft, ...newDraft },
        })),
      clearDraft: () =>
        set({
          draft: {
            title: "",
            content: "",
            tag: "Todo",
          },
        }),
    }),
    {
      name: "note-draft-storage",
    },
  ),
);
