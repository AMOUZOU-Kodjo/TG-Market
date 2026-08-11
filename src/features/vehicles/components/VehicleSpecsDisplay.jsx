import { Fuel, Gauge, Calendar, Settings, Car, FileCheck } from "lucide-react";
import Badge from "@/shared/ui/Badge";

export default function VehicleSpecsDisplay({ vehicle }) {
  const specs = [
    { icon: Car, label: "Marque", value: vehicle.brand },
    { icon: Car, label: "Modèle", value: vehicle.model },
    { icon: Calendar, label: "Année", value: vehicle.year },
    { icon: Gauge, label: "Kilométrage", value: `${vehicle.mileage.toLocaleString()} km` },
    { icon: Fuel, label: "Carburant", value: vehicle.fuel },
    { icon: Settings, label: "Transmission", value: vehicle.transmission },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Spécifications</h3>
      <div className="grid grid-cols-2 gap-3">
        {specs.map((spec, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-gray-700">
              <spec.icon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{spec.label}</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{spec.value}</p>
            </div>
          </div>
        ))}
      </div>

      {vehicle.documentsAvailable && vehicle.documentsAvailable.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Documents disponibles</h4>
          <div className="flex flex-wrap gap-2">
            {vehicle.documentsAvailable.map((doc, i) => (
              <Badge key={i} variant="secondary">
                <FileCheck className="mr-1 h-3 w-3" />
                {doc}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
