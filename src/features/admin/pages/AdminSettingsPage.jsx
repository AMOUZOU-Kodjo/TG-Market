import { Settings, Globe, Mail, Shield, Bell } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-white">Paramètres</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-brand-700/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Plateforme</h3>
              <p className="text-xs text-gray-500">Informations générales</p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-400">
            <p>Nom : <span className="text-white">TG-Market</span></p>
            <p>Version : <span className="text-white">1.0.0</span></p>
            <p>Environnement : <span className="text-white">Production</span></p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-brand-700/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Email</h3>
              <p className="text-xs text-gray-500">Configuration SMTP</p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-400">
            <p>SMTP : <span className="text-white">smtp.gmail.com</span></p>
            <p>Port : <span className="text-white">587</span></p>
            <p>Statut : <span className="text-brand-400">Configuré</span></p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-brand-700/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Sécurité</h3>
              <p className="text-xs text-gray-500">Paramètres de sécurité</p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-400">
            <p>Rate limiting : <span className="text-brand-400">Activé</span></p>
            <p>JWT expiry : <span className="text-white">24h</span></p>
            <p>Refresh expiry : <span className="text-white">7j</span></p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-brand-700/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Notifications</h3>
              <p className="text-xs text-gray-500">Paramètres de notification</p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-400">
            <p>Email : <span className="text-brand-400">Activé</span></p>
            <p>SMS : <span className="text-gray-600">Désactivé</span></p>
            <p>Push : <span className="text-brand-400">Activé</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
