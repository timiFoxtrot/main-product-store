import { Schema, model, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface ICategory extends Document {
  name: string;
  description?: string;
}

const CategorySchema = new Schema<ICategory>(
  {
    _id: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

const Category = model<ICategory>("Category", CategorySchema);
export default Category;
