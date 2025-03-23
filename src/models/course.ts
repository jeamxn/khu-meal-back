import mongoose, { type Document, ObjectId } from "mongoose";

interface DCourse {
  key: string;
  restaurant: ObjectId;
  title: string;
  start: string;
  end: string;
}
type ICourse = Document<DCourse> & DCourse;

const courseSchema = new mongoose.Schema({
  key: String,
  restaurant: {
    type: mongoose.Types.ObjectId,
    ref: "restaurant",
  },
  title: String,
  start: String,
  end: String,
});
export const courseDB = mongoose.model<ICourse>("course", courseSchema);
