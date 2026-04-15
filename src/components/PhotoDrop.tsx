import { useRef, useState } from "react";
import { uploadPhoto } from "@/api/github";
import { Upload, X } from "lucide-react";

export default function PhotoDrop({
  slug,
  value,
  onChange,
}: {
  slug: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  async function handleFile(file: File) {
    setError(null);
    setBusy(true);
    try {
      const url = await uploadPhoto(file, slug || "hon");
      onChange(url);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const f = e.dataTransfer.files[0];
          if (f && f.type.startsWith("image/")) handleFile(f);
        }}
        onClick={() => inputRef.current?.click()}
        className={`relative rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
          dragging ? "border-gold bg-[#FFF7E5]" : "border-[rgba(61,43,31,0.22)] bg-white"
        }`}
      >
        {value ? (
          <div className="flex items-center gap-3">
            <img src={value} alt="" className="w-20 h-20 object-cover rounded-lg" />
            <div className="flex-1 text-left">
              <div className="text-sm font-medium truncate">{value.split("/").pop()}</div>
              <div className="text-xs text-subink">Click or drop to replace</div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              className="p-1 rounded hover:bg-[rgba(61,43,31,0.08)]"
              aria-label="Remove photo"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-subink">
            <Upload size={24} />
            <div className="text-sm">
              {busy ? "Uploading…" : "Drop a photo here, or click to pick"}
            </div>
            <div className="text-xs">Or paste a public URL below</div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
      </div>
      {error && <p className="text-xs text-[#9B1B30] mt-1">{error}</p>}
      <input
        type="url"
        placeholder="https://…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-2 px-3 py-2 rounded-lg bg-white border border-[rgba(61,43,31,0.18)] text-sm"
      />
    </div>
  );
}
