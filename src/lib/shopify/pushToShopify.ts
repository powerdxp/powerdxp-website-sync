// /src/lib/shopify/pushToShopify.ts
import { createClient } from "@supabase/supabase-js";

// 🛡️ Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Push one or more SKUs to Shopify by updating Supabase
 */
export async function pushToShopify(skus: string[]): Promise<"success" | "error"> {
  if (!Array.isArray(skus) || skus.length === 0) {
    console.warn("⚠️ pushToShopify called with empty SKUs array");
    return "error";
  }

  const { error } = await supabase
    .from("products_normalized")
    .update({ synced_to_shopify: true })
    .in("sku", skus);

  if (error) {
    console.error("❌ Failed to push SKUs to Shopify:", error.message);
    return "error";
  }

  console.log(`✅ Marked ${skus.length} SKU(s) as synced_to_shopify`);
  return "success";
}
