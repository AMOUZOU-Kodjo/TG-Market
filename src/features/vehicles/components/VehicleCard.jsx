import { Link } from "react-router";
import { motion } from "framer-motion";
import { Fuel, Gauge, Calendar, MapPin, Heart, Share2 } from "lucide-react";
import { formatCFA } from "@/shared/utils/format";
import Badge from "@/shared/ui/Badge";

export default function VehicleCard({ vehicle, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-lg dark:border-gray-800 dark:bg-gray-800"
    >
      <Link to={`/annonce/${vehicle.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={vehicle.images?.[0] || vehicle.image}
            alt={vehicle.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-lg font-bold text-white">{formatCFA(vehicle.price)}</p>
          </div>
          <div className="absolute right-3 top-3 flex gap-2">
            <Badge variant="dark" size="sm">
              {vehicle.type === "car" ? "Voiture" : "Moto"}
            </Badge>
          </div>
        </div>

        <div className="p-4">
          <h3 className="line-clamp-1 font-semibold text-gray-900 dark:text-white">{vehicle.title}</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{vehicle.brand} {vehicle.model} • {vehicle.year}</p>
          
          <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1"><Gauge className="h-3.5 w-3.5" />{vehicle.mileage?.toLocaleString()} km</span>
            <span className="flex items-center gap-1"><Fuel className="h-3.5 w-3.5" />{vehicle.fuel}</span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <MapPin className="h-3.5 w-3.5" />{vehicle.location}
            </span>
            <span className="text-xs text-gray-400">{vehicle.seller?.name}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
