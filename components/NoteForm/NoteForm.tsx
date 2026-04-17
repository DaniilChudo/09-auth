"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createNote } from "@/lib/api/clientApi";
import { NoteTag } from "@/types/note";
import { useNoteStore } from "@/lib/store/noteStore";
import css from "./NoteForm.module.css";
import { useEffect, useState } from "react";

// Визначення дозволених тегів для валідації
const VALID_TAGS: NoteTag[] = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
];

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Initialize form with draft data when component mounts
    // This will load any existing draft from localStorage
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!draft.title || draft.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    } else if (draft.title.length > 50) {
      newErrors.title = "Title must be less than 50 characters";
    }

    if (draft.content && draft.content.length > 500) {
      newErrors.content = "Content must be less than 500 characters";
    }

    if (!VALID_TAGS.includes(draft.tag)) {
      newErrors.tag = "Please select a valid tag";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      router.back();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      mutate({
        title: draft.title,
        content: draft.content,
        tag: draft.tag,
      });
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <input
        name="title"
        placeholder="Title"
        className={css.input}
        value={draft.title}
        onChange={(e) => setDraft({ title: e.target.value })}
      />
      {errors.title && <span className={css.error}>{errors.title}</span>}

      <textarea
        name="content"
        placeholder="Content"
        className={css.textarea}
        value={draft.content}
        onChange={(e) => setDraft({ content: e.target.value })}
      />

      <select
        name="tag"
        className={css.select}
        value={draft.tag}
        onChange={(e) => setDraft({ tag: e.target.value as NoteTag })}
      >
        {VALID_TAGS.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>

      <div className={css.actions}>
        <button
          type="button"
          onClick={handleCancel}
          className={css.cancelButton}
        >
          Cancel
        </button>
        <button type="submit" disabled={isPending} className={css.submitButton}>
          {isPending ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  );
}
