import { Router } from "express";
// import multer from "multer";
import { createProductSchema, reviewProductSchema } from "../common/validation";
import { ProductController } from "../controllers/products.controller";
import { ProductService } from "../services/products.service";
import { ProductRepository } from "../repositories/products.repository";
import { authenticate } from "../common/middlewares/auth";
import { CategoryRepository } from "../repositories/categories.repository";
import { upload } from "../common/middlewares/multer";

export const productRouter = Router();

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

const categoryRepository = new CategoryRepository();
const productRepository = new ProductRepository(categoryRepository);
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

productRouter.post(
  "/",
  authenticate({ isAdmin: false }),
  createProductSchema,
  productController.createProduct
);

productRouter.get(
  "/all",
  authenticate({ isAdmin: true }),
  productController.getAll
);

productRouter.get(
  "/user-products",
  authenticate({ isAdmin: false }),
  productController.getAllProductsByUser
);

productRouter.get(
  "/:id",
  authenticate({ isAdmin: false }),
  productController.getProduct
);

productRouter.patch(
  "/:id",
  authenticate({ isAdmin: false }),
  productController.updateProduct
);

productRouter.delete(
  "/:id",
  authenticate({ isAdmin: false }),
  productController.deleteProduct
);

productRouter.patch(
  "/add-images/:productId",
  authenticate({ isAdmin: false }),
  upload.array("files", 5),
  productController.addImages
);

productRouter.patch(
  "/review/:id",
  authenticate({isAdmin: false}),
  reviewProductSchema,
  productController.addReview
);
