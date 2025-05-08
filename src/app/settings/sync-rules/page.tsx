"use client"

import React, { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { DndContext, closestCenter } from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { SortableItem } from "@/components/ui/sortable-item"

export default function SyncRulesSettings() {
  const [distributors, setDistributors] = useState<{ id: string; distributor_name: string; position: number }[]>([])
  const [rules, setRules] = useState<{ id: string; allow_incomplete_products: boolean; auto_pause_if_invalid: boolean } | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Load distributors and sync rules
  useEffect(() => {
    const fetchSettings = async () => {
      const { data: distData } = await supabase
        .from("preferred_distributors")
        .select("*")
        .order("position", { ascending: true })

      const { data: rulesData } = await supabase
        .from("sync_priority_rules")
        .select("*")
        .limit(1)
        .single()

      setDistributors(distData || [])
      setRules(rulesData || null)
    }

    fetchSettings()
  }, [])

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = distributors.findIndex(item => item.id === active.id)
      const newIndex = distributors.findIndex(item => item.id === over.id)
      const newItems = arrayMove(distributors, oldIndex, newIndex)
      setDistributors(newItems)
    }
  }

  const saveSettings = async () => {
    setIsSaving(true)

    // Save reordered distributors
    for (let i = 0; i < distributors.length; i++) {
      await supabase
        .from("preferred_distributors")
        .update({ position: i + 1 })
        .eq("id", distributors[i].id)
    }

    // Save sync rules
    if (rules) {
      await supabase
        .from("sync_priority_rules")
        .update({
          allow_incomplete_products: rules.allow_incomplete_products,
          auto_pause_if_invalid: rules.auto_pause_if_invalid,
        })
        .eq("id", rules.id)
    }

    setIsSaving(false)
    alert("✅ Settings saved.")
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">⚙️ Sync Rules Settings</h1>

      <div>
        <h2 className="text-xl font-semibold mb-4">📦 Distributor Priority</h2>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={distributors.map(d => d.id)}
            strategy={verticalListSortingStrategy}
          >
            {distributors.map(distributor => (
              <SortableItem key={distributor.id} id={distributor.id}>
                {distributor.distributor_name}
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
        <p className="text-sm text-muted-foreground mt-2">
          (Drag to reorder. First in-stock, lowest-price wins)
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">📍 Sync Behavior</h2>
        {rules && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Switch
                checked={rules.auto_pause_if_invalid}
                onCheckedChange={val => setRules({ ...rules, auto_pause_if_invalid: val })}
              />
              <span>Auto-pause if product becomes invalid</span>
            </div>
            <div className="flex items-center gap-4">
              <Switch
                checked={rules.allow_incomplete_products}
                onCheckedChange={val => setRules({ ...rules, allow_incomplete_products: val })}
              />
              <span>Allow sync if data is incomplete (e.g. missing UPC)</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={isSaving}>
          💾 {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  )
}
