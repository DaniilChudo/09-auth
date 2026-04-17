"use client";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/clientApi";
import Modal from "@/components/Modal/Modal";
import NoteDetails from "../../../../components/NoteDetails/NoteDetails";

interface NotePreviewProps {
  id: string;
}

export default function NotePreview({ id }: NotePreviewProps) {
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal onClose={handleClose}>
      <div style={{ position: "relative" }}>
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "-10px",
            right: "-10px",
            background: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            cursor: "pointer",
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ×
        </button>
        {isLoading && <p>Loading details...</p>}
        {error && <p>Error loading note.</p>}
        {data && <NoteDetails note={data} />}
      </div>
    </Modal>
  );
}
