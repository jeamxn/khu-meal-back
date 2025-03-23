import mongoose, { type Document, type ObjectId } from "mongoose";

interface DData {
  course: ObjectId;
  date: string;
  menu: string[];
}
type IData = Document<DData> & DData;

const dataSchema = new mongoose.Schema({
  course: {
    type: mongoose.Types.ObjectId,
    ref: "course",
  },
  date: String,
  menu: [String],
});
export const dataDB = mongoose.model<IData>("data", dataSchema);
