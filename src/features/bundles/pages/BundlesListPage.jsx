import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, Search, ArrowLeft, Loader2 } from "lucide-react";
import { usePublicBundles } from "@/features/bundles/hooks/useBundles";
import { formatCFA } from "@/shared/utils/format";
import EmptyState from "@/shared/ui/EmptyState";

function BundleCard({ bundle }) {
  const items = bundle.items ?? [];
  const totalPrice = bundle.totalPrice ?? 0;
  const bundlePrice = bundle.bundlePrice ?? 0;
  const savings = totalPrice - bundlePrice;
  const savingsPct = totalPrice > 0 ? Math.round((savings / totalPrice) * 100) : 0;

  const thumbs = items.slice(0, 4).map((item) => item?.product?.images?.[0] ?? null);
  const hasImages = thumbs.some(Boolean);
  const count = items.length;

  return (
    <Link
      to={`/lot/${bundle.id}`}
      className="group block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-800"
    >
      <div className="aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-700">
        {hasImages ? (
          count === 1 ? (
            <img src={thumbs[0]} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
          ) : count === 2 ? (
            <div className="flex h-full">
              {thumbs.slice(0, 2).map((src, i) => (
                <div key={i} className="flex-1 overflow-hidden border-r border-white/20 last:border-r-0 dark:border-gray-900/40">
                  {src ? (
                    <img src={src} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full items-center justify-center"><Package className="h-6 w-6 text-gray-300" /></div>
                  )}
                </div>
              ))}
            </div>
          ) : count === 3 ? (
            <div className="flex h-full">
              <div className="w-1/2 overflow-hidden border-r border-white/20 dark:border-gray-900/40">
                {thumbs[0] ? (
                  <img src={thumbs[0]} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                ) : (
                  <div className="flex h-full items-center justify-center"><Package className="h-6 w-6 text-gray-300" /></div>
                )}
              </div>
              <div className="flex w-1/2 flex-col">
                {thumbs.slice(1, 3).map((src, i) => (
                  <div key={i} className="flex-1 overflow-hidden border-b border-white/20 last:border-b-0 dark:border-gray-900/40">
                    {src ? (
                      <img src={src} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center"><Package className="h-6 w-6 text-gray-300" /></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid h-full grid-cols-2 grid-rows-2">
              {thumbs.map((src, i) => (
                <div key={i} className="overflow-hidden border-r border-b border-white/20 last:border-r-0 [&:nth-child(2)]:border-r-0 dark:border-gray-900/40">
                  {i < 3 && src ? (
                    <img src={src} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gray-200/60 dark:bg-gray-700/60">
                      {i === 3 && count > 4 ? (
                        <span className="text-sm font-bold text-gray-500 dark:text-gray-400">+{count - 3}</span>
                      ) : (
                        <Package className="h-6 w-6 text-gray-300" />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package className="h-10 w-10 text-gray-400" />
          </div>
        )}
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">{bundle.title}</h3>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-base font-bold text-brand-800">{formatCFA(bundlePrice)}</span>
          <span className="text-xs text-gray-400 line-through">{formatCFA(totalPrice)}</span>
          {savingsPct > 0 && (
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700 dark:bg-green-900/20 dark:text-green-400">
              -{savingsPct}%
            </span>
          )}
        </div>
        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <Package className="h-3 w-3" />
          {count} produit{count > 1 ? "s" : ""}
        </p>
      </div>
    </Link>
  );
}

export default function BundlesListPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { data, isLoading } = usePublicBundles({ perPage: 50, q: query || undefined });

  const bundles = data?.data || [];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tous les lots</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Des packs de produits à prix réduits
            </p>
          </div>
        </div>

        <div className="mb-6 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un lot..."
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-brand-800" />
          </div>
        ) : bundles.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Aucun lot"
            description={query ? "Aucun lot ne correspond à votre recherche" : "Aucun lot disponible pour le moment"}
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {bundles.map((bundle) => (
              <BundleCard key={bundle.id} bundle={bundle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
