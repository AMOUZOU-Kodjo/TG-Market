import { useQuery } from "@tanstack/react-query";
import { FolderTree, Package } from "lucide-react";
import api from "@/shared/services/api";

export default function AdminCategoriesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["adminCategories"],
    queryFn: () => api.get("/admin/categories").then((r) => r.data),
  });

  const categories = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Catégories</h1>
        <span className="text-sm text-gray-500">{categories.length} catégories</span>
      </div>

      <div className="rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <FolderTree className="w-12 h-12 mb-3 opacity-50" />
            <p>Aucune catégorie trouvée</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-3">Catégorie</th>
                  <th className="px-6 py-3">Slug</th>
                  <th className="px-6 py-3 text-center">Annonces</th>
                  <th className="px-6 py-3 hidden lg:table-cell">Ordre</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                          style={{ backgroundColor: `${cat.color}20` }}
                        >
                          <span style={{ color: cat.color }}>
                            {cat.icon === "Smartphone" ? "📱" : cat.icon === "Car" ? "🚗" : cat.icon === "Laptop" ? "💻" : "📦"}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-white">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-500">{cat.slug}</td>
                    <td className="px-6 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-gray-500" />
                        <span className="text-sm text-white">{cat.productCount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 hidden lg:table-cell text-sm text-gray-500">{cat.sortOrder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
