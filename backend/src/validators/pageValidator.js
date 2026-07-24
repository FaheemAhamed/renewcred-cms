import { z } from "zod";

const blockSchema = z.object({
  blockId: z.string().optional(),
  type: z.enum([
    "header",
    "paragraph",
    "list",
    "nested_list",
    "table",
    "equation",
    "markdown",
    "image",
    "documentation",
  ]),
  data: z.record(z.any()).or(z.any()),
  order: z.number().optional(),
});

const createPageSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  slug: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["draft", "published"]).optional(),
  blocks: z.array(blockSchema).optional(),
});

const updatePageSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["draft", "published"]).optional(),
  blocks: z.array(blockSchema).optional(),
});

export { createPageSchema, updatePageSchema };
