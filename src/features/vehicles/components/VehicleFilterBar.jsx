import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import Select from "@/shared/ui/Select";
import Button from "@/shared/ui/Button";

export default function VehicleFilterBar({ filters, onFilterChange, vehicleType = "car" }) {
  const [showFilters, setShowFilters] = useState(false);

  const carBrands = ["Toyota", "Honda", "Mercedes-Benz", "BMW", "Audi", "Volkswagen", "Ford", "Peugeot", "Renault", "Hyundai", "Kia", "Nissan", "Mazda", "Suzuki", "Mitsubishi"];
  const motoBrands = ["Honda", "Yamaha", "Suzuki", "Kawasaki", "BMW", "Ducati", "Harley-Davidson", "KTM", "Aprilia", "Triumph"];
  const fuels = ["Essence", "Diesel", "Hybride", "Électrique", "GPL"];
  const transmissions = ["Manuelle", "Automatique"];

  const brands = vehicleType === "moto" ? motoBrands : carBrands;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={filters.search || ""}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            placeholder={`Rechercher ${vehicleType === "moto" ? "une moto" : "une voiture"}...`}
            className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 focus:border-red-800 focus:outline-none focus:ring-2 focus:ring-red-800/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filtres
        </Button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-2 gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800 sm:grid-cols-4">
          <Select
            label="Marque"
            value={filters.brand || ""}
            onChange={(e) => onFilterChange({ ...filters, brand: e.target.value })}
          >
            <option value="">Toutes</option>
            {brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </Select>

          <Select
            label="Année min"
            value={filters.minYear || ""}
            onChange={(e) => onFilterChange({ ...filters, minYear: e.target.value })}
          >
            <option value="">Toutes</option>
            {Array.from({ length: 20 }, (_, i) => 2025 - i).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </Select>

          <Select
            label="Carburant"
            value={filters.fuel || ""}
            onChange={(e) => onFilterChange({ ...filters, fuel: e.target.value })}
          >
            <option value="">Tous</option>
            {fuels.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </Select>

          <Select
            label="Transmission"
            value={filters.transmission || ""}
            onChange={(e) => onFilterChange({ ...filters, transmission: e.target.value })}
          >
            <option value="">Toutes</option>
            {transmissions.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Prix max</label>
            <input
              type="number"
              value={filters.maxPrice || ""}
              onChange={(e) => onFilterChange({ ...filters, maxPrice: e.target.value })}
              placeholder="FCFA"
              className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-red-800 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      )}
    </div>
  );
}
