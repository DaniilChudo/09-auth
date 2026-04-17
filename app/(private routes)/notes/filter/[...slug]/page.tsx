import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import Notes from "./Notes.client";
import { Metadata } from "next";

interface FilteredNotesPageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: FilteredNotesPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const tag = slug[0] === "all" ? undefined : slug[0];
  const filterName = tag || "All Notes";

  return {
    title: `${filterName} - NoteHub`,
    description: `Browse ${filterName.toLowerCase()} in NoteHub. Find and organize your notes with our powerful filtering system.`,
    openGraph: {
      title: `${filterName} - NoteHub`,
      description: `Browse ${filterName.toLowerCase()} in NoteHub. Find and organize your notes with our powerful filtering system.`,
      url: `https://notehub.vercel.app/notes/filter/${slug.join("/")}`,
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

export default async function FilteredNotesPage({
  params,
}: FilteredNotesPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const tag = slug[0] === "all" ? undefined : slug[0];

  const queryClient = new QueryClient();

  // Prefetch data on server
  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag],
    queryFn: () => fetchNotes(1, 12, "", tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Notes tag={tag} />
    </HydrationBoundary>
  );
}
