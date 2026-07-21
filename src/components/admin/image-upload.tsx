import { useRef, useState } from "react";
import { uploadMedia } from "@/lib/admin-data";
import { Upload, Loader2, X } from "lucide-react";

export function ImageUpload({
  value,
  onChange,
  folder,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  folder: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handle(f: File) {
    setBusy(true);
    setErr(null);
    try {
      const url = await uploadMedia(f, folder);
      onChange(url);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "خطا در آپلود");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative w-32 h-32 rounded-xl overflow-hidden border">
          <img src={value} alt="" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-1 left-1 h-6 w-6 rounded-full bg-black/60 text-white grid place-items-center"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : null}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          آپلود تصویر
        </button>
        <input
          ref={ref}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handle(f);
            e.target.value = "";
          }}
        />
        <input
          type="url"
          dir="ltr"
          placeholder="یا لینک تصویر"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value || null)}
          className="flex-1 rounded-lg border px-3 py-2 text-sm"
        />
      </div>
      {err && <p className="text-xs text-red-600">{err}</p>}
    </div>
  );
}
