// /lib/supabase/unlockField.ts

type UnlockFieldPayload = {
    sku: string;
    field: string;
  };
  
  export async function unlockField({ sku, field }: UnlockFieldPayload): Promise<{ success: boolean }> {
    try {
      const response = await fetch("/api/products/unlock-field", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sku, field }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to unlock field");
      }
  
      return { success: true };
    } catch (error) {
      console.error("🔓 Unlock field error:", error);
      return { success: false };
    }
  }
  