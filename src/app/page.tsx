export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">🌍 IP Geolocate Web</h1>
      <p className="text-lg text-gray-700 mb-6">Welcome to the app!</p>
      <a
        href="/login"
        className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        Go to Login
      </a>
    </main>
  );
}
