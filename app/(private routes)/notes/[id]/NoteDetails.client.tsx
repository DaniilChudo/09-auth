"use client";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import NoteDetails from "@/components/NoteDetails/NoteDetails";

export default function NoteDetailsClient() {
  const router = useRouter();
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id as string),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading note.</p>;
  if (!data) return <p>Note not found.</p>;

  return (
    <div>
      <button onClick={() => router.back()} style={{ marginBottom: "20px" }}>
        ← Back
      </button>
      <NoteDetails note={data} />
    </div>
  );
}
