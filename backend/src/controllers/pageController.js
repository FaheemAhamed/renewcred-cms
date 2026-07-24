import {
  createPageService,
  getPagesService,
  getPageBySlugService,
  getPageByIdService,
  updatePageService,
  deletePageService,
} from "../services/pageService.js";
import asyncHandler from "../utils/asyncHandler.js";

const createPageController = asyncHandler(async (req, res) => {
  const page = await createPageService(req.body, req.admin?.adminId);

  return res.status(201).json({
    success: true,
    message: "Page created successfully",
    data: page,
  });
});

const getPagesController = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search || "";
  const status = req.query.status || "";
  const sort = req.query.sort || "-createdAt";

  const result = await getPagesService({
    page,
    limit,
    search,
    status,
    sort,
  });

  return res.status(200).json({
    success: true,
    data: result.pages,
    pagination: result.pagination,
  });
});

const getPageBySlugController = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  // If user is authenticated admin, allow fetching unpublished/draft page
  const isPublic = !req.admin;

  const page = await getPageBySlugService(slug, isPublic);

  return res.status(200).json({
    success: true,
    data: page,
  });
});

const getPageByIdController = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const page = await getPageByIdService(id);

  return res.status(200).json({
    success: true,
    data: page,
  });
});

const updatePageController = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const updatedPage = await updatePageService(id, req.body);

  return res.status(200).json({
    success: true,
    message: "Page updated successfully",
    data: updatedPage,
  });
});

const deletePageController = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await deletePageService(id);

  return res.status(200).json({
    success: true,
    message: "Page deleted successfully",
  });
});

export {
  createPageController,
  getPagesController,
  getPageBySlugController,
  getPageByIdController,
  updatePageController,
  deletePageController,
};
