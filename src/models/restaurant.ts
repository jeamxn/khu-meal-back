import mongoose, { type Document } from "mongoose";

interface DRestaurant {
  key: string;
  title: string;
  images: string[];
}
type IRestaurant = Document<DRestaurant> & DRestaurant;

const restaurantSchema = new mongoose.Schema({
  key: String,
  title: String,
  images: [String],
});
export const restaurantDB = mongoose.model<IRestaurant>("restaurant", restaurantSchema);
