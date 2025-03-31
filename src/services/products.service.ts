import { IProduct } from "../models/products.model";
import { ProductRepository } from "../repositories/products.repository";
import { IUser } from "../models/users.model";

export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async create(product: IProduct, user: IUser): Promise<IProduct> {
    return this.productRepository.create(product, user);
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
    return this.productRepository.getAll({
      page,
      limit,
      search,
      category,
      minPrice,
      maxPrice,
    });
  }

  async getAllProductsByUser(user: IUser) {
    return this.productRepository.getAllProductsByUser(user);
  }

  async getProduct(id: string, user: IUser) {
    return this.productRepository.getProduct(id, user);
  }

  async updateProduct(id: string, data: Partial<IProduct>, user: IUser) {
    return this.productRepository.updateProduct(id, data, user);
  }

  async deleteProduct(id: string, user: IUser) {
    return this.productRepository.deleteProduct(id, user);
  }

  async addImagesToProduct(files: any[], productId: string, userId: string) {
    return this.productRepository.addImagesToProduct(files, productId, userId)
  }
}
