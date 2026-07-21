import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fetchBanners, type BannerRow } from "@/lib/admin-data";
import { ImageUpload } from "@/components/admin/image-upload";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/banners")({
  component: BannersAdmin,
});

type BannerDraft = Omit<BannerRow, "id"> & { id?: string };
const empty: BannerDraft = {
  title: "",
  subtitle: "",
  image_url: null,
  link_url: "",
  active: true,
  sort_order: 0,
};

function BannersAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["banners", "all"], queryFn: () => fetchBanners(false) });
  const [editing, setEditing] = useState<BannerDraft | null>(null);

  const save = useMutation({
    mutationFn: async (b: BannerDraft) => {
      if (b.id) {
        const { error } = await supabase.from("banners" as never).update(b as never).eq("id", b.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("banners" as never).insert(b as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["banners"] });
      setEditing(null);
    },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("banners" as never).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["banners"] }),
  });

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">بنرها و اسلایدر</h1>
          <p className="text-sm text-muted-foreground">مدیریت بنرهای تبلیغاتی صفحه اصلی</p>
        </div>
        <button
          onClick={() => setEditing({ ...empty, sort_order: (data?.length ?? 0) + 1 })}
          className="inline-flex items-center gap-2 rounded-full gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-glow"
        >
          <Plus className="h-4 w-4" />
          افزودن بنر
        </button>
      </div>

      {isLoading ? (
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      ) : data?.length === 0 ? (
        <div className="rounded-2xl bg-white border p-10 text-center text-muted-foreground">
          هنوز بنری اضافه نشده است.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data?.map((b) => (
            <div key={b.id} className="rounded-2xl bg-white border overflow-hidden">
              {b.image_url ? (
                <img src={b.image_url} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-gradient-to-br from-orange-400 to-red-500" />
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold">{b.title}</h3>
                    {b.subtitle && <p className="text-xs text-muted-foreground mt-1">{b.subtitle}</p>}
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      b.active ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {b.active ? "فعال" : "غیرفعال"}
                  </span>
                </div>
                <div className="mt-3 flex gap-1 justify-end">
                  <button onClick={() => setEditing(b)} className="p-2 rounded-lg hover:bg-muted">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => confirm("حذف بنر؟") && del.mutate(b.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <Modal onClose={() => setEditing(null)} title={editing.id ? "ویرایش بنر" : "افزودن بنر"}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              save.mutate(editing);
            }}
            className="space-y-4"
          >
            <L label="عنوان" required>
              <input
                required
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </L>
            <L label="زیرعنوان">
              <input
                value={editing.subtitle ?? ""}
                onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </L>
            <L label="تصویر بنر">
              <ImageUpload
                value={editing.image_url}
                onChange={(url) => setEditing({ ...editing, image_url: url })}
                folder="banners"
              />
            </L>
            <L label="لینک (اختیاری)">
              <input
                dir="ltr"
                value={editing.link_url ?? ""}
                onChange={(e) => setEditing({ ...editing, link_url: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </L>
            <div className="grid grid-cols-2 gap-4">
              <L label="ترتیب">
                <input
                  type="number"
                  value={editing.sort_order}
                  onChange={(e) => setEditing({ ...editing, sort_order: +e.target.value })}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
              </L>
              <label className="flex items-center gap-2 text-sm mt-6">
                <input
                  type="checkbox"
                  checked={editing.active}
                  onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                />
                فعال
              </label>
            </div>
            {save.error instanceof Error && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{save.error.message}</p>
            )}
            <div className="flex justify-end gap-2 pt-2 border-t">
              <button type="button" onClick={() => setEditing(null)} className="rounded-lg px-4 py-2 text-sm hover:bg-muted">
                انصراف
              </button>
              <button
                type="submit"
                disabled={save.isPending}
                className="rounded-lg gradient-brand text-white px-6 py-2 text-sm font-semibold inline-flex items-center gap-2"
              >
                {save.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                ذخیره
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 grid place-items-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function L({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium block mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
