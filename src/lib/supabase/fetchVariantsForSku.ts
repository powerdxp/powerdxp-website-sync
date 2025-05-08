// /lib/supabase/fetchVariantsForSku.ts

import { supabase } from "./browserClient";

export async function fetchVariantsForSku(normalizedSku: string) {
  const { data, error } = await supabase
    .from("product_distributor_variants")
    .select("*")
    .eq("normalized_sku", normalizedSku)
    .order("cost", { ascending: true }); // Optional: sort by cost

  if (error) {
    console.error("❌ Error fetching variants:", error.message);
    return [];
  }

  return data;
}
