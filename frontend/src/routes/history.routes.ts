import { Router } from "express";
import { PdfHistoryController } from "@/modules/analysis/history/controllers/PdfHistoryController";

const historyRoutes = Router();

const pdfHistoryController = new PdfHistoryController();

/**
 * Histórico de PDFs clínicos
 */
historyRoutes.get(
  "/",
  (req, res) => pdfHistoryController.handle(req, res)
);

export default historyRoutes;
