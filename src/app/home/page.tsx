"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GeoMap from "./components/GeoMap";

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
  const [selected, setSelected] = useState<number[]>([]);

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
      const data = await res.json();

      if (data.error) {
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

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const deleteSelected = async () => {
    if (selected.length === 0) return;
    try {
      await fetch(`${API_URL}/api/history`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selected }),
      });
      setSelected([]);
      fetchHistory();
    } catch (err) {
      console.error(err);
    }
  };

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
          <p><b>Hostname:</b> {geo.hostname || "N/A"}</p>
          <p><b>City:</b> {geo.city}</p>
          <p><b>Region:</b> {geo.region}</p>
          <p><b>Country:</b> {geo.country}</p>
          <p><b>Location:</b> {geo.loc}</p>
          <p><b>Organization:</b> {geo.org}</p>
          <p><b>Postal:</b> {geo.postal || "N/A"}</p>
          <p><b>Timezone:</b> {geo.timezone}</p>
        </div>
      )}
      {/* Geo Map */}
      {geo && <GeoMap geo={geo} />}

      {/* History */}
      <h2 className="text-xl font-semibold mb-2">History</h2>
      {history.length > 0 && (
        <div className="flex items-center mb-4 gap-2">
            <input
              type="checkbox"
              checked={selected.length === history.length}
              onChange={(e) =>
                setSelected(e.target.checked ? history.map((h) => h.id) : [])
              }
            />
      
            <button
              className="bg-red-600 text-white px-2 py-1 text-sm rounded"
              onClick={deleteSelected}
              disabled={selected.length === 0}
            >
              Delete Selected
            </button>
        </div>
      )}
      <ul className="space-y-2">
        {history.map((h) => (
          <li key={h.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selected.includes(h.id)}
              onChange={() => toggleSelect(h.id)}
            />
            <span
              className="cursor-pointer text-blue-600"
              onClick={() => fetchGeo(h.ip)}
            >
              {h.ip} - {h.result.city}, {h.result.country} (
              {new Date(h.created_at).toLocaleString()})
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
