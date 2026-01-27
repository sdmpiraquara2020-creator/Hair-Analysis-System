import { ScheduleStep } from "../../types/analysis";

interface Props {
  steps: ScheduleStep[];
}

export function CapillarySchedule({ steps }: Props) {
  return (
    <section>
      <h2>Cronograma Capilar Sugerido</h2>
      <ul>
        {steps.map((step, index) => (
          <li key={index}>
            <strong>{step.week}</strong> — {step.treatment} ({step.objective})
          </li>
        ))}
      </ul>
    </section>
  );
}
