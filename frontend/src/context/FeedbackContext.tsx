import { createContext, useContext, useState } from "react";
import Feedback from "../components/Feedback";

type FeedbackType = "success" | "error";

interface FeedbackItem {
  id: string;
  message: string;
  type: FeedbackType;
}

interface FeedbackContextData {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

const FeedbackContext = createContext<FeedbackContextData | undefined>(
  undefined
);

export function FeedbackProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);

  function addFeedback(message: string, type: FeedbackType) {
    const id = crypto.randomUUID();
    setFeedbacks((prev) => [...prev, { id, message, type }]);
  }

  function removeFeedback(id: string) {
    setFeedbacks((prev) => prev.filter((f) => f.id !== id));
  }

  function showSuccess(message: string) {
    addFeedback(message, "success");
  }

  function showError(message: string) {
    addFeedback(message, "error");
  }

  return (
    <FeedbackContext.Provider value={{ showSuccess, showError }}>
      {children}

      {/* STACK DE TOASTS */}
      <div
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 9999,
        }}
      >
        {feedbacks.map((feedback) => (
          <Feedback
            key={feedback.id}
            message={feedback.message}
            type={feedback.type}
            onClose={() => removeFeedback(feedback.id)}
          />
        ))}
      </div>
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error(
      "useFeedback deve ser usado dentro de FeedbackProvider"
    );
  }
  return context;
}
