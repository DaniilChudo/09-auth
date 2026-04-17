import css from "./not-found.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found - NoteHub",
  description:
    "The page you are looking for does not exist in NoteHub. Return to the homepage to continue managing your notes.",
  openGraph: {
    title: "Page Not Found - NoteHub",
    description:
      "The page you are looking for does not exist in NoteHub. Return to the homepage to continue managing your notes.",
    url: "https://notehub.vercel.app/404",
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

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "100px 20px" }}>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </div>
  );
}
