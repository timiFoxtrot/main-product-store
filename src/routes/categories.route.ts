import { Router } from "express";
import { createCategorySchema } from "../common/validation";
import { authenticate } from "../common/middlewares/auth";
import { CategoryRepository } from "../repositories/categories.repository";
import { CategoryService } from "../services/categories.service";
import { CategoryController } from "../controllers/categories.controller";

export const categoryRouter = Router();

const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

categoryRouter.post(
  "/",
  authenticate({ isAdmin: true }),
  createCategorySchema,
  categoryController.createCategory
);
categoryRouter.get(
  "/",
  authenticate({ isAdmin: false }),
  categoryController.getCategories
);
categoryRouter.get(
  "/:id",
  authenticate({ isAdmin: true }),
  categoryController.getCategory
);
categoryRouter.patch(
  "/:id",
  authenticate({ isAdmin: true }),
  categoryController.updateCategory
);
categoryRouter.delete(
  "/:id",
  authenticate({ isAdmin: true }),
  categoryController.deleteCategory
);
