import { useState, useEffect } from "react";
import { Globe, Mail, Shield, Bell, Users, Save, Loader2, Info, Upload, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/shared/services/api";
import toast from "react-hot-toast";

import { FaLinkedinIn, FaFacebookF, FaXTwitter, FaInstagram } from "react-icons/fa6";

const TABS = [
  { id: "platform", label: "Plateforme", icon: Globe, color: "blue" },
  { id: "social", label: "Email & Réseaux", icon: Mail, color: "brand" },
  { id: "security", label: "Sécurité", icon: Shield, color: "purple" },
  { id: "team", label: "Équipe", icon: Users, color: "teal" },
  { id: "maintenance", label: "Maintenance", icon: Bell, color: "orange" },
];

export default function AdminSettingsPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState("platform");

  const { data: settings, isLoading } = useQuery({
    queryKey: ["adminSettings"],
    queryFn: () => api.get("/admin/settings").then((r) => r.data),
    staleTime: 0,
    refetchOnMount: "always",
  });

  const [form, setForm] = useState(null);

  useEffect(() => {
    if (settings) {
      let improvements = settings.maintenance_improvements ?? "";
      try {
        const parsed = JSON.parse(improvements);
        if (Array.isArray(parsed)) improvements = parsed.join("\n");
      } catch {}
      let team = settings.team_members ?? "[]";
      try { const p = JSON.parse(team); if (!Array.isArray(p)) team = "[]"; } catch { team = "[]"; }
      setForm({
        site_name: settings.site_name ?? "",
        site_version: settings.site_version ?? "",
        site_description: settings.site_description ?? "",
        support_email: settings.support_email ?? "",
        maintenance_mode: settings.maintenance_mode === "true",
        maintenance_message: settings.maintenance_message ?? "",
        maintenance_estimated_return: settings.maintenance_estimated_return ?? "",
        maintenance_improvements: improvements,
        social_facebook: settings.social_facebook ?? "",
        social_twitter: settings.social_twitter ?? "",
        social_instagram: settings.social_instagram ?? "",
        social_linkedin: settings.social_linkedin ?? "",
        team_members: team,
      });
    }
  }, [settings]);

  const updateSettings = useMutation({
    mutationFn: (data) => api.put("/admin/settings", data),
    onSuccess: (updated) => {
      toast.success("Paramètres enregistrés");
      qc.setQueryData(["adminSettings"], updated);
      let improvements = updated.maintenance_improvements ?? "";
      try { const p = JSON.parse(improvements); if (Array.isArray(p)) improvements = p.join("\n"); } catch {}
      let team = updated.team_members ?? "[]";
      try { const p = JSON.parse(team); if (!Array.isArray(p)) team = "[]"; } catch { team = "[]"; }
      setForm({
        site_name: updated.site_name ?? "",
        site_version: updated.site_version ?? "",
        site_description: updated.site_description ?? "",
        support_email: updated.support_email ?? "",
        maintenance_mode: updated.maintenance_mode === "true",
        maintenance_message: updated.maintenance_message ?? "",
        maintenance_estimated_return: updated.maintenance_estimated_return ?? "",
        maintenance_improvements: improvements,
        social_facebook: updated.social_facebook ?? "",
        social_twitter: updated.social_twitter ?? "",
        social_instagram: updated.social_instagram ?? "",
        social_linkedin: updated.social_linkedin ?? "",
        team_members: team,
      });
      qc.setQueryData(["siteSettings"], {
        siteName: updated.site_name,
        siteVersion: updated.site_version,
        siteDescription: updated.site_description,
        maintenanceMode: updated.maintenance_mode === "true",
        supportEmail: updated.support_email,
        maintenanceMessage: updated.maintenance_message,
        maintenanceEstimatedReturn: updated.maintenance_estimated_return,
        maintenanceImprovements: updated.maintenance_improvements,
        socialFacebook: updated.social_facebook,
        socialTwitter: updated.social_twitter,
        socialInstagram: updated.social_instagram,
        socialLinkedin: updated.social_linkedin,
        teamMembers: JSON.parse(updated.team_members ?? "[]"),
      });
    },
    onError: (e) => toast.error(e.response?.data?.error ?? "Erreur lors de l'enregistrement"),
  });

  const handleSave = () => {
    const improvements = form.maintenance_improvements
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const teamMembers = typeof form.team_members === "string"
      ? form.team_members
      : JSON.stringify(form.team_members);
    updateSettings.mutate({
      ...form,
      maintenance_mode: String(form.maintenance_mode),
      maintenance_improvements: JSON.stringify(improvements),
      team_members: teamMembers,
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

      <div className="border-b border-gray-200">
        <nav className="flex gap-1 -mb-px">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  active
                    ? "border-brand-600 text-brand-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        {tab === "platform" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
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
        )}

        {tab === "social" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center">
                <Mail className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Email & Réseaux</h3>
                <p className="text-xs text-gray-400">Contact et liens sociaux</p>
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
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Facebook</label>
              <input
                value={form.social_facebook}
                onChange={(e) => setForm({ ...form, social_facebook: e.target.value })}
                className="w-full px-3 py-2 bg-gray-100 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Twitter / X</label>
              <input
                value={form.social_twitter}
                onChange={(e) => setForm({ ...form, social_twitter: e.target.value })}
                className="w-full px-3 py-2 bg-gray-100 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Instagram</label>
              <input
                value={form.social_instagram}
                onChange={(e) => setForm({ ...form, social_instagram: e.target.value })}
                className="w-full px-3 py-2 bg-gray-100 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">LinkedIn</label>
              <input
                value={form.social_linkedin}
                onChange={(e) => setForm({ ...form, social_linkedin: e.target.value })}
                className="w-full px-3 py-2 bg-gray-100 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
            </div>
          </div>
        )}

        {tab === "security" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
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
        )}

        {tab === "team" && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                <Users className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Équipe</h3>
                <p className="text-xs text-gray-400">Membres de l'équipe</p>
              </div>
            </div>
            {(() => {
              let members = [];
              try { members = typeof form.team_members === "string" ? JSON.parse(form.team_members) : form.team_members; } catch { members = []; }
              if (!Array.isArray(members)) members = [];
              return members.map((member, idx) => (
                <div key={idx} className="border border-gray-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-700">Membre {idx + 1}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Nom</label>
                      <input value={member.name} onChange={(e) => { const m = [...members]; m[idx] = { ...m[idx], name: e.target.value }; setForm({ ...form, team_members: JSON.stringify(m) }); }} className="w-full px-3 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Rôle</label>
                      <input value={member.role} onChange={(e) => { const m = [...members]; m[idx] = { ...m[idx], role: e.target.value }; setForm({ ...form, team_members: JSON.stringify(m) }); }} className="w-full px-3 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Initiales</label>
                      <input value={member.initials} maxLength={4} onChange={(e) => { const m = [...members]; m[idx] = { ...m[idx], initials: e.target.value }; setForm({ ...form, team_members: JSON.stringify(m) }); }} className="w-full px-3 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Photo (URL)</label>
                      <div className="flex gap-2">
                        <input value={member.photo || ""} onChange={(e) => { const m = [...members]; m[idx] = { ...m[idx], photo: e.target.value }; setForm({ ...form, team_members: JSON.stringify(m) }); }} className="flex-1 px-3 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50" placeholder="https://..." />
                        <label className="shrink-0 flex items-center justify-center w-9 h-9 bg-gray-100 rounded-xl cursor-pointer hover:bg-gray-200 transition-colors">
                          <Upload className="w-4 h-4 text-gray-500" />
                          <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const fd = new FormData();
                            fd.append("file", file);
                            try {
                              const res = await api.post("/upload/image", fd);
                              const url = res.data.url;
                              const m = [...members]; m[idx] = { ...m[idx], photo: url }; setForm({ ...form, team_members: JSON.stringify(m) });
                              toast.success("Photo uploadée");
                            } catch { toast.error("Erreur upload"); }
                          }} />
                        </label>
                        {member.photo && (
                          <button onClick={() => { const m = [...members]; m[idx] = { ...m[idx], photo: "" }; setForm({ ...form, team_members: JSON.stringify(m) }); }} className="shrink-0 flex items-center justify-center w-9 h-9 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
                            <X className="w-4 h-4 text-red-500" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Bio</label>
                    <textarea value={member.bio || ""} onChange={(e) => { const m = [...members]; m[idx] = { ...m[idx], bio: e.target.value }; setForm({ ...form, team_members: JSON.stringify(m) }); }} rows={2} className="w-full px-3 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-none" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1"><FaLinkedinIn className="w-3 h-3 text-[#0A66C2]" /> LinkedIn</label>
                      <input value={member.linkedin || ""} onChange={(e) => { const m = [...members]; m[idx] = { ...m[idx], linkedin: e.target.value }; setForm({ ...form, team_members: JSON.stringify(m) }); }} className="w-full px-3 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50" />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1"><FaFacebookF className="w-3 h-3 text-[#1877F2]" /> Facebook</label>
                      <input value={member.facebook || ""} onChange={(e) => { const m = [...members]; m[idx] = { ...m[idx], facebook: e.target.value }; setForm({ ...form, team_members: JSON.stringify(m) }); }} className="w-full px-3 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50" />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1"><FaXTwitter className="w-3 h-3" /> Twitter / X</label>
                      <input value={member.twitter || ""} onChange={(e) => { const m = [...members]; m[idx] = { ...m[idx], twitter: e.target.value }; setForm({ ...form, team_members: JSON.stringify(m) }); }} className="w-full px-3 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50" />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1"><FaInstagram className="w-3 h-3 text-[#E4405F]" /> Instagram</label>
                      <input value={member.instagram || ""} onChange={(e) => { const m = [...members]; m[idx] = { ...m[idx], instagram: e.target.value }; setForm({ ...form, team_members: JSON.stringify(m) }); }} className="w-full px-3 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50" />
                    </div>
                  </div>
                  {member.photo && (
                    <div className="flex justify-center">
                      <img src={member.photo} alt={member.name} className="h-20 w-20 rounded-full object-cover" />
                    </div>
                  )}
                </div>
              ));
            })()}
          </div>
        )}

        {tab === "maintenance" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
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
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Message de maintenance</label>
                <textarea
                  value={form.maintenance_message}
                  onChange={(e) => setForm({ ...form, maintenance_message: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-gray-100 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Retour estimé</label>
                <input
                  value={form.maintenance_estimated_return}
                  onChange={(e) => setForm({ ...form, maintenance_estimated_return: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-100 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Améliorations (un par ligne)</label>
                <textarea
                  value={form.maintenance_improvements}
                  onChange={(e) => setForm({ ...form, maintenance_improvements: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-100 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-none"
                />
              </div>
            </div>
            <div className="flex items-start gap-2 text-xs text-gray-400 bg-gray-50 rounded-xl p-3">
              <Info className="w-4 h-4 mt-0.5 shrink-0" />
              <p>En mode maintenance, seuls les administrateurs peuvent accéder au site.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
