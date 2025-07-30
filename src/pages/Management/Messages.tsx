import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { onValue, ref } from "firebase/database";
import { useSearchParams } from "react-router-dom";

type Message = {
  id: string;
  senderId: string;
  content: string;
  [key: string]: any;
};

export default function Messages() {
  const [params] = useSearchParams();
  const roomId = params.get("roomId");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!roomId) return;
    const msgRef = ref(db, `messages/${roomId}`);
    const unsub = onValue(msgRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data).map(([id, m]) => ({
          id,
          ...(m as any),
        }));
        setMessages(list);
      }
    });
    return () => unsub();
  }, [roomId]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Tin nhắn của phòng: {roomId}</h2>
      <ul className="space-y-2">
        {messages.map((m: any) => (
          <li key={m.id}>
            <strong>{m.senderId}:</strong> {m.content}
          </li>
        ))}
      </ul>
    </div>
  );
}
