import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { ProductRepository } from "../src/repositories/products.repository";
import { CategoryRepository } from "../src/repositories/categories.repository";
import Product from "../src/models/products.model";
import User from "../src/models/users.model";

describe("ProductRepository", () => {
  let productRepository: ProductRepository;
  let categoryRepository: CategoryRepository;
  let mongoServer: MongoMemoryServer;
  let user: any;
  // let category: any;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    user = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: "TestPassword123",
    });
  });

  beforeEach(() => {
    categoryRepository = new CategoryRepository();
    productRepository = new ProductRepository(categoryRepository);
  });

  afterEach(async () => {
    await Product.deleteMany({});
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  test("should create a product", async () => {
    const user = { _id: new mongoose.Types.ObjectId() } as any;
    const category = {
      _id: new mongoose.Types.ObjectId(),
      name: "Test Category",
      description: "This is a test category",
    } as any;
    jest.spyOn(categoryRepository, "findById").mockResolvedValue(category);

    const productData = {
      name: "Test Product",
      description: "This is a test product",
      price: 100,
      category: category._id,
    } as any;

    const product = await productRepository.create(productData, user);

    expect(product).toHaveProperty("_id");
    expect(product.name).toBe("Test Product");
  });

  test("should fetch all products", async () => {
    // Mock user for the owner field
    const user = { _id: new mongoose.Types.ObjectId() };

    // Mock a valid category
    const category = {
      _id: new mongoose.Types.ObjectId(),
      name: "Test Category",
      description: "This is a test category",
    } as any;
    jest.spyOn(categoryRepository, "findById").mockResolvedValue(category);

    // Create valid products for testing
    await Product.create({
      name: "Product 1",
      description: "Description of Product 1",
      price: 10,
      category: category._id,
      owner: user._id,
      images: [],
      reviews: [],
    });

    await Product.create({
      name: "Product 2",
      description: "Description of Product 2",
      price: 20,
      category: category._id,
      owner: user._id,
      images: [],
      reviews: [],
    });

    const result = await productRepository.getAll({
      page: 1,
      limit: 10,
      search: "",
      category: "",
      minPrice: 0,
      maxPrice: 100,
    });

    expect(result.data.length).toBe(2);
  });

  test("should return empty array when no products exist", async () => {
    const result = await productRepository.getAll({
      page: 1,
      limit: 10,
      search: "",
      category: "",
      minPrice: 0,
      maxPrice: 100,
    });
    expect(result.data.length).toBe(0);
  });

  test("should fetch all products by a user", async () => {
    // Mock a valid category
    const category = {
      _id: new mongoose.Types.ObjectId(),
      name: "Test Category",
      description: "This is a test category",
    } as any;
    jest.spyOn(categoryRepository, "findById").mockResolvedValue(category);

    await Product.create({
      name: "Product 1",
      owner: user._id,
      category: category._id,
      description: "test decsription",
      price: 100,
    });
    await Product.create({
      name: "Product 2",
      owner: user._id,
      category: category._id,
      description: "test decsription",
      price: 200,
    });

    const result = await productRepository.getAllProductsByUser(user, 1, 10);
    expect(result.data.length).toBe(2);
  });

  test("should fetch a product by ID for a user", async () => {
    // Mock a valid category
    const category = {
      _id: new mongoose.Types.ObjectId(),
      name: "Test Category",
      description: "This is a test category",
    } as any;
    jest.spyOn(categoryRepository, "findById").mockResolvedValue(category);

    const product = await Product.create({
      name: "Test Product",
      owner: user._id,
      category: category._id,
      description: "test decsription",
      price: 100,
    });
    const result = await productRepository.getProduct(
      product._id as string,
      user
    );
    expect(result.name).toBe("Test Product");
  });

  test("should update a product", async () => {
    // Mock a valid category
    const category = {
      _id: new mongoose.Types.ObjectId(),
      name: "Test Category",
      description: "This is a test category",
    } as any;
    jest.spyOn(categoryRepository, "findById").mockResolvedValue(category);

    const product = await Product.create({
      name: "Old Name",
      owner: user._id,
      category: category._id,
      description: "old decsription",
      price: 100,
    });
    const updatedProduct = await productRepository.updateProduct(
      product._id as string,
      { name: "New Name" },
      user
    );
    expect(updatedProduct?.name).toBe("New Name");
  });

  test("should delete a product", async () => {
    // Mock a valid category
    const category = {
      _id: new mongoose.Types.ObjectId(),
      name: "Test Category",
      description: "This is a test category",
    } as any;
    jest.spyOn(categoryRepository, "findById").mockResolvedValue(category);

    const product = await Product.create({
      name: "To Be Deleted",
      owner: user._id,
      category: category._id,
      description: "test decsription",
      price: 100,
    });
    const deletedProduct = await productRepository.deleteProduct(
      product._id as string,
      user
    );
    expect(deletedProduct?.name).toBe("To Be Deleted");
  });

  test("should add a review successfully", async () => {
    // Mock a valid category
    const category = {
      _id: new mongoose.Types.ObjectId(),
      name: "Test Category",
      description: "This is a test category",
    } as any;
    jest.spyOn(categoryRepository, "findById").mockResolvedValue(category);

    const productOwner = await User.create({
      name: "Owner User",
      email: "owner@example.com",
      password: "password123",
    });

    const customer = (await User.create({
      name: "Customer User",
      email: "customer@example.com",
      password: "password123",
    })) as any;

    const product = await Product.create({
      name: "Test Product",
      owner: productOwner._id,
      category: category._id,
      price: 100,
      description: "test description",
      reviews: [],
    });

    const reviewData = {
      rating: 5,
      comment: "Great product!",
    };

    const updatedProduct = await productRepository.addProductReview(
      reviewData,
      product._id as string,
      customer
    );

    expect(updatedProduct.reviews.length).toBe(1);
    expect(updatedProduct.reviews[0].rating).toBe(5);
    expect(updatedProduct.reviews[0].comment).toBe("Great product!");
  });

  test("should throw an error if the product does not exist", async () => {
    const customer = await User.create({
      name: "Customer User",
      email: "customer@example.com",
      password: "password123",
    });

    const reviewData = {
      rating: 4,
      comment: "Nice product!",
    };

    await expect(
      productRepository.addProductReview(
        reviewData,
        new mongoose.Types.ObjectId().toString(),
        customer
      )
    ).rejects.toThrow("Product not found");
  });

  test("should throw an error if the user is the owner of the product", async () => {
    // Mock a valid category
    const category = {
      _id: new mongoose.Types.ObjectId(),
      name: "Test Category",
      description: "This is a test category",
    } as any;
    jest.spyOn(categoryRepository, "findById").mockResolvedValue(category);

    const owner = await User.create({
      name: "Owner User",
      email: "owner@example.com",
      password: "password123",
    });

    const product = await Product.create({
      name: "Test Product",
      owner: owner._id,
      category: category._id,
      price: 100,
      description: "test description",
      reviews: [],
    });

    const reviewData = {
      rating: 3,
      comment: "Decent product!",
    };

    await expect(
      productRepository.addProductReview(
        reviewData,
        product._id as string,
        owner
      )
    ).rejects.toThrow("You cannot review your own product");
  });
});
