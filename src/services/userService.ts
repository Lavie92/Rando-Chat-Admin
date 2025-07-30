import { db } from "../firebaseConfig";
import { get, ref } from "firebase/database";

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
}


export const fetchAllUsers = async (): Promise<Record<string, User>> => {
    const snapshot = await get(ref(db, "users"));
    const data = snapshot.val();

    const usersMap: Record<string, User> = {};
    if (data) {
        for (const [uid, user] of Object.entries<any>(data)) {
            usersMap[uid] = {
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
            };
        }
    }

    return usersMap;
};
