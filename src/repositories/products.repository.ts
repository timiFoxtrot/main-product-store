import { ForbiddenError } from "../common/errors/ForbiddenError";
import { NotFoundError } from "../common/errors/NotFoundError";
import Product, { IProduct } from "../models/products.model";
import { IUser } from "../models/users.model";
import { MulterFile } from "../types/multer";
import { uploadFromBuffer } from "../utils/cloudinary";
import { CategoryRepository } from "./categories.repository";
import cloudinary from "cloudinary";

export class ProductRepository {
  constructor(private categoryRepository: CategoryRepository) {}
  async create(product: IProduct, user: IUser) {
    const userId = user._id;
    const existingCategory = await this.categoryRepository.findById(
      product.category
    );
    if (!existingCategory) throw new NotFoundError("category not found");
    const newProduct = new Product({ ...product, owner: userId });
    return await newProduct.save();
  }

  async getAll({
    page,
    limit,
    search,
    category,
    minPrice,
    maxPrice,
  }: {
    page: number;
    limit: number;
    search: string;
    category: string;
    minPrice: number;
    maxPrice: number;
  }) {
    page = page || 1;
    limit = limit || 5;

    const filter: any = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search.toString(), $options: "i" } },
        { description: { $regex: search.toString(), $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skip = (page - 1) * limit;
    const products = await Product.find(filter)
      .populate({
        path: "owner",
        select: "name email",
      })
      .populate({
        path: "category",
        select: "name",
      })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
    const total = await Product.countDocuments();
    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: products,
    };
  }

  async getAllProductsByUser(user: IUser, page: number, limit: number) {
    page = page || 1;
    limit = limit || 5;
    const skip = (page - 1) * limit;

    const products = await Product.find({ owner: user._id })
      .populate({
        path: "owner",
        select: "name email",
      })
      .populate({
        path: "category",
        select: "name",
      })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
    const total = await Product.countDocuments({ owner: user._id });

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: products,
    };
  }

  async getProduct(id: string, user: IUser) {
    const product = await Product.findOne({ _id: id, owner: user._id }).lean();
    if (!product) throw { message: "Product not found", statusCode: 404 };
    return product;
  }

  async updateProduct(id: string, data: Partial<IProduct>, user: IUser) {
    const product = await Product.findOne({ _id: id, owner: user._id });
    if (!product) throw { message: "Product not found", statusCode: 404 };
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id, owner: user._id },
      data,
      {
        returnDocument: "after",
      }
    );
    return updatedProduct;
  }

  async deleteProduct(id: string, user: IUser) {
    const product = await Product.findOne({ _id: id, owner: user._id });
    if (!product) throw { message: "Product not found", statusCode: 404 };
    const deletedProduct = await Product.findOneAndDelete({
      _id: id,
      owner: user._id,
    });
    return deletedProduct;
  }

  async addImagesToProduct(
    files: MulterFile[],
    productId: string,
    userId: string
  ) {
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const uploadPromises = files.map((file) => uploadFromBuffer(file.buffer!));
    const uploadResults = await Promise.all(uploadPromises);
    const imageUrls = uploadResults.map((result) => result.secure_url);

    const product = await Product.findOne({ _id: productId, owner: userId });
    if (!product) {
      throw new NotFoundError("Product not found");
    }
    product.images.push(...imageUrls);
    await product.save();

    return imageUrls;
  }

  async addProductReview(
    reviewData: { rating: number; comment: string },
    productId: string,
    userObject: IUser
  ) {
    const { rating, comment } = reviewData;
    const product = await Product.findById(productId).lean();
    if (!product) {
      throw new NotFoundError("Product not found");
    }

    if (product.owner === userObject._id) {
      throw new ForbiddenError("You cannot review your own product");
    }

    const review = {
      user: userObject.name,
      rating,
      comment,
      createdAt: new Date(),
    };

    product.reviews.push(review);
    await product.save();

    return product;
  }
}
