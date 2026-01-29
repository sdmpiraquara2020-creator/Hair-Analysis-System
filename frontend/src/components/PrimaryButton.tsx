import { ButtonHTMLAttributes } from 'react';

export function PrimaryButton(
  props: ButtonHTMLAttributes<HTMLButtonElement>
) {
  return (
    <button
      {...props}
      style={{
        padding: '8px 16px',
        fontWeight: 600,
        cursor: 'pointer',
      }}
    />
  );
}
