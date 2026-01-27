import { AnalysisHistoryProvider } from "./context/AnalysisHistoryContext";
import Routes from "./routes"; // ajuste se o nome for outro

export default function App() {
  return (
    <AnalysisHistoryProvider>
      <Routes />
    </AnalysisHistoryProvider>
  );
}
