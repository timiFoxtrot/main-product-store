import { ConflictError } from "../common/errors/ConflictError";
import Category, { ICategory } from "../models/categories.models";

export class CategoryRepository {
  async create(categoryData: Partial<ICategory>): Promise<ICategory> {
    const existingCategory = await Category.findOne({name: categoryData.name})
    if(existingCategory) throw new ConflictError("Category already exists")
    const category = new Category(categoryData);
    return await category.save();
  }

  async findById(id: string): Promise<ICategory | null> {
    return await Category.findById(id);
  }

  async findAll(): Promise<ICategory[]> {
    return await Category.find();
  }

  async update(id: string, updateData: Partial<ICategory>): Promise<ICategory | null> {
    return await Category.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id: string): Promise<ICategory | null> {
    return await Category.findByIdAndDelete(id);
  }
}
