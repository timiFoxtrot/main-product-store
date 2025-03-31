import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/categories.service';
import logger from '../utils/logger.utilities';

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await this.categoryService.createCategory(req.body);
      res.status(201).json({ data: category });
    } catch (error: any) {
      logger.error(`ERROR CREATING CATEGORY: ${error.message}`);
      res.status(400).json({
        status: "error",
        message: error.message || "Error creating category",
      });
    }
  };

  getCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const category = await this.categoryService.getCategory(id);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json({ data: category });
    } catch (error: any) {
      logger.error(`ERROR RETRIEVING CATEGORY: ${error.message}`);
      res.status(400).json({
        status: "error",
        message: error.message || "Error retrieving category",
      });
    }
  };

  getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await this.categoryService.getAllCategories();
      res.json({ data: categories });
    } catch (error: any) {
      logger.error(`ERROR RETRIEVING CATEGORIES: ${error.message}`);
      res.status(400).json({
        status: "error",
        message: error.message || "Error fetching category",
      });
    }
  };

  updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updatedCategory = await this.categoryService.updateCategory(id, req.body);
      if (!updatedCategory) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json({ data: updatedCategory });
    } catch (error: any) {
      logger.error(`ERROR UPDATING CATEGORY: ${error.message}`);
      res.status(400).json({
        status: "error",
        message: error.message || "Error updating category",
      });
    }
  };

  deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const deletedCategory = await this.categoryService.deleteCategory(id);
      if (!deletedCategory) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json({ data: deletedCategory });
    } catch (error: any) {
      logger.error(`ERROR DELETING CATEGORY: ${error.message}`);
      res.status(400).json({
        status: "error",
        message: error.message || "Error deleting category",
      });
    }
  };
}
