import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center h-screen bg-green-100">
      <h1 className="text-4xl font-bold mb-4">🏠 Home Page</h1>
      <p className="text-lg text-gray-700 mb-6">
        You are now logged in successfully!
      </p>
      <Link
        href="/login"
        className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        Logout
      </Link>
    </main>
  );
}
