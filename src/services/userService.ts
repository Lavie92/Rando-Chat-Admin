import { db } from "../firebaseConfig";
import { get, ref } from "firebase/database";
import { fetchPaginatedData } from "./firebasePagination";
export interface User {
    uid: string;
    email: string;
    nickname: string;
    isOnline: boolean;
    lastUpdated?: number;
    isDisabled?: boolean;
    activeRoomId?: string;
    status?: string;
    joinedAt?: number;
    inChatRoom?: boolean;
    citizenPoint?: number;
    photoPoint?: number;
    banReason?: string;
    isEmailVerified?: boolean;
    photoURL?: string;
}

export interface PaginatedUsers {
    users: User[];
    totalCount: number;
    hasMore: boolean;
    lastKey?: string;
}

export const getUsersCount = async (): Promise<number> => {
    const snapshot = await get(ref(db, "users"));
    const data = snapshot.val();
    return data ? Object.keys(data).length : 0;
};

export const fetchUsersPaginated = async (
  _page: number,
  limit: number,
  startAfterKey?: string
): Promise<PaginatedUsers> => {
  const result = await fetchPaginatedData<User>(
    "users",
    limit,
    startAfterKey,
    (uid, user) => ({
      uid,
      nickname: user.nickname || "",
      email: user.email || "",
      isOnline: user.isOnline ?? false,
      lastUpdated: user.lastUpdated ?? 0,
      isDisabled: user.isDisabled ?? false,
      activeRoomId: user.activeRoomId ?? "",
      status: user.status ?? "",
      joinedAt: user.joinedAt ?? 0,
      inChatRoom: user.inChatRoom ?? false,
      citizenPoint: user.citizenPoint ?? 0,
      photoPoint: user.photoPoint ?? 0,
      banReason: user.banReason ?? "",
      isEmailVerified: user.isEmailVerified ?? false,
      photoURL: user.photoURL ?? ""
    })
  );

  return {
    users: result.items,
    totalCount: result.totalCount,
    hasMore: result.hasMore,
    lastKey: result.lastKey,
  };
};