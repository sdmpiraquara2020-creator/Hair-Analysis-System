import { ReactNode } from 'react';

interface SectionProps {
  title: string;
  children: ReactNode;
}

export function Section({ title, children }: SectionProps) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h3 style={{ marginBottom: 12 }}>{title}</h3>
      {children}
    </section>
  );
}
