import { db } from "../firebaseConfig";
import { get, ref } from "firebase/database";
import { fetchPaginatedData } from "./firebasePagination";
import { CHAT_ROOM_FIREBASE_PATH } from "../utils/constants";

export interface ChatRoom {
  id: string;
  active: boolean;
  createdAt: number;
  chatType: string;
  lastMessage?: string;
  lastUpdated?: number;
  participantIds: string[];
  messages: Record<string, { senderId: string }>;
  messageCounts: Record<string, number>;
  messagePercents: Record<string, number>;
}

export interface PaginatedChatRooms {
  rooms: ChatRoom[];
  totalCount: number;
  hasMore: boolean;
  lastKey?: string;
}

export const getChatRoomCount = async (): Promise<number> => {
  const snapshot = await get(ref(db, CHAT_ROOM_FIREBASE_PATH));
  const data = snapshot.val();
  return data ? Object.keys(data).length : 0;
};

export const fetchChatRoomsPaginated = async (
  _page: number,
  limit: number,
  startAfterKey?: string
): Promise<PaginatedChatRooms> => {
  const result = await fetchPaginatedData<ChatRoom>(
    CHAT_ROOM_FIREBASE_PATH,
    limit,
    startAfterKey,
    (id, room) => {
      const participantIds = room.participantIds
        ? Object.values(room.participantIds).map(String)
        : [];

      const messages = room.messages || {};
      const counts: Record<string, number> = {};
      Object.values(messages).forEach((msg: any) => {
        if (msg.senderId === "system" || msg.systemMessage) return;
        const sid = msg.senderId;
        if (sid) counts[sid] = (counts[sid] || 0) + 1;
      });

      const total = Object.values(counts).reduce((a, b) => a + b, 0);
      const percents: Record<string, number> = {};
      Object.entries(counts).forEach(([uid, count]) => {
        percents[uid] = total === 0 ? 0 : +((count / total) * 100).toFixed(1);
      });

      return {
        id,
        active: room.active ?? false,
        createdAt: room.createdAt ?? 0,
        chatType: room.chatType ?? "UNKNOWN",
        lastMessage: room.lastMessage,
        lastUpdated: room.lastUpdated,
        participantIds,
        messages,
        messageCounts: counts,
        messagePercents: percents,
      };
    }
  );

  return {
    rooms: result.items,
    totalCount: result.totalCount,
    hasMore: result.hasMore,
    lastKey: result.lastKey,
  };
};
