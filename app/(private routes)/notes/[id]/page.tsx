import { fetchNoteById } from "@/lib/api/clientApi";
import { Metadata } from "next";
import NoteDetailsClient from "./NoteDetails.client";

interface NotePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: NotePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const note = await fetchNoteById(resolvedParams.id);

  return {
    title: `${note.title} - NoteHub`,
    description: note.content
      ? note.content.substring(0, 160) +
        (note.content.length > 160 ? "..." : "")
      : `Read the note "${note.title}" in NoteHub.`,
    openGraph: {
      title: `${note.title} - NoteHub`,
      description: note.content
        ? note.content.substring(0, 160) +
          (note.content.length > 160 ? "..." : "")
        : `Read the note "${note.title}" in NoteHub.`,
      url: `https://notehub.vercel.app/notes/${resolvedParams.id}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub - Note Management App",
        },
      ],
    },
  };
}

export default function NoteFullPage() {
  return <NoteDetailsClient />;
}
