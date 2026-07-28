import { AlertTriangle } from "lucide-react";

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Signalements</h1>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <AlertTriangle className="w-12 h-12 mb-3 opacity-50" />
          <p className="text-sm font-medium">Aucun signalement</p>
          <p className="text-xs text-gray-300 mt-1">Cette fonctionnalité sera bientôt disponible.</p>
        </div>
      </div>
    </div>
  );
}
