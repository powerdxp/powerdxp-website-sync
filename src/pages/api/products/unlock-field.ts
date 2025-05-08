// /pages/api/products/unlock-field.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

// Use service role key to allow updates
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { sku, field } = req.body;

  if (!sku || !field) {
    return res.status(400).json({ error: "Missing SKU or field" });
  }

  const fieldName = `${field}_locked`;

  const { error } = await supabase
    .from("products_normalized")
    .update({ [fieldName]: false })
    .eq("sku", sku);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true });
}
