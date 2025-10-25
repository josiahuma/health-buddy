import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-700">
        🩺 HealthBuddy
      </h1>
      <p className="text-gray-600 mb-8 max-w-xl">
        Your friendly AI symptom assistant. Get possible causes, sensible next
        steps, and when to seek care. Not medical advice.
      </p>
      <Link
        href="/chat"
        className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition"
      >
        Chat with HealthBuddy
      </Link>
    </main>
  );
}
