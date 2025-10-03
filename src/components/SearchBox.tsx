import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type Suggestion = {
  display_name: string;
  lat: string;
  lon: string;
};

export default function SearchBox({
  value,
  onSelect,
  placeholder = "Search a place…",
  minChars = 3,
}: {
  value?: string;
  onSelect: (item: { name: string; lat: number; lon: number }) => void;
  placeholder?: string;
  minChars?: number;
}) {
  const [q, setQ] = useState(value ?? "");
  const [items, setItems] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const debounced = useMemo(() => {
    let t: any;
    return (val: string) => {
      clearTimeout(t);
      t = setTimeout(async () => {
        if (val.trim().length < minChars) {
          setItems([]);
          setOpen(false);
          return;
        }
        try {
          setLoading(true);
          const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(val)}&addressdetails=1&limit=8`;
          const r = await fetch(url, { headers: { "Accept-Language": "en" } });
          const data = (await r.json()) as Suggestion[];
          setItems(data ?? []);
          setOpen(true);
        } catch {
          setItems([]);
          setOpen(false);
        } finally {
          setLoading(false);
        }
      }, 300);
    };
  }, [minChars]);

  useEffect(() => { debounced(q); }, [q, debounced]);
  useEffect(() => { setQ(value ?? ""); }, [value]);

  return (
    <div className="relative">
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        onFocus={() => items.length > 0 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 160)}
        autoComplete="off"
      />
      {open && (
        <Card className="absolute z-[100] mt-1 w-full max-h-64 overflow-auto p-1">
          {loading && <div className="px-3 py-2 text-sm text-muted-foreground">Searching…</div>}
          {!loading && items.length === 0 && (
            <div className="px-3 py-2 text-sm text-muted-foreground">No results</div>
          )}
          {!loading &&
            items.map((s, i) => (
              <button
                key={`${s.lat}-${s.lon}-${i}`}
                className="w-full rounded px-3 py-2 text-left text-sm hover:bg-muted"
                onClick={() => {
                  onSelect({ name: s.display_name, lat: parseFloat(s.lat), lon: parseFloat(s.lon) });
                  setQ(s.display_name);
                  setOpen(false);
                }}
              >
                {s.display_name}
              </button>
            ))}
        </Card>
      )}
    </div>
  );
}
