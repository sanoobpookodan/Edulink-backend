const updateStudent = async (req, res, next) => {
  try {
    const updatedStudent = await updateStudent(req.user.id, req.body, req.user);

    res.json({ success: true, student: updatedStudent });
  } catch (err) {
    next(err);
  }
};

export { updateStudent };
