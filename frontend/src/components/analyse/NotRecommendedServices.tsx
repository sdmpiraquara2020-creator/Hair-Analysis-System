import { ServiceRecommendation } from "../../types/analysis";

interface Props {
  services: ServiceRecommendation[];
}

export function NotRecommendedServices({ services }: Props) {
  return (
    <section>
      <h2>Serviços Não Indicados</h2>
      {services.map((service, index) => (
        <div key={index}>
          <strong>{service.name}</strong>
          <p>{service.reason}</p>
        </div>
      ))}
    </section>
  );
}
