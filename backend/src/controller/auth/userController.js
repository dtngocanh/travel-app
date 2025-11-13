import * as userService from "../../services/auth/userService.js";

export const getProfile = async (req, res) => {
  try {
    const profile = userService.getProfileInfo(req.user);
    res.json(profile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const adminOnly = async (req, res) => {
  try {
    const result = userService.checkAdminAccess(req.user);
    res.json(result);
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};
