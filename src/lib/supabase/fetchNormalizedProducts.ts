// lib/supabase/fetchNormalizedProducts.ts
import { createClient } from "@supabase/supabase-js";

// ✅ DEBUG ENV CHECK
console.log("🔍 ENV CHECK");
console.log("🔗 NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("🛡️ NEXT_PUBLIC_SUPABASE_ANON_KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 10) + "...");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function fetchNormalizedProducts({
  page = 1,
  pageSize = 100
}: {
  page?: number;
  pageSize?: number;
}) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  console.log(`📦 Fetching products from Supabase: rows ${from} to ${to}`);

  const { data, error } = await supabase
    .from("products_normalized")
    .select("sku, title, cost, price, quantity, updated_at") // safe default fields
    .order("updated_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("❌ Supabase query failed:", error.message || error);
    throw error;
  }

  if (!data || !Array.isArray(data)) {
    console.warn("⚠️ Supabase returned no data or unexpected format:", data);
    throw new Error("Invalid or missing data from Supabase.");
  }

  console.log(`✅ Supabase returned ${data.length} product(s)`);
  return data;
}
