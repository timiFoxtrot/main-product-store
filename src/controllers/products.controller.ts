import { ProductService } from "../services/products.service";
import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger.utilities";

export class ProductController {
  constructor(private productService: ProductService) {}

  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.productService.create(req.body, req.user);
      return res.status(201).json({
        status: "success",
        message: "Product added successfully",
        data: result,
      });
    } catch (error) {
      logger.error(`ERROR CREATING PRODUCT:: ${error.message}`);
      res.status(error.statusCode || 500).json({
        status: "error",
        message: error.message,
      });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const { page, limit, search, category, minPrice, maxPrice } =
        req.query as unknown as {
          page: string;
          limit: string;
          search: string;
          category: string;
          minPrice: string;
          maxPrice: string;
        };
      const result = await this.productService.getAll({
        page: Number(page),
        limit: Number(limit),
        search,
        category,
        minPrice: Number(minPrice),
        maxPrice: Number(maxPrice),
      });
      return res.status(200).json({
        status: "success",
        message: "Products fetched successfully",
        data: result,
      });
    } catch (error) {
      logger.error(`ERROR FETCHING PRODUCT:: ${error.message}`);
      res.status(error.statusCode || 500).json({
        status: "error",
        message: error.message,
      });
    }
  };

  getAllProductsByUser = async (req: Request, res: Response) => {
    try {
      const { page, limit } = req.query as unknown as {
        page: string;
        limit: string;
      };
      const result = await this.productService.getAllProductsByUser(
        req.user,
        Number(page),
        Number(limit)
      );
      return res.status(200).json({
        status: "success",
        message: "Products fetched successfully",
        data: result,
      });
    } catch (error) {
      logger.error(`ERROR FETCHING PRODUCTS:: ${error.message}`);
      res.status(error.statusCode || 500).json({
        status: "error",
        message: error.message,
      });
    }
  };

  getProduct = async (req: Request, res: Response) => {
    try {
      const result = await this.productService.getProduct(
        req.params.id,
        req.user
      );
      return res.status(200).json({
        status: "success",
        message: "Product fetched successfully",
        data: result,
      });
    } catch (error) {
      logger.error(`ERROR FETCHING PRODUCT:: ${error.message}`);
      res.status(error.statusCode || 500).json({
        status: "error",
        message: error.message,
      });
    }
  };

  updateProduct = async (req: Request, res: Response) => {
    try {
      const result = await this.productService.updateProduct(
        req.params.id,
        req.body,
        req.user
      );
      return res.status(200).json({
        status: "success",
        message: "Product updated successfully",
        data: result,
      });
    } catch (error) {
      logger.error(`ERROR UPDATING PRODUCTS:: ${error.message}`);
      res.status(error.statusCode || 500).json({
        status: "error",
        message: error.message,
      });
    }
  };

  deleteProduct = async (req: Request, res: Response) => {
    try {
      const result = await this.productService.deleteProduct(
        req.params.id,
        req.user
      );
      return res.status(200).json({
        status: "success",
        message: "Producted deleted successfully",
        data: result,
      });
    } catch (error) {
      logger.error(`ERROR DELETING PRODUCTS:: ${error.message}`);
      res.status(error.statusCode || 500).json({
        status: "error",
        message: error.message,
      });
    }
  };

  addImages = async (req: Request, res: Response) => {
    try {
      const user = req.user;
      const productId = req.params.id;
      const files = req.files as any[];

      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No image files provided" });
      }
      const result = await this.productService.addImagesToProduct(
        files,
        productId,
        user._id
      );
      return res.status(200).json({
        status: "success",
        message: "Image(s) added successfully",
        data: result,
      });
    } catch (error) {
      logger.error(`ERROR UPLOADING IMAGES:: ${error.message}`);
      res.status(error.statusCode || 500).json({
        status: "error",
        message: error.message,
      });
    }
  };

  addReview = async (req: Request, res: Response) => {
    try {
      const user = req.user;
      const productId = req.params.id;
      const { rating, comment } = req.body;

      const result = await this.productService.addProductReview(
        { rating, comment },
        productId,
        user
      );
      return res
        .status(200)
        .json({ status: "success", message: "Review submitted", data: result });
    } catch (error) {
      logger.error(`ERROR ADDING PRODUCT REVIEW:: ${error.message}`);
      res.status(error.statusCode || 500).json({
        status: "error",
        message: error.message,
      });
    }
  };
}
