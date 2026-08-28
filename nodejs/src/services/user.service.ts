import { prisma } from "../config/db";
import { ApiError } from "../utils/ApiError";

interface UpdateProfileInput {
  name?: string;
  email?: string;
  avatar?: string;
}

// Phone is intentionally excluded: it's the account identifier and can't be changed here.
export const updateProfile = async (userId: string, input: UpdateProfileInput) => {
  const data: { name?: string; email?: string | null; avatar?: string } = {};

  if (input.name !== undefined) {
    data.name = input.name;
  }

  if (input.avatar !== undefined) {
    data.avatar = input.avatar;
  }

  if (input.email !== undefined) {
    const email = input.email.trim();
    data.email = email === "" ? null : email;

    if (data.email) {
      const existing = await prisma.user.findUnique({ where: { email: data.email } });
      if (existing && existing.id !== userId) {
        throw ApiError.conflict("This email is already in use");
      }
    }
  }

  return prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, name: true, phone: true, email: true, role: true, avatar: true },
  });
};

export const getAddress = (userId: string) => prisma.address.findUnique({ where: { userId } });

interface AddressInput {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export const upsertAddress = (userId: string, input: AddressInput) =>
  prisma.address.upsert({
    where: { userId },
    create: { ...input, userId },
    update: { ...input },
  });
