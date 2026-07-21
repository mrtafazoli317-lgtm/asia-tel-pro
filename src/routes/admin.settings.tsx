import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fetchContactSettings, type ContactSettings } from "@/lib/admin-data";
import { Loader2, Save } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsAdmin,
});

const defaults: ContactSettings = {
  phone: "",
  phone_display: "",
  address: "",
  email: "",
  hours: "",
  instagram: "",
  telegram: "",
  whatsapp: "",
};

function SettingsAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["site_settings", "contact"], queryFn: fetchContactSettings });
  const [form, setForm] = useState<ContactSettings>(defaults);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  useEffect(() => {
    if (data) setForm({ ...defaults, ...data });
  }, [data]);

  const save = useMutation({
    mutationFn: async (v: ContactSettings) => {
      const { error } = await supabase
        .from("site_settings" as never)
        .upsert({ key: "contact", value: v } as never);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["site_settings"] });
      setSavedAt(new Date());
    },
  });

  if (isLoading) return <Loader2 className="h-6 w-6 animate-spin text-primary" />;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-1">اطلاعات تماس</h1>
      <p className="text-sm text-muted-foreground mb-6">این اطلاعات در فوتر و صفحه تماس نمایش داده می‌شود.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate(form);
        }}
        className="space-y-4 rounded-2xl bg-white border p-6"
      >
        {(
          [
            ["phone", "شماره تماس (بین‌المللی)", "ltr"],
            ["phone_display", "نمایش شماره تماس", "rtl"],
            ["address", "آدرس", "rtl"],
            ["email", "ایمیل", "ltr"],
            ["hours", "ساعات کاری", "rtl"],
            ["whatsapp", "لینک واتساپ", "ltr"],
            ["instagram", "لینک اینستاگرام", "ltr"],
            ["telegram", "لینک تلگرام", "ltr"],
          ] as const
        ).map(([key, label, dir]) => (
          <div key={key}>
            <label className="text-xs font-medium block mb-1">{label}</label>
            <input
              dir={dir}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>
        ))}

        {save.error instanceof Error && (
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{save.error.message}</p>
        )}
        {savedAt && (
          <p className="text-sm text-green-700 bg-green-50 p-3 rounded-lg">
            ذخیره شد ({savedAt.toLocaleTimeString("fa-IR")})
          </p>
        )}

        <button
          type="submit"
          disabled={save.isPending}
          className="rounded-lg gradient-brand text-white px-6 py-2.5 text-sm font-semibold inline-flex items-center gap-2"
        >
          {save.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          ذخیره تغییرات
        </button>
      </form>
    </div>
  );
}
