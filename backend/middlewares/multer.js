import multer from "multer";

const storage = multer.memoryStorage();
export const singleUpload = multer({storage}).single("avatar");

export const uploadJournalMedia = multer({ storage }).fields([
  { name: "photo", maxCount: 1 },
  { name: "audioRecording", maxCount: 1 },
]);