import { ICategory } from '../models/categories.models';
import { CategoryRepository } from '../repositories/categories.repository';

export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async createCategory(categoryData: ICategory): Promise<ICategory> {
    return await this.categoryRepository.create(categoryData);
  }

  async getCategory(id: string): Promise<ICategory | null> {
    return await this.categoryRepository.findById(id);
  }

  async getAllCategories(): Promise<ICategory[]> {
    return await this.categoryRepository.findAll();
  }

  async updateCategory(id: string, updateData: Partial<ICategory>): Promise<ICategory | null> {
    return await this.categoryRepository.update(id, updateData);
  }

  async deleteCategory(id: string): Promise<ICategory | null> {
    return await this.categoryRepository.delete(id);
  }
}
