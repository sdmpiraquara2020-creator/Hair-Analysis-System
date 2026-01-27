interface Props {
  title: string;
  subtitle?: string;
}

const PageHeader: React.FC<Props> = ({ title, subtitle }) => {
  return (
    <section style={{ marginBottom: 36 }}>
      <h1
        style={{
          fontSize: 30,
          fontWeight: 600,
          color: "#111827",
          marginBottom: 6,
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </h1>

      {subtitle && (
        <p
          style={{
            color: "#6b7280",
            fontSize: 14,
            maxWidth: 520,
          }}
        >
          {subtitle}
        </p>
      )}
    </section>
  );
};

export default PageHeader;
