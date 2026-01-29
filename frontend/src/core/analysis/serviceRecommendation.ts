import { SalonService } from "../services/salonServices";

export function recommendServices(
  nivel: "VERDE" | "AMARELO" | "VERMELHO",
  services: SalonService[]
): SalonService[] {
  return services.filter((service) => {
    if (nivel === "VERDE") return true;
    if (nivel === "AMARELO")
      return service.nivelPermitido !== "VERDE";
    return service.nivelPermitido === "VERMELHO";
  });
}
