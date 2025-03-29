import { Schema, Document, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  category: String;
  owner: string;
  images: string[];
  reviews: IReview[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IReview {
  user: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    user: { type: String, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ProductSchema: Schema = new Schema<IProduct>(
  {
    _id: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, ref: "Category", required: true },
    images: [String],
    reviews: [ReviewSchema],
    owner: { type: String, ref: "User", required: true },
  },
  {
    id: false,
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
  }
);

const Product = model<IProduct>("Product", ProductSchema);
export default Product;
