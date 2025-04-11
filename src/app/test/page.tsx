"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SupabaseTestPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    async function testFetch() {
      const { data, error } = await supabase
        .from("products_normalized")
        .select("sku, title")
        .limit(5);

      if (error) {
        console.error("❌ Supabase fetch error:", error);
        setError(error);
      } else {
        console.log("✅ Supabase returned:", data);
        setProducts(data || []);
      }
    }

    testFetch();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">🔍 Supabase Test</h1>
      {error && <div className="text-red-600">❌ {error.message}</div>}
      <ul className="space-y-2">
        {products.map((p) => (
          <li key={p.sku} className="text-gray-800">✅ {p.sku} – {p.title}</li>
        ))}
      </ul>
    </div>
  );
}
