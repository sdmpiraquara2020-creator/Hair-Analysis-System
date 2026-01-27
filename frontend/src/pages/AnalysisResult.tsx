import AnalysisHeader from "../components/AnalysisHeader";
import TechnicalSummary from "../components/TechnicalSummary";
import TechnicalAlerts from "../components/TechnicalAlerts";

export default function AnalysisResult() {
  return (
    <div style={{ padding: 24 }}>
      <AnalysisHeader />
      <TechnicalSummary />
      <TechnicalAlerts />
    </div>
  );
}
