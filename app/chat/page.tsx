import ChatBox from "@/components/ChatBox";

export default function ChatPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-semibold mb-4 text-blue-700">
        Chat with HealthBuddy
      </h1>
      <ChatBox />
    </main>
  );
}
