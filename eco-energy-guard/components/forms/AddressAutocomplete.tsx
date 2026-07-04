"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

type AddressResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    house_number?: string;
    road?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    postcode?: string;
  };
};

type ParsedAddress = {
  address: string;
  city: string;
  state: string;
  zip: string;
  latitude: number;
  longitude: number;
  osmPlaceId: string;
};

export default function AddressAutocomplete({
  onSelect,
}: {
  onSelect: (address: ParsedAddress) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AddressResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);

      const response = await fetch(
        `/api/geocode?q=${encodeURIComponent(query)}`,
      );
      const data = await response.json();

      setResults(data);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  function handleSelect(result: AddressResult) {
    const street = [result.address?.house_number, result.address?.road]
      .filter(Boolean)
      .join(" ");

    const parsed = {
      address: street || result.display_name,
      city:
        result.address?.city ||
        result.address?.town ||
        result.address?.village ||
        "",
      state: result.address?.state || "",
      zip: result.address?.postcode || "",
      latitude: Number(result.lat),
      longitude: Number(result.lon),
      osmPlaceId: String(result.place_id),
    };

    setQuery(result.display_name);
    setResults([]);
    onSelect(parsed);
  }

  return (
    <div className="relative">
      <label className="text-sm font-semibold">Property address</label>

      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="mt-2 h-12 w-full rounded-xl border bg-background px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
        placeholder="Start typing your address..."
      />

      {loading && (
        <p className="mt-2 text-sm text-muted-foreground">
          Searching addresses...
        </p>
      )}

      {results.length > 0 && (
        <div className="absolute z-30 mt-2 max-h-72 w-full overflow-auto rounded-2xl border bg-white p-2 shadow-xl">
          {results.map((result) => (
            <button
              key={result.place_id}
              type="button"
              onClick={() => handleSelect(result)}
              className="flex w-full gap-3 rounded-xl p-3 text-left text-sm transition hover:bg-muted"
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{result.display_name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
