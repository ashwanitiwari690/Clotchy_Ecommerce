import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { updateProfile, getAddress, upsertAddress } from "../services/user.service";

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await updateProfile(req.user!.id, req.body);
  res.json({ success: true, data: user });
});

export const getMyAddress = asyncHandler(async (req: Request, res: Response) => {
  const address = await getAddress(req.user!.id);
  res.json({ success: true, data: address });
});

export const saveMyAddress = asyncHandler(async (req: Request, res: Response) => {
  const address = await upsertAddress(req.user!.id, req.body);
  res.json({ success: true, data: address });
});
