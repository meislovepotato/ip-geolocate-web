"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type GeoInfo = {
  ip: string;
  hostname?: string;
  city?: string;
  region?: string;
  country?: string;
  loc?: string;
  org?: string;
  postal?: string;
  timezone?: string;
};

type GeoError = { error: string };
type GeoResponse = GeoInfo | GeoError;

type SearchHistory = {
  id: number;
  ip: string;
  result: GeoInfo;
  created_at: string;
};

export default function HomePage() {
  const router = useRouter();
  const [geo, setGeo] = useState<GeoInfo | null>(null);
  const [ip, setIp] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [history, setHistory] = useState<SearchHistory[]>([]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    fetchGeo();
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, token]);

  async function fetchGeo(ipParam?: string) {
    try {
      const url = ipParam
        ? `${API_URL}/api/geo?ip=${ipParam}`
        : `${API_URL}/api/geo`;
      const res = await fetch(url);
      const data: GeoResponse = await res.json();

      if ("error" in data) {
        setError("Failed to fetch geo data.");
        return;
      }
      setGeo(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Error fetching geo info.");
    }
  }

  async function fetchHistory() {
    try {
      const res = await fetch(`${API_URL}/api/history`);
      const data: SearchHistory[] = await res.json();
      setHistory(data);
    } catch (err) {
      console.error(err);
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidIP(ip)) {
      setError("❌ Invalid IP address format.");
      return;
    }
    await fetchGeo(ip);
    setIp("");
    fetchHistory();
  };

  const handleClear = () => {
    setIp("");
    fetchGeo();
  };

  const isValidIP = (input: string) => {
    const ipv4Regex =
      /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
    return ipv4Regex.test(input.trim());
  };

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🌍 Geo Info</h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="text"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          placeholder="Enter IP address"
          className="border px-3 py-2 rounded flex-1"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Search
        </button>
        <button type="button" onClick={handleClear} className="bg-gray-500 text-white px-4 py-2 rounded">
          Clear
        </button>
        <button type="button" onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded">
          Logout
        </button>
      </form>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Geo Result */}
      {geo && (
        <div className="bg-white shadow p-4 mb-4 rounded">
          <p><b>IP:</b> {geo.ip}</p>
          <p><b>City:</b> {geo.city}</p>
          <p><b>Region:</b> {geo.region}</p>
          <p><b>Country:</b> {geo.country}</p>
          <p><b>Location:</b> {geo.loc}</p>
        </div>
      )}

      {/* History */}
      <h2 className="text-xl font-semibold mb-2">History</h2>
      <ul className="list-disc pl-5">
        {history.map((h) => (
          <li
            key={h.id}
            className="cursor-pointer text-blue-600"
            onClick={() => fetchGeo(h.ip)}
          >
            {h.ip} - {h.result.city}, {h.result.country} ({new Date(h.created_at).toLocaleString()})
          </li>
        ))}
      </ul>
    </main>
  );
}
