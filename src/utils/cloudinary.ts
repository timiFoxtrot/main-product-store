import cloudinary from "cloudinary";
import streamifier from "streamifier";

interface CloudinaryUploadResult {
  secure_url: string;
  // include any additional fields you need
}

export const uploadFromBuffer = (buffer: Buffer): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result as CloudinaryUploadResult);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};
