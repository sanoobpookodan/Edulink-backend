import prisma from "../config/prisma.js";
import ApiError from "../utils/ApiError.js";
import { buildQueryOptions } from "../utils/queryBuilder.js";
import toSlug from "../utils/toSlug.js";

export const getAllBlogCategoriesService = async (query = {}) => {
  const { skip, take, orderBy, meta, where } = buildQueryOptions({
    query,
    allowedSortFields: ["createdAt", "name"],
    defaultSortField: "createdAt",
  });

  delete where.isDeleted;

  const [categories, total] = await Promise.all([
    prisma.blogCategory.findMany({
      where,
      orderBy,
      skip,
      take,
    }),
    prisma.blogCategory.count({ where }),
  ]);

  return {
    data: categories,
    meta: {
      ...meta,
      total,
      totalPages: Math.ceil(total / meta.limit),
    },
  };
};

export const createBlogCategoryService = async (data) => {
  const slug = data.slug || toSlug(data.name);

  const existing = await prisma.blogCategory.findUnique({
    where: { slug },
  });

  if (existing) {
    throw new ApiError(400, "Blog category already exists");
  }

  return await prisma.blogCategory.create({
    data: {
      name: data.name,
      slug,
    },
  });
};

export const getBlogCategoryByIdService = async (id) => {
  const category = await prisma.blogCategory.findUnique({
    where: { id },
  });

  if (!category) {
    throw new ApiError(404, "Blog category not found");
  }

  return category;
};

export const updateBlogCategoryService = async (id, data) => {
  const category = await prisma.blogCategory.findUnique({
    where: { id },
  });

  if (!category) {
    throw new ApiError(404, "Blog category not found");
  }

  const nextSlug = data.slug || (data.name ? toSlug(data.name) : category.slug);

  if (nextSlug !== category.slug) {
    const existing = await prisma.blogCategory.findUnique({
      where: { slug: nextSlug },
    });

    if (existing) {
      throw new ApiError(400, "Blog category name already exists");
    }
  }

  return await prisma.blogCategory.update({
    where: { id },
    data: {
      name: data.name ?? category.name,
      slug: nextSlug,
    },
  });
};

export const deleteBlogCategoryByIdService = async (id) => {
  const category = await prisma.blogCategory.findUnique({
    where: { id },
  });

  if (!category) {
    throw new ApiError(404, "Blog category not found");
  }

  return await prisma.blogCategory.delete({
    where: { id },
  });
};
