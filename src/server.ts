import dotenv from "dotenv";
import mongoose from "mongoose";
import { app } from "./app";

dotenv.config();

const PORT = process.env.PORT 
const MONGO_URI = process.env.MONGO_URI!;

mongoose.connect(MONGO_URI).then(() => {
  console.log("MongoDB connected");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error("Failed to connect to MongoDB", err);
});
