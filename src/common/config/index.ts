import dotenv from 'dotenv';

dotenv.config();

export const config = {
    PORT: process.env.PORT || 3000,
    DEFAULT_PER_PAGE: 10,
    DEFAULT_PAGE_NO: 1,
    NODE_ENV: process.env.NODE_ENV || '',
    APP_NAME: process.env.APP_NAME || '',
    APP_URL: process.env.APP_URL || '',
    ENABLE_DOCUMENTATION: process.env.ENABLE_DOCUMENTATION || '',
    JWT_SECRET: process.env.JWT_SECRET as string,
    MONGODB_URL: process.env.MONGODB_URL || ''
};
