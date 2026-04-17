"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <p style={{ color: "red" }}>Could not fetch note details.</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
