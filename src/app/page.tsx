export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="text-center space-y-6">
        <div className="text-6xl mb-2">🌍</div>
        <h1 className="text-5xl font-bold tracking-tight">IP Geolocate</h1>
        <p className="text-xl text-slate-300 max-w-md">
          Discover location information from any IP address instantly.
        </p>
        <a
          href="/login"
          className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
        >
          Get Started
        </a>
      </div>
    </main>
  );
}
