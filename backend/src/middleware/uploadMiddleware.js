import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {

    if (file.fieldname === "coverImage") {

        const allowedImageTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedImageTypes.includes(file.mimetype)) {

            return cb(
                new Error(
                    "Cover image must be JPG, PNG or WEBP."
                ),
                false
            );

        }

    }

    if (file.fieldname === "pdfFile") {

        if (file.mimetype !== "application/pdf") {

            return cb(
                new Error(
                    "Only PDF files are allowed."
                ),
                false
            );

        }

    }

    cb(null, true);

};

const upload = multer({

    storage,

    limits: {

        fileSize: 20 * 1024 * 1024,

    },

    fileFilter,

});

export default upload;