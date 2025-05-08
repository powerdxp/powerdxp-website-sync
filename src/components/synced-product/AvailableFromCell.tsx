"use client";

import React, { useEffect, useState } from "react";
import { fetchVariantsForSku } from "@/lib/supabase/fetchVariantsForSku";

export function AvailableFromCell({ sku }: { sku: string }) {
  const [variants, setVariants] = useState<string[] | null>(null);

  useEffect(() => {
    fetchVariantsForSku(sku).then((data) => {
      setVariants(data?.map((v) => v.distributor_name));
    });
  }, [sku]);

  return (
    <div className="text-sm text-muted-foreground">
      {variants ? variants.join(", ") : "Loading..."}
    </div>
  );
}
