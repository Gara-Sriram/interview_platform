import { chatClient } from "../lib/stream.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getStreamToken = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString();
  const token = chatClient.createToken(userId);

  res.status(200).json({
    token,
    userId,
    userName: req.user.name,
    userImage: req.user.profileImage,
  });
});
