import { createClient } from "@supabase/supabase-js";

console.log("🔍 ENV CHECK (Ready to Sync Products)");
console.log("🔗 NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("🛡️ NEXT_PUBLIC_SUPABASE_ANON_KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 10) + "...");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function fetchReadyToSyncProducts({
  page = 1,
  pageSize = 100,
}: {
  page?: number;
  pageSize?: number;
}) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  console.log(`📦 Fetching READY-TO-SYNC products: rows ${from} to ${to}`);

  const { data, error } = await supabase
    .from("products_normalized")
    .select(`
      sku,
      title,
      description,
      cost,
      price,
      min_price as minPrice,
      max_price as maxPrice,
      map,
      quantity,
      brand,
      vendor,
      distributor,
      weight,
      width,
      length,
      shippingCost,
      imageCount,
      imageUrl,
      status,
      visibility,
      blocked,
      upc,
      asin,
      approved_for_shopify,
      synced_to_shopify,
      updated_at as lastUpdated,
      created_at as createdAt
    `)
    .eq("approved_for_shopify", true)
    .eq("blocked", false)
    .gt("quantity", 0)
    .not("sku", "is", null)
    .not("title", "is", null)
    .not("price", "is", null)
    .range(from, to)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("❌ Supabase query failed:", error.message || error);
    throw error;
  }

  if (!data || !Array.isArray(data)) {
    console.warn("⚠️ Supabase returned no data or unexpected format:", data);
    throw new Error("Invalid or missing data from Supabase.");
  }

  console.log(`✅ Supabase returned ${data.length} ready-to-sync product(s)`);
  return data;
}
