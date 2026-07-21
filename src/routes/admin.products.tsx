import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fetchProducts, formatToman, type ProductRow } from "@/lib/admin-data";
import { ImageUpload } from "@/components/admin/image-upload";
import { Plus, Pencil, Trash2, X, Loader2, Search } from "lucide-react";

export const Route = createFileRoute("/admin/products")({
  component: ProductsAdmin,
});

const emptyProduct: Omit<ProductRow, "updated_at"> = {
  id: "",
  name: "",
  series: "iPhone 17",
  year: 2025,
  price: 0,
  old_price: null,
  in_stock: true,
  storage: "",
  display: "",
  chip: "",
  camera: "",
  color: "from-slate-800 to-slate-600",
  image_url: null,
  featured: false,
  sort_order: 0,
};

function ProductsAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });
  const [editing, setEditing] = useState<typeof emptyProduct | null>(null);
  const [search, setSearch] = useState("");

  const save = useMutation({
    mutationFn: async (p: typeof emptyProduct) => {
      const { error } = await supabase.from("products" as never).upsert(p as never);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      setEditing(null);
    },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products" as never).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });

  const filtered = (data ?? []).filter(
    (p) => p.name.includes(search) || p.series.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">محصولات و قیمت‌ها</h1>
          <p className="text-sm text-muted-foreground">مدیریت کاتالوگ آیفون‌ها</p>
        </div>
        <button
          onClick={() => setEditing({ ...emptyProduct, sort_order: (data?.length ?? 0) + 1 })}
          className="inline-flex items-center gap-2 rounded-full gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-glow"
        >
          <Plus className="h-4 w-4" />
          افزودن محصول
        </button>
      </div>

      <div className="mb-4 relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجو در نام یا سری..."
          className="w-full rounded-xl border bg-white px-4 pr-10 py-2.5 text-sm"
        />
      </div>

      {isLoading ? (
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      ) : (
        <div className="rounded-2xl bg-white border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-muted-foreground">
              <tr>
                <th className="p-3 text-right">تصویر</th>
                <th className="p-3 text-right">نام</th>
                <th className="p-3 text-right">سری</th>
                <th className="p-3 text-right">قیمت</th>
                <th className="p-3 text-right">موجودی</th>
                <th className="p-3 text-right">ویژه</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t hover:bg-slate-50">
                  <td className="p-3">
                    {p.image_url ? (
                      <img src={p.image_url} className="h-10 w-10 rounded-lg object-cover" />
                    ) : (
                      <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${p.color}`} />
                    )}
                  </td>
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3 text-muted-foreground">{p.series}</td>
                  <td className="p-3">{formatToman(p.price)}</td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                        p.in_stock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.in_stock ? "موجود" : "ناموجود"}
                    </span>
                  </td>
                  <td className="p-3">{p.featured ? "★" : "—"}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => setEditing({ ...p })}
                        className="p-2 rounded-lg hover:bg-muted"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`حذف ${p.name}؟`)) del.mutate(p.id);
                        }}
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
        <ProductModal
          value={editing}
          onCancel={() => setEditing(null)}
          onSave={(p) => save.mutate(p)}
          saving={save.isPending}
          error={save.error instanceof Error ? save.error.message : null}
        />
      )}
    </div>
  );
}

function ProductModal({
  value,
  onCancel,
  onSave,
  saving,
  error,
}: {
  value: typeof emptyProduct;
  onCancel: () => void;
  onSave: (p: typeof emptyProduct) => void;
  saving: boolean;
  error: string | null;
}) {
  const [p, setP] = useState(value);
  const isNew = !value.id;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 grid place-items-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white">
          <h2 className="text-lg font-bold">{isNew ? "افزودن محصول" : "ویرایش محصول"}</h2>
          <button onClick={onCancel} className="p-2 rounded-lg hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(p);
          }}
          className="p-5 space-y-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="شناسه (URL slug)" required>
              <input
                required
                dir="ltr"
                disabled={!isNew}
                value={p.id}
                onChange={(e) => setP({ ...p, id: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm disabled:bg-muted"
              />
            </Field>
            <Field label="نام محصول" required>
              <input
                required
                value={p.name}
                onChange={(e) => setP({ ...p, name: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </Field>
            <Field label="سری">
              <input
                value={p.series}
                onChange={(e) => setP({ ...p, series: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </Field>
            <Field label="سال">
              <input
                type="number"
                value={p.year}
                onChange={(e) => setP({ ...p, year: +e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </Field>
            <Field label="قیمت (تومان)" required>
              <input
                type="number"
                required
                value={p.price}
                onChange={(e) => setP({ ...p, price: +e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </Field>
            <Field label="قیمت قبلی (اختیاری)">
              <input
                type="number"
                value={p.old_price ?? ""}
                onChange={(e) => setP({ ...p, old_price: e.target.value ? +e.target.value : null })}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </Field>
            <Field label="حافظه">
              <input
                value={p.storage}
                onChange={(e) => setP({ ...p, storage: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </Field>
            <Field label="نمایشگر">
              <input
                value={p.display}
                onChange={(e) => setP({ ...p, display: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </Field>
            <Field label="چیپست">
              <input
                value={p.chip}
                onChange={(e) => setP({ ...p, chip: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </Field>
            <Field label="دوربین">
              <input
                value={p.camera}
                onChange={(e) => setP({ ...p, camera: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </Field>
            <Field label="گرادیانت رنگ (Tailwind)">
              <input
                dir="ltr"
                value={p.color}
                onChange={(e) => setP({ ...p, color: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </Field>
            <Field label="ترتیب نمایش">
              <input
                type="number"
                value={p.sort_order}
                onChange={(e) => setP({ ...p, sort_order: +e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </Field>
          </div>

          <Field label="تصویر محصول">
            <ImageUpload
              value={p.image_url}
              onChange={(url) => setP({ ...p, image_url: url })}
              folder="products"
            />
          </Field>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={p.in_stock}
                onChange={(e) => setP({ ...p, in_stock: e.target.checked })}
              />
              موجود در انبار
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={p.featured}
                onChange={(e) => setP({ ...p, featured: e.target.checked })}
              />
              محصول ویژه (نمایش در صفحه اصلی)
            </label>
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

          <div className="flex justify-end gap-2 pt-2 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg px-4 py-2 text-sm hover:bg-muted"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg gradient-brand text-white px-6 py-2 text-sm font-semibold inline-flex items-center gap-2"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              ذخیره
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-medium block mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
