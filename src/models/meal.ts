import mongoose, { type Document } from "mongoose";

interface DData {
  type: string;
  date: string;
  start: string;
  end: string;
  menu: string[];
}
type IData = Document<DData> & DData;

const dataSchema = new mongoose.Schema({
  type: { type: String, required: true },
  date: { type: String, required: true },
  start: { type: String, required: true },
  end: { type: String, required: true },
  menu: { type: [String], required: true },
});
export const dataDB = mongoose.model<IData>("data", dataSchema);

const findByDateAndType = async ({
  type,
  date,
}: {
  type: string;
  date: string;
}) => {
  return await dataDB.find({
    type,
    date,
  });
};
