import prisma from "../config/prisma.js";
import ApiError from "../utils/ApiError.js";
import { deleteLocalFile } from "../utils/file.utils.js";
import { buildQueryOptions } from "../utils/queryBuilder.js";
import toSlug from "../utils/toSlug.js";

const buildBlogTagCreateData = (data) => {
  const tagsInput = data.blogTags || data.tags || [];
  const normalized = Array.isArray(tagsInput)
    ? tagsInput
    : tagsInput
        .toString()
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

  return normalized.map((tag) => {
    if (typeof tag === "string") {
      return { name: tag, slug: toSlug(tag) };
    }
    return {
      name: tag.name,
      slug: tag.slug || toSlug(tag.name),
    };
  });
};

export const getAllBlogsService = async (query) => {
  const { skip, take, orderBy, meta, where } = buildQueryOptions({
    query,
    allowedSortFields: ["createdAt", "title"],
    defaultSortField: "createdAt",
  });

  if (query.status) {
    where.status = query.status.toUpperCase();
  }

  const [blogs, total] = await Promise.all([
    prisma.blog.findMany({
      where,
      include: {
        category: true,
        blogTags: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy,
      skip,
      take,
    }),
    prisma.blog.count({ where }),
  ]);

  return {
    data: blogs,
    meta: {
      ...meta,
      total,
      totalPages: Math.ceil(total / meta.limit),
    },
  };
};

export const createBlogService = async (data, authorId, imagePath) => {
  const category = await prisma.blogCategory.findUnique({
    where: { id: data.categoryId },
  });

  if (!category) {
    throw new ApiError(404, "Blog category not found");
  }

  const blogTags = buildBlogTagCreateData(data);

  return await prisma.blog.create({
    data: {
      title: data.title,
      slug: data.slug || toSlug(data.title),
      description: data.description,
      content: data.content,
      image: imagePath,
      status: data.status ? data.status.toUpperCase() : undefined,
      categoryId: data.categoryId,
      createdById: authorId,
      updatedById: authorId,
      blogTags: {
        create: blogTags,
      },
    },
    include: {
      category: true,
      blogTags: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });
};

export const getBlogByIdService = async (id) => {
  const blog = await prisma.blog.findUnique({
    where: { id, isDeleted: false },
    include: {
      category: true,
      blogTags: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  return blog;
};

export const updateBlogService = async (id, data, currentUserId, imagePath) => {
  let oldImage = null;

  const blog = await prisma.blog.findUnique({
    where: { id, isDeleted: false },
  });

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  if (imagePath && blog.image) {
    oldImage = blog.image;
  }

  if (data.categoryId) {
    const category = await prisma.blogCategory.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new ApiError(404, "Blog category not found");
    }
  }

  const blogTags =
    data.blogTags !== undefined || data.tags !== undefined
      ? buildBlogTagCreateData(data)
      : null;

  const updatedBlog = await prisma.blog.update({
    where: { id },
    data: {
      title: data.title ?? blog.title,
      slug: data.slug ?? (data.title ? toSlug(data.title) : blog.slug),
      description: data.description ?? blog.description,
      content: data.content ?? blog.content,
      image: imagePath || blog.image,
      status: data.status ? data.status.toUpperCase() : blog.status,
      categoryId: data.categoryId ?? blog.categoryId,
      updatedById: currentUserId,
      ...(blogTags
        ? {
            blogTags: {
              deleteMany: {},
              create: blogTags,
            },
          }
        : {}),
    },
    include: {
      category: true,
      blogTags: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  if (oldImage) {
    await deleteLocalFile(oldImage);
  }

  return updatedBlog;
};

export const deleteBlogService = async (id, currentUserId) => {
  const blog = await prisma.blog.findUnique({
    where: { id, isDeleted: false },
  });

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  return await prisma.blog.update({
    where: { id },
    data: {
      isDeleted: true,
      updatedById: currentUserId,
    },
    include: {
      category: true,
      blogTags: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });
};
