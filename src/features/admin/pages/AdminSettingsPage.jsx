import { Settings, Globe, Mail, Shield, Bell } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Paramètres</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Globe className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Plateforme</h3>
              <p className="text-xs text-gray-400">Informations générales</p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-500">
            <p>Nom : <span className="text-gray-900 font-medium">TG-Market</span></p>
            <p>Version : <span className="text-gray-900 font-medium">1.0.0</span></p>
            <p>Environnement : <span className="text-gray-900 font-medium">Production</span></p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center">
              <Mail className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Email</h3>
              <p className="text-xs text-gray-400">Configuration SMTP</p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-500">
            <p>SMTP : <span className="text-gray-900 font-medium">smtp.gmail.com</span></p>
            <p>Port : <span className="text-gray-900 font-medium">587</span></p>
            <p>Statut : <span className="text-green-600 font-medium">Configuré</span></p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
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

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
              <Bell className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
              <p className="text-xs text-gray-400">Paramètres de notification</p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-500">
            <p>Email : <span className="text-green-600 font-medium">Activé</span></p>
            <p>SMS : <span className="text-gray-400 font-medium">Désactivé</span></p>
            <p>Push : <span className="text-green-600 font-medium">Activé</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
