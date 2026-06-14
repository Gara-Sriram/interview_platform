import { randomBytes, randomUUID } from "crypto";
import { chatClient, streamClient } from "../lib/stream.js";
import Session from "../models/Session.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cleanString, isAllowedDifficulty } from "../utils/validation.js";

export const createSession = asyncHandler(async (req, res) => {
  const problem = cleanString(req.body?.problem, 150);
  const difficulty = cleanString(req.body?.difficulty, 20).toLowerCase();
  const userId = req.user._id;
  const streamUserId = userId.toString();

  if (!problem || !difficulty) {
    throw new ApiError(400, "Problem and difficulty are required");
  }

  if (!isAllowedDifficulty(difficulty)) {
    throw new ApiError(400, "Difficulty must be easy, medium, or hard");
  }

  const activeHostedSession = await Session.findOne({ host: userId, status: "active" });
  if (activeHostedSession) {
    throw new ApiError(409, "End your active hosted session before creating another one");
  }

  const callId = `session_${randomUUID()}`;
  // Generate a secure random invite token — only the host will share this
  const inviteToken = randomBytes(20).toString("hex");

  const session = await Session.create({ problem, difficulty, host: userId, callId, inviteToken });

  try {
    // create stream video call
    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: streamUserId,
        custom: { problem, difficulty, sessionId: session._id.toString() },
      },
    });

    // chat messaging
    const channel = chatClient.channel("messaging", callId, {
      name: `${problem} Session`,
      created_by_id: streamUserId,
      members: [streamUserId],
    });

    await channel.create();

    // Return inviteToken so the host can build the shareable link
    res.status(201).json({ session, inviteToken });
  } catch (error) {
    await Session.deleteOne({ _id: session._id });
    throw error;
  }
});

// Only return sessions where the current user is host or participant
// Sessions are private — not a public feed anymore
export const getActiveSessions = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const sessions = await Session.find({
    status: "active",
    $or: [{ host: userId }, { participant: userId }],
  })
    .populate("host", "name profileImage email")
    .populate("participant", "name profileImage email")
    .sort({ createdAt: -1 })
    .limit(20);

  res.status(200).json({ sessions });
});

export const getMyRecentSessions = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const sessions = await Session.find({
    status: "completed",
    $or: [{ host: userId }, { participant: userId }],
  })
    .populate("host", "name profileImage email")
    .populate("participant", "name profileImage email")
    .sort({ updatedAt: -1 })
    .limit(20);

  res.status(200).json({ sessions });
});

export const getSessionById = asyncHandler(async (req, res) => {
  const session = await Session.findById(req.params.id)
    .populate("host", "name email profileImage")
    .populate("participant", "name email profileImage");

  if (!session) throw new ApiError(404, "Session not found");

  const userId = req.user._id.toString();
  const isHost = session.host?._id?.toString() === userId;
  const isParticipant = session.participant?._id?.toString() === userId;

  // Token from query param lets a new invitee see session info before joining
  const inviteToken = req.query.token;
  const hasValidToken = inviteToken && inviteToken === session.inviteToken;

  if (!isHost && !isParticipant && !hasValidToken) {
    throw new ApiError(403, "You do not have access to this session");
  }

  // Return inviteToken only to the host so they can rebuild the share link
  const sessionData = session.toObject();
  if (!isHost) delete sessionData.inviteToken;

  res.status(200).json({ session: sessionData });
});

export const joinSession = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const streamUserId = userId.toString();

  // Token can come from query param (?token=) or request body
  const inviteToken = req.query.token || req.body.token;

  const existingSession = await Session.findById(req.params.id);

  if (!existingSession) throw new ApiError(404, "Session not found");

  if (existingSession.status !== "active") {
    throw new ApiError(400, "Cannot join a completed session");
  }

  const isHost = existingSession.host.toString() === userId.toString();
  const isAlreadyParticipant = existingSession.participant?.toString() === userId.toString();

  // Host rejoin — no token needed
  if (isHost) {
    return res.status(200).json({ session: existingSession });
  }

  // Already the participant — allow rejoin without token
  if (isAlreadyParticipant) {
    return res.status(200).json({ session: existingSession });
  }

  // New joiner — must have the correct invite token
  if (!inviteToken) {
    throw new ApiError(403, "An invite link is required to join this session");
  }

  if (inviteToken !== existingSession.inviteToken) {
    throw new ApiError(403, "Invalid invite token — please use the correct link");
  }

  // Atomically claim the participant slot
  const session = await Session.findOneAndUpdate(
    { _id: req.params.id, status: "active", participant: null },
    { $set: { participant: userId } },
    { new: true }
  );

  if (!session) throw new ApiError(409, "Session is already full");

  const channel = chatClient.channel("messaging", session.callId);
  await channel.addMembers([streamUserId]);

  res.status(200).json({ session });
});

export const endSession = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const session = await Session.findById(req.params.id);

  if (!session) throw new ApiError(404, "Session not found");

  if (session.host.toString() !== userId.toString()) {
    throw new ApiError(403, "Only the host can end the session");
  }

  if (session.status === "completed") {
    throw new ApiError(400, "Session is already completed");
  }

  try {
    const call = streamClient.video.call("default", session.callId);
    await call.delete({ hard: true });
  } catch (error) {
    console.error("Stream call cleanup failed:", error.message);
  }

  try {
    const channel = chatClient.channel("messaging", session.callId);
    await channel.delete();
  } catch (error) {
    console.error("Stream channel cleanup failed:", error.message);
  }

  session.status = "completed";
  await session.save();

  res.status(200).json({ session, message: "Session ended successfully" });
});
