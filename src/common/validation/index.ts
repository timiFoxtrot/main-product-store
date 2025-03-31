import { celebrate, Joi, Segments } from "celebrate";

/**
 * USER VALIDATION
 */

// Create User: "name", "email", and "password" are required.
// "roles" is forbidden so that users cannot set their own roles.
export const createUserSchema = celebrate(
  {
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required().trim(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      roles: Joi.any().forbidden(),
    }),
  },
  {
    abortEarly: false,
  }
);

// Update User: Allow updating name, email, and password.
// The "roles" field is not allowed even for updates.
export const updateUserSchema = celebrate(
  {
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().required(),
    }),
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().optional().trim(),
      email: Joi.string().email().optional(),
      password: Joi.string().optional(),
      roles: Joi.any().forbidden(),
    }),
  },
  {
    abortEarly: false,
  }
);

/**
 * PRODUCT VALIDATION
 */

// Create Product: Requires name, description, price, category, and owner.
// Optionally accepts images as an array of valid URLs.
export const createProductSchema = celebrate(
  {
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required().trim(),
      description: Joi.string().required().trim(),
      price: Joi.number().required(),
      category: Joi.string().required().trim(),
      // owner: Joi.string().required().trim(),
      images: Joi.array().items(Joi.string().uri()).optional(),
    }),
  },
  {
    abortEarly: false,
  }
);

// Update Product: Allows updating any product field optionally.
export const updateProductSchema = celebrate(
  {
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().required(),
    }),
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().optional().trim(),
      description: Joi.string().optional().trim(),
      price: Joi.number().optional(),
      category: Joi.string().optional().trim(),
      owner: Joi.string().optional().trim(),
      images: Joi.array().items(Joi.string().uri()).optional(),
    }),
  },
  {
    abortEarly: false,
  }
);

export const reviewProductSchema = celebrate(
  {
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().required(),
    }),
    [Segments.BODY]: Joi.object().keys({
      rating: Joi.number().min(1).max(5).required(),
      comment: Joi.string().optional().trim(),
    }),
  },
  {
    abortEarly: false,
  }
);

/**
 * CATEGORY VALIDATION
 */

// Create Category: Requires name and optionally a description.
export const createCategorySchema = celebrate(
  {
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required().trim(),
      description: Joi.string().optional().trim(),
    }),
  },
  {
    abortEarly: false,
  }
);

// Update Category: Allows updating category name and description.
export const updateCategorySchema = celebrate(
  {
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().required(), // category id
    }),
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().optional().trim(),
      description: Joi.string().optional().trim(),
    }),
  },
  {
    abortEarly: false,
  }
);
