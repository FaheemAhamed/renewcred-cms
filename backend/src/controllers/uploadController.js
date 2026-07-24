import asyncHandler from "../utils/asyncHandler.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import ApiError from "../utils/ApiError.js";

const uploadMediaController = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No file uploaded");
  }

  const folder = req.body.folder || "cms/media";
  const resourceType = req.file.mimetype.startsWith("image/")
    ? "image"
    : "raw";

  const result = await uploadToCloudinary(
    req.file.buffer,
    folder,
    resourceType
  );

  return res.status(200).json({
    success: true,
    message: "File uploaded successfully",
    data: {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      bytes: result.bytes,
    },
  });
});

export { uploadMediaController };
