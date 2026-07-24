import {
  createPage,
  getPages,
  countPages,
  getPageBySlug,
  getPageById,
  updatePage,
  deletePage,
} from "../repositories/pageRepository.js";
import ApiError from "../utils/ApiError.js";

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const createPageService = async (pageData, adminId) => {
  let slug = pageData.slug ? slugify(pageData.slug) : slugify(pageData.title);

  const existing = await getPageBySlug(slug);
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  // Ensure block order
  const blocks = (pageData.blocks || []).map((block, idx) => ({
    ...block,
    order: typeof block.order === "number" ? block.order : idx,
  }));

  const newPage = await createPage({
    ...pageData,
    slug,
    blocks,
    createdBy: adminId || null,
  });

  return newPage;
};

const getPagesService = async ({
  page = 1,
  limit = 10,
  search = "",
  status = "",
  sort = "-createdAt",
}) => {
  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { slug: { $regex: search, $options: "i" } },
    ];
  }

  if (status) {
    query.status = status;
  }

  const skip = (page - 1) * limit;

  const pages = await getPages(query, skip, limit, sort);
  const total = await countPages(query);
  const totalPages = Math.ceil(total / limit);

  return {
    pages,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

const getPageBySlugService = async (slug, isPublic = true) => {
  const page = await getPageBySlug(slug.toLowerCase());

  if (!page) {
    throw new ApiError(404, `Page with slug '${slug}' not found`);
  }

  if (isPublic && page.status !== "published") {
    throw new ApiError(404, `Page with slug '${slug}' is not published`);
  }

  return page;
};

const getPageByIdService = async (pageId) => {
  const page = await getPageById(pageId);

  if (!page) {
    throw new ApiError(404, "Page not found");
  }

  return page;
};

const updatePageService = async (pageId, updateData) => {
  if (updateData.title && !updateData.slug) {
    // If updating title without specific slug, optional update or keep existing
  } else if (updateData.slug) {
    updateData.slug = slugify(updateData.slug);
    const existing = await getPageBySlug(updateData.slug);
    if (existing && existing._id.toString() !== pageId) {
      throw new ApiError(400, "A page with this slug already exists");
    }
  }

  if (updateData.blocks && Array.isArray(updateData.blocks)) {
    updateData.blocks = updateData.blocks.map((block, idx) => ({
      ...block,
      order: typeof block.order === "number" ? block.order : idx,
    }));
  }

  const updatedPage = await updatePage(pageId, updateData);

  if (!updatedPage) {
    throw new ApiError(404, "Page not found");
  }

  return updatedPage;
};

const deletePageService = async (pageId) => {
  const deletedPage = await deletePage(pageId);

  if (!deletedPage) {
    throw new ApiError(404, "Page not found");
  }

  return deletedPage;
};

export {
  createPageService,
  getPagesService,
  getPageBySlugService,
  getPageByIdService,
  updatePageService,
  deletePageService,
};
