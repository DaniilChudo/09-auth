"use client";

import { useEffect, useState, ReactNode } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";

interface Props {
  children: ReactNode;
  onClose: () => void;
}

export default function Modal({ children, onClose }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Використовуємо requestAnimationFrame для відкладеного встановлення mounted
    const frame = requestAnimationFrame(() => setMounted(true));

    const handleEsc = (e: KeyboardEvent) => {
      if (e.code === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      cancelAnimationFrame(frame); // очищаємо
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={css.backdrop}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={css.modal}>{children}</div>
    </div>,
    document.getElementById("modal-root") as HTMLElement,
  );
}
