// frontend/src/components/StatCard.tsx
import React from 'react';

type StatCardProps = {
  title: string;
  value: number | string;
};

export default function StatCard({ title, value }: StatCardProps) {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 8,
        padding: 20,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <span
        style={{
          fontSize: 13,
          color: '#666',
          fontWeight: 500,
        }}
      >
        {title}
      </span>

      <strong
        style={{
          fontSize: 26,
          color: '#111',
        }}
      >
        {value}
      </strong>
    </div>
  );
}
