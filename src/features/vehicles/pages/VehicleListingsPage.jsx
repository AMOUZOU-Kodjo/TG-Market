import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Car, SlidersHorizontal, X } from "lucide-react";
import VehicleCard from "@/features/vehicles/components/VehicleCard";
import VehicleFilterBar from "@/features/vehicles/components/VehicleFilterBar";
import Breadcrumb from "@/shared/ui/Breadcrumb";
import EmptyState from "@/shared/ui/EmptyState";
import { useVehicles } from "@/features/vehicles/hooks/useVehicles";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } },
};

export default function VehicleListingsPage() {
  const [vehicleType, setVehicleType] = useState("all");
  const [filters, setFilters] = useState({});

  const { data: vehiclesData, isLoading } = useVehicles(filters);
  const allVehicles = vehiclesData?.data || vehiclesData || [];

  const filtered = useMemo(() => {
    let list = allVehicles;
    if (vehicleType !== "all") list = list.filter((v) => v.type === vehicleType);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((v) => v.title.toLowerCase().includes(q) || v.brand.toLowerCase().includes(q));
    }
    if (filters.brand) list = list.filter((v) => v.brand === filters.brand);
    if (filters.fuel) list = list.filter((v) => v.fuel === filters.fuel);
    if (filters.transmission) list = list.filter((v) => v.transmission === filters.transmission);
    if (filters.minYear) list = list.filter((v) => v.year >= Number(filters.minYear));
    if (filters.maxPrice) list = list.filter((v) => v.price <= Number(filters.maxPrice));
    return list;
  }, [vehicleType, filters, allVehicles]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: "Accueil", to: "/" },
          { label: "Véhicules" },
        ]}
      />

      <div className="mb-6 mt-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Véhicules d'occasion
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {filtered.length} véhicule{filtered.length !== 1 ? "s" : ""} disponible{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Type Tabs */}
      <div className="mb-4 flex gap-2">
        {[
          { id: "all", label: "Tous", count: allVehicles.length },
          { id: "car", label: "Voitures", count: allVehicles.filter(v => v.type === "car").length },
          { id: "moto", label: "Motos", count: allVehicles.filter(v => v.type === "moto").length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setVehicleType(tab.id)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              vehicleType === tab.id
                ? "bg-brand-800 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      <VehicleFilterBar
        filters={filters}
        onFilterChange={setFilters}
        vehicleType={vehicleType === "all" ? "car" : vehicleType}
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={Car}
          title="Aucun véhicule trouvé"
          description="Essayez de modifier vos filtres pour trouver ce que vous cherchez."
          action={{ label: "Réinitialiser les filtres", onClick: () => setFilters({}) }}
        />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((vehicle, i) => (
            <motion.div key={vehicle.id} variants={itemVariants}>
              <VehicleCard vehicle={vehicle} index={i} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
