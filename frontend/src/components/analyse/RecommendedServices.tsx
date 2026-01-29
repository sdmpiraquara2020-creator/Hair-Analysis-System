import { ServiceRecommendation } from "../../types/analysis";

interface Props {
  services: ServiceRecommendation[];
}

export function RecommendedServices({ services }: Props) {
  return (
    <section>
      <h2>Serviços Recomendados</h2>
      {services.map((service, index) => (
        <div key={index}>
          <h3>{service.name}</h3>
          <p>{service.reason}</p>
          <ul>
            {service.benefits.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
