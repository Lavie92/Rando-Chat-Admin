import { db } from "../firebaseConfig";
import { get, ref } from "firebase/database";

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

export const fetchAllChatRooms = async (): Promise<ChatRoom[]> => {
  const snapshot = await get(ref(db, "chat_rooms"));
  const data = snapshot.val();
  const result: ChatRoom[] = [];

  if (data) {
    for (const [roomId, room] of Object.entries<any>(data)) {
      const participantIds: string[] = room.participantIds
        ? Object.values(room.participantIds).map(String)
        : [];

      const messages = room.messages || {};
      const counts: Record<string, number> = {};

      Object.values(messages).forEach((msg: any) => {
        if (msg.senderId === "system" || msg.systemMessage) return;
        const id = msg.senderId;
        if (id) counts[id] = (counts[id] || 0) + 1;
      });

      const total = Object.values(counts).reduce((a, b) => a + b, 0);
      const percents: Record<string, number> = {};
      Object.entries(counts).forEach(([uid, count]) => {
        percents[uid] = total === 0 ? 0 : +((count / total) * 100).toFixed(1);
      });

      result.push({
        id: roomId,
        active: room.active ?? false,
        createdAt: room.createdAt ?? 0,
        chatType: room.chatType ?? "UNKNOWN",
        lastMessage: room.lastMessage,
        lastUpdated: room.lastUpdated,
        participantIds,
        messages,
        messageCounts: counts,
        messagePercents: percents,
      });
    }
  }

  return result;
};
