import { User } from "../services/userService";

export const getDisplayName = (uid: string, users: Record<string, User>): string => {
  if (!uid || typeof uid !== "string") return uid;

  const user = users?.[uid];
  if (!user) {
    return uid;
  }

  return user.nickname?.trim() ? user.nickname : user.email || uid;
};
