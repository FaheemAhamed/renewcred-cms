import mongoose from "mongoose";

const blockSchema = new mongoose.Schema(
  {
    blockId: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    type: {
      type: String,
      enum: [
        "header",
        "paragraph",
        "list",
        "nested_list",
        "table",
        "equation",
        "markdown",
        "image",
        "documentation",
      ],
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const pageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Page title is required"],
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: [true, "Page slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
    blocks: [blockSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

pageSchema.index({ status: 1 });

const Page = mongoose.model("Page", pageSchema);

export default Page;
