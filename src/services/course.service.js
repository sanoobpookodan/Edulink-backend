import prisma from "../config/prisma.js";

const createCourse = async (data, instructorId) => {
  return prisma.course.create({
    data: {
      title: data.title,
      description: data.description,
      price: data.price,
      instructorId,
    },
  });
};

const getAllCourses = async () => {
  return prisma.course.findMany({
    include: { instructor: true },
  });
};

export default { createCourse, getAllCourses };
