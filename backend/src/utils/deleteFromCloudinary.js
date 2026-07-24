import cloudinary from "../config/cloudinary.js";

const deleteFromCloudinary = async (
    publicId,
    resourceType = "image"
) => {

    return await cloudinary.uploader.destroy(
        publicId,
        {
            resource_type: resourceType,
        }
    );

};

export default deleteFromCloudinary;