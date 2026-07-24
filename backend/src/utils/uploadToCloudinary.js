import cloudinary from "../config/cloudinary.js";
import { PassThrough } from "stream";

const uploadToCloudinary = (
    fileBuffer,
    folder,
    resourceType = "auto"
) => {

    return new Promise((resolve, reject) => {

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: resourceType,
            },
            (error, result) => {

                if (error) {
                    return reject(error);
                }

                resolve(result);

            }
        );

        const bufferStream = new PassThrough();

        bufferStream.end(fileBuffer);

        bufferStream.pipe(uploadStream);

    });

};

export default uploadToCloudinary;