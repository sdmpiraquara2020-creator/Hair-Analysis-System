import { QRCodeCanvas } from "qrcode.react";

interface ReportQRCodeProps {
  reportId: string;
}

export default function ReportQRCode({ reportId }: ReportQRCodeProps) {
  const url = `${window.location.origin}/verificar-relatorio/${reportId}`;

  return (
    <div style={{ textAlign: "center" }}>
      <QRCodeCanvas value={url} size={120} />
    </div>
  );
}
