import { useRegisterSW } from "virtual:pwa-register/react";
import { RefreshCw, X } from "lucide-react";

export default function UpdateBanner() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError(error) {
      console.error("[PWA] Erreur d'enregistrement:", error);
    },
  });

  if (!needRefresh && !offlineReady) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-[100] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-xl shadow-gray-900/10 dark:border-gray-700 dark:bg-gray-900">
        {needRefresh ? (
          <>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Nouvelle version disponible</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Actualisez pour profiter des dernières améliorations.</p>
            </div>
            <button
              onClick={() => updateServiceWorker(true)}
              className="flex shrink-0 items-center gap-1.5 rounded-xl bg-brand-800 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-900"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Actualiser
            </button>
          </>
        ) : (
          <>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Application prête hors ligne</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Vous pouvez continuer à naviguer sans connexion.</p>
            </div>
            <button
              onClick={() => setOfflineReady(false)}
              className="shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}