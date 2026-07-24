import { z } from "zod";

const bookSchema = z.object({

    title: z
        .string()
        .min(3, "Title must contain at least 3 characters.")
        .max(100, "Title cannot exceed 100 characters."),

    price: z
        .number()
        .positive("Price must be greater than 0.")

});

export default bookSchema;