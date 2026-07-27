import { AlertTriangle, Shield } from "lucide-react";

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-white">Signalements</h1>

      <div className="rounded-2xl border border-gray-800 bg-gray-900">
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <AlertTriangle className="w-12 h-12 mb-3 opacity-50" />
          <p className="text-sm font-medium">Aucun signalement</p>
          <p className="text-xs text-gray-600 mt-1">Cette fonctionnalité sera bientôt disponible.</p>
        </div>
      </div>
    </div>
  );
}
