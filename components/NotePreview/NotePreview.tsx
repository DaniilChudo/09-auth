import { Note } from "@/types/note";
import css from "./NotePreview.module.css";

export default function NotePreview({ note }: { note: Note }) {
  return (
    <div className={css.container}>
      <div className={css.item}>
        <h3>{note.title}</h3>
        <p className={css.tag}>{note.tag}</p>
        <p className={css.content}>{note.content.substring(0, 100)}...</p>
      </div>
    </div>
  );
}
