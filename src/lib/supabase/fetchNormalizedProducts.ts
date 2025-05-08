import { supabase } from "./browserClient";
import type { Product } from "@/components/catalog/columns";

/**
 * Fetch normalized products with cursor-based pagination and advanced filters.
 */
export async function fetchNormalizedProducts({
  pageSize = 100,
  cursor,
  filters = {},
}: {
  pageSize?: number;
  cursor?: string | null;
  filters?: Record<string, any>;
}) {
  console.log("📦 Fetching products from Supabase...");
  console.log("📎 Cursor:", cursor, "🔢 Limit:", pageSize);

  let query = supabase
    .from("products_normalized")
    .select(
      `
      sku,
      title, title_locked,
      cost,
      price,
      quantity,
      map,
      min_price as minPrice,
      max_price as maxPrice,
      brand, brand_locked,
      vendor, vendor_locked,
      upc, upc_locked,
      asin,
      weight,
      width,
      length,
      height,
      shippingCost,
      imageCount,
      imageUrl,
      images,
      description, description_locked,
      product_type, product_type_locked,
      tags, tags_locked,
      meta_title, meta_title_locked,
      meta_description, meta_description_locked,
      blocked,
      visibility,
      status,
      condition,
      category,
      shopify_id,
      amazon_sku,
      synced_to_shopify,
      approved_for_shopify,
      distributor_name as distributor,
      sync_status,
      source_file,
      created_at as createdAt,
      updated_at as lastUpdated
      `,
      { count: "exact" }
    )
    .order("lastUpdated", { ascending: false })
    .limit(pageSize);

  if (cursor) {
    query = query.lt("lastUpdated", cursor);
  }

  // 🔍 Apply dynamic filters
  if (filters.title) query = query.ilike("title", `%${filters.title}%`);
  if (filters.brand) query = query.eq("brand", filters.brand);
  if (filters.vendor) query = query.eq("vendor", filters.vendor);
  if (filters.upc) query = query.eq("upc", filters.upc);
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.blocked !== undefined) query = query.eq("blocked", filters.blocked);
  if (filters.visibility) query = query.eq("visibility", filters.visibility);
  if (filters.priceMin) query = query.gte("price", filters.priceMin);
  if (filters.priceMax) query = query.lte("price", filters.priceMax);
  if (filters.quantityMin) query = query.gte("quantity", filters.quantityMin);
  if (filters.quantityMax) query = query.lte("quantity", filters.quantityMax);
  if (filters.updatedAfter) query = query.gte("lastUpdated", filters.updatedAfter);
  if (filters.updatedBefore) query = query.lte("lastUpdated", filters.updatedBefore);
  if (filters.distributor) query = query.eq("distributor_name", filters.distributor);

  const { data, error, count } = await query;

  if (error) {
    console.error("❌ Supabase query failed:", error.message || error);
    throw error;
  }

  if (!data || !Array.isArray(data)) {
    console.warn("⚠️ Supabase returned no data or unexpected format:", data);
    throw new Error("Invalid or missing data from Supabase.");
  }

  // ✅ Safe cast to match Product type
  const typedData = data as unknown as Product[];

  // ✅ Clean the fields for UI usage
  const cleanedData = typedData.map((p) => ({
    ...p,
    title: typeof p.title === "string" ? p.title.trim() : "",
    vendor: typeof p.vendor === "string" ? p.vendor.trim() : "",
    tags: p.tags ?? "",
  }));

  console.log(`✅ Supabase returned ${cleanedData.length} product(s)`);

  return {
    data: cleanedData,
    nextCursor: cleanedData.length > 0 ? cleanedData.at(-1)?.lastUpdated ?? null : null,
    total: count ?? cleanedData.length,
  };
}
