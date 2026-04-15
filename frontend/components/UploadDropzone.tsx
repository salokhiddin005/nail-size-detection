"use client";

import { Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";

export default function UploadDropzone({ onFile }: { onFile: (f: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  const handle = useCallback(
    (f: File | null | undefined) => {
      if (f && f.type.startsWith("image/")) onFile(f);
    },
    [onFile],
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        handle(e.dataTransfer.files?.[0]);
      }}
      onClick={() => inputRef.current?.click()}
      className={`glass cursor-pointer p-12 text-center transition-colors ${
        over ? "border-rose-400 bg-rose-400/5" : ""
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handle(e.target.files?.[0])}
      />
      <Upload className="mx-auto h-10 w-10 text-rose-400" />
      <p className="mt-4 font-semibold">Drop your photo here</p>
      <p className="text-sm text-white/60">or click to browse — JPG, PNG, HEIC</p>
    </div>
  );
}
