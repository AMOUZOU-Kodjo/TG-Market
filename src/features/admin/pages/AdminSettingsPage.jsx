import { useState, useEffect } from "react";
import { Globe, Mail, Shield, Bell, Save, Loader2, Info } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/shared/services/api";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const qc = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["adminSettings"],
    queryFn: () => api.get("/admin/settings").then((r) => r.data),
    staleTime: 0,
    refetchOnMount: "always",
  });

  const [form, setForm] = useState(null);

  useEffect(() => {
    if (settings) {
      setForm({
        site_name: settings.site_name ?? "",
        site_version: settings.site_version ?? "",
        site_description: settings.site_description ?? "",
        support_email: settings.support_email ?? "",
        maintenance_mode: settings.maintenance_mode === "true",
      });
    }
  }, [settings]);

  const updateSettings = useMutation({
    mutationFn: (data) => api.put("/admin/settings", data),
    onSuccess: (updated) => {
      toast.success("Paramètres enregistrés");
      qc.setQueryData(["adminSettings"], updated);
      setForm({
        site_name: updated.site_name ?? "",
        site_version: updated.site_version ?? "",
        site_description: updated.site_description ?? "",
        support_email: updated.support_email ?? "",
        maintenance_mode: updated.maintenance_mode === "true",
      });
      qc.setQueryData(["siteSettings"], {
        siteName: updated.site_name,
        siteVersion: updated.site_version,
        siteDescription: updated.site_description,
        maintenanceMode: updated.maintenance_mode === "true",
        supportEmail: updated.support_email,
      });
    },
    onError: (e) => toast.error(e.response?.data?.error ?? "Erreur lors de l'enregistrement"),
  });

  const handleSave = () => {
    updateSettings.mutate({
      ...form,
      maintenance_mode: String(form.maintenance_mode),
    });
  };

  if (isLoading || !form) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Paramètres</h1>
        <button
          onClick={handleSave}
          disabled={updateSettings.isPending}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-xl hover:bg-brand-600 disabled:opacity-50 transition-colors"
        >
          {updateSettings.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Enregistrer
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Globe className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Plateforme</h3>
              <p className="text-xs text-gray-400">Informations générales</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Nom du site</label>
              <input
                value={form.site_name}
                onChange={(e) => setForm({ ...form, site_name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-100 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Version</label>
              <input
                value={form.site_version}
                onChange={(e) => setForm({ ...form, site_version: e.target.value })}
                className="w-full px-3 py-2 bg-gray-100 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
              <textarea
                value={form.site_description}
                onChange={(e) => setForm({ ...form, site_description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 bg-gray-100 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center">
              <Mail className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Email</h3>
              <p className="text-xs text-gray-400">Contact support</p>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Email support</label>
            <input
              type="email"
              value={form.support_email}
              onChange={(e) => setForm({ ...form, support_email: e.target.value })}
              className="w-full px-3 py-2 bg-gray-100 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Sécurité</h3>
              <p className="text-xs text-gray-400">Paramètres de sécurité</p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-500">
            <p>Rate limiting : <span className="text-green-600 font-medium">Activé</span></p>
            <p>JWT expiry : <span className="text-gray-900 font-medium">24h</span></p>
            <p>Refresh expiry : <span className="text-gray-900 font-medium">7j</span></p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
              <Bell className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Maintenance</h3>
              <p className="text-xs text-gray-400">Mode maintenance</p>
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              className={`relative w-11 h-6 rounded-full transition-colors ${form.maintenance_mode ? "bg-orange-500" : "bg-gray-200"}`}
              onClick={() => setForm({ ...form, maintenance_mode: !form.maintenance_mode })}
            >
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.maintenance_mode ? "translate-x-5" : ""}`} />
            </div>
            <span className="text-sm text-gray-600">{form.maintenance_mode ? "Activé" : "Désactivé"}</span>
          </label>
          <div className="flex items-start gap-2 text-xs text-gray-400 bg-gray-50 rounded-xl p-3">
            <Info className="w-4 h-4 mt-0.5 shrink-0" />
            <p>En mode maintenance, seuls les administrateurs peuvent accéder au site.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
