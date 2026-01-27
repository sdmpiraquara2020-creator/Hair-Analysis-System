type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function ClientesBusca({ value, onChange }: Props) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Buscar por nome, telefone ou CPF"
      style={{
        width: "100%",
        padding: "12px 16px",
        borderRadius: 8,
        border: "1px solid #e5e7eb",
      }}
    />
  );
}
