import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fetchBlogPosts, type BlogRow } from "@/lib/admin-data";
import { ImageUpload } from "@/components/admin/image-upload";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/blog")({
  component: BlogAdmin,
});

type BlogDraft = Omit<BlogRow, "id" | "created_at" | "updated_at"> & { id?: string };
const empty: BlogDraft = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  cover_url: null,
  published: true,
};

function BlogAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["blog_posts", "all"],
    queryFn: () => fetchBlogPosts(false),
  });
  const [editing, setEditing] = useState<BlogDraft | null>(null);

  const save = useMutation({
    mutationFn: async (b: BlogDraft) => {
      if (b.id) {
        const { error } = await supabase.from("blog_posts" as never).update(b as never).eq("id", b.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("blog_posts" as never).insert(b as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blog_posts"] });
      setEditing(null);
    },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts" as never).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blog_posts"] }),
  });

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">مقالات بلاگ</h1>
          <p className="text-sm text-muted-foreground">مدیریت محتوای بلاگ سایت</p>
        </div>
        <button
          onClick={() => setEditing({ ...empty })}
          className="inline-flex items-center gap-2 rounded-full gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-glow"
        >
          <Plus className="h-4 w-4" />
          افزودن مقاله
        </button>
      </div>

      {isLoading ? (
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      ) : data?.length === 0 ? (
        <div className="rounded-2xl bg-white border p-10 text-center text-muted-foreground">
          هنوز مقاله‌ای اضافه نشده است.
        </div>
      ) : (
        <div className="rounded-2xl bg-white border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-muted-foreground">
              <tr>
                <th className="p-3 text-right">عنوان</th>
                <th className="p-3 text-right">slug</th>
                <th className="p-3 text-right">وضعیت</th>
                <th className="p-3 text-right">تاریخ</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {data?.map((b) => (
                <tr key={b.id} className="border-t hover:bg-slate-50">
                  <td className="p-3 font-medium">{b.title}</td>
                  <td className="p-3 text-muted-foreground" dir="ltr">
                    {b.slug}
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        b.published ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {b.published ? "منتشر شده" : "پیش‌نویس"}
                    </span>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">
                    {new Date(b.created_at).toLocaleDateString("fa-IR")}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => setEditing(b)} className="p-2 rounded-lg hover:bg-muted">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => confirm(`حذف "${b.title}"؟`) && del.mutate(b.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 grid place-items-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white">
              <h2 className="text-lg font-bold">{editing.id ? "ویرایش مقاله" : "افزودن مقاله"}</h2>
              <button onClick={() => setEditing(null)} className="p-2 rounded-lg hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                save.mutate(editing);
              }}
              className="p-5 space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium block mb-1">
                    عنوان <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    value={editing.title}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">
                    Slug (URL) <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    dir="ltr"
                    value={editing.slug}
                    onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">خلاصه</label>
                <textarea
                  rows={2}
                  value={editing.excerpt ?? ""}
                  onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">تصویر کاور</label>
                <ImageUpload
                  value={editing.cover_url}
                  onChange={(url) => setEditing({ ...editing, cover_url: url })}
                  folder="blog"
                />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">
                  محتوا <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={10}
                  value={editing.content}
                  onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                  className="w-full rounded-lg border px-3 py-2 text-sm font-mono"
                  placeholder="متن کامل مقاله (HTML یا متن ساده)"
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.published}
                  onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                />
                منتشر شود
              </label>

              {save.error instanceof Error && (
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{save.error.message}</p>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="rounded-lg px-4 py-2 text-sm hover:bg-muted"
                >
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
          </div>
        </div>
      )}
    </div>
  );
}
