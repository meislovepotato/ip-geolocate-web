'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GeoMap from './components/GeoMap';

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
  const [loading, setLoading] = useState(false);
  const [ip, setIp] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [selected, setSelected] = useState<number[]>([]);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    fetchGeo();
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, token]);

  async function fetchGeo(ipParam?: string) {
    try {
      setLoading(true);
      const url = ipParam ? `${API_URL}/api/geo?ip=${ipParam}` : `${API_URL}/api/geo`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.error) {
        setError('Failed to fetch geo data.');
        setLoading(false);
        return;
      }
      setGeo(data);
      setError('');
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Error fetching geo info.');
      setLoading(false);
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
      setError('❌ Invalid IP address format.');
      return;
    }
    await fetchGeo(ip);
    setIp('');
    fetchHistory();
  };

  const handleClear = () => {
    setIp('');
    fetchGeo();
  };

  const isValidIP = (input: string) => {
    const ipv4Regex =
      /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
    return ipv4Regex.test(input.trim());
  };

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  }

  const toggleSelect = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const deleteSelected = async () => {
    if (selected.length === 0) return;
    try {
      await fetch(`${API_URL}/api/history`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selected }),
      });
      setSelected([]);
      fetchHistory();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">🌍 IP Geolocation Lookup</h1>
        <p className="text-slate-500">
          Search for any IP address and view location details on a map
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="Enter IP address (e.g., 8.8.8.8)"
            className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Geo Result */}
      {geo && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-slate-200">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 font-semibold uppercase mb-1">IP Address</p>
              <p className="font-mono font-bold text-lg text-slate-900">{geo.ip}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 font-semibold uppercase mb-1">City</p>
              <p className="font-bold text-slate-900">{geo.city || 'N/A'}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Region</p>
              <p className="font-bold text-slate-900">{geo.region || 'N/A'}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Country</p>
              <p className="font-bold text-slate-900">{geo.country || 'N/A'}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Coordinates</p>
              <p className="font-mono text-sm text-slate-900">{geo.loc || 'N/A'}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Organization</p>
              <p className="font-bold text-slate-900">{geo.org || 'N/A'}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Postal</p>
              <p className="font-bold text-slate-900">{geo.postal || 'N/A'}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Timezone</p>
              <p className="font-bold text-slate-900">{geo.timezone || 'N/A'}</p>
            </div>
            {geo.hostname && (
              <div className="p-3 bg-slate-50 rounded-lg col-span-2">
                <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Hostname</p>
                <p className="font-mono text-sm text-slate-900">{geo.hostname}</p>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Geo Map */}
      {geo && <GeoMap geo={geo} />}

      {/* History */}
      {history.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-900">Search History</h2>
            {selected.length > 0 && (
              <span className="text-sm text-slate-600">{selected.length} selected</span>
            )}
          </div>
          <div className="flex items-center gap-3 mb-4">
            <input
              type="checkbox"
              checked={selected.length === history.length}
              onChange={(e) => setSelected(e.target.checked ? history.map((h) => h.id) : [])}
              className="w-4 h-4 cursor-pointer"
            />
            <button
              className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={deleteSelected}
              disabled={selected.length === 0}
            >
              Delete Selected
            </button>
          </div>
          <div className="space-y-2">
            {history.map((h) => (
              <div
                key={h.id}
                className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(h.id)}
                  onChange={() => toggleSelect(h.id)}
                  className="w-4 h-4 cursor-pointer"
                />
                <button
                  onClick={() => fetchGeo(h.ip)}
                  className="flex-1 text-left hover:text-blue-600 transition"
                >
                  <div className="font-mono font-semibold text-slate-900">{h.ip}</div>
                  <div className="text-sm text-slate-600">
                    {h.result.city}, {h.result.country} • {new Date(h.created_at).toLocaleString()}
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
