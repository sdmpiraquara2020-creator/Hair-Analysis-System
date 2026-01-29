import { AlertItem } from "../../types/analysis";

interface Props {
  alerts: AlertItem[];
}

export function TechnicalAlerts({ alerts }: Props) {
  if (!alerts.length) return null;

  return (
    <section>
      <h2>Alertas Técnicos</h2>
      <ul>
        {alerts.map((alert, index) => (
          <li key={index}>{alert.message}</li>
        ))}
      </ul>
    </section>
  );
}
