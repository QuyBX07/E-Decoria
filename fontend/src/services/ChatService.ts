import { ChatMessage } from "@/types/Chat";

const BASE_URL = "http://127.0.0.1:8000/api";

export async function sendChatMessage(
  message: string
): Promise<ChatMessage> {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    throw new Error("Chat API error");
  }

  return res.json();
}
