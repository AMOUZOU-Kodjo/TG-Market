import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vehiclesApi } from "../services/vehicles.api";

export function useVehicles(params) {
  return useQuery({
    queryKey: ["vehicles", params],
    queryFn: () => vehiclesApi.list(params),
  });
}

export function useVehicle(id) {
  return useQuery({
    queryKey: ["vehicle", id],
    queryFn: () => vehiclesApi.getById(id),
    enabled: !!id,
  });
}

export function useVehicleBrands() {
  return useQuery({
    queryKey: ["vehicleBrands"],
    queryFn: vehiclesApi.getBrands,
    staleTime: 30 * 60 * 1000,
  });
}

export function useVehicleModels(brand) {
  return useQuery({
    queryKey: ["vehicleModels", brand],
    queryFn: () => vehiclesApi.getModels(brand),
    enabled: !!brand,
  });
}
