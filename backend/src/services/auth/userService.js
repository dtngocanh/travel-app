export const getProfileInfo = (user) => {
  return {
    uid: user.uid,
    email: user.email,
    role: user.role || "customer",
  };
};

export const checkAdminAccess = (user) => {
  if (user.role !== "admin") {
    throw new Error("Bạn không có quyền truy cập (admin-only).");
  }
  return { message: "Xin chào admin, bạn có quyền truy cập!" };
};
