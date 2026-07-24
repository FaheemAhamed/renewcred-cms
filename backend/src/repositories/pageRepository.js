import Page from "../models/Page.js";

const createPage = async (pageData) => {
  return await Page.create(pageData);
};

const getPages = async (query, skip, limit, sort) => {
  return await Page.find(query).sort(sort).skip(skip).limit(limit);
};

const countPages = async (query) => {
  return await Page.countDocuments(query);
};

const getPageBySlug = async (slug) => {
  return await Page.findOne({ slug });
};

const getPageById = async (pageId) => {
  return await Page.findById(pageId);
};

const updatePage = async (pageId, updateData) => {
  return await Page.findByIdAndUpdate(pageId, updateData, {
    new: true,
    runValidators: true,
  });
};

const deletePage = async (pageId) => {
  return await Page.findByIdAndDelete(pageId);
};

export {
  createPage,
  getPages,
  countPages,
  getPageBySlug,
  getPageById,
  updatePage,
  deletePage,
};
