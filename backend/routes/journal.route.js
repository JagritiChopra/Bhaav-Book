import express from "express";
import {
  createJournalEntry,
  getJournalEntries,
  getJournalEntryById,
  updateJournalEntry,
  deleteJournalEntry
} from "../controllers/journal.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { uploadJournalMedia } from "../middlewares/multer.js";

const router = express.Router();

// Get all journal entries
router.get("/", isAuthenticated, getJournalEntries);

// Get a single journal entry by ID
router.get("/:id", isAuthenticated, getJournalEntryById);

// Create a new journal entry
router.post("/", isAuthenticated, uploadJournalMedia, createJournalEntry);

// Update a journal entry by ID
router.put("/:id", isAuthenticated, uploadJournalMedia, updateJournalEntry);

// Delete a journal entry by ID
router.delete("/:id", isAuthenticated, deleteJournalEntry);

export default router;