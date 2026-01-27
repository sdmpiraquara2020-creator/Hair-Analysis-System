interface Signature {
  role: "TECHNICIAN" | "RESPONSIBLE";
  name: string;
  document: string;
  signedAt: string;
}

export default function ReportSignatures({
  signatures
}: {
  signatures: Signature[];
}) {
  return (
    <div style={{ marginTop: "32px" }}>
      {signatures.map(sig => (
        <div key={sig.role} style={{ marginBottom: "16px" }}>
          <strong>
            {sig.role === "TECHNICIAN"
              ? "Técnico Responsável"
              : "Responsável Técnico"}
          </strong>
          <div>{sig.name}</div>
          <div>Documento: {sig.document}</div>
          <div style={{ fontSize: 11, opacity: 0.6 }}>
            Assinado em {new Date(sig.signedAt).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
