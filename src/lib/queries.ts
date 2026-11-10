import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { DrawnCard } from "./reading-rules";
import type { Interpretation } from "./readings.functions";

export type ReadingRow = {
  id: string;
  question: string;
  reversals: boolean;
  cards: DrawnCard[];
  interpretation: Interpretation;
  provider_model: string | null;
  saved: boolean;
  saved_at: string | null;
  created_at: string;
  expires_at: string;
};
export type ReflectionRow = { id: string; reading_id: string; body: string; stance: string; revision: number; updated_at: string };

export const savedReadingsQuery = () =>
  queryOptions({
    queryKey: ["readings", "saved"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("readings")
        .select("id, question, cards, saved_at, created_at, reflections(id, body, stance, updated_at)")
        .eq("saved", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as (Pick<ReadingRow, "id" | "question" | "cards" | "saved_at" | "created_at"> & { reflections: Pick<ReflectionRow, "id" | "body" | "stance" | "updated_at">[] | Pick<ReflectionRow, "id" | "body" | "stance" | "updated_at"> | null })[];
    },
  });

export const readingQuery = (id: string) =>
  queryOptions({
    queryKey: ["readings", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("readings").select("*, reflections(*)").eq("id", id).maybeSingle();
      if (error) throw error;
      if (!data) return null;
      const r = data as unknown as ReadingRow & { reflections: ReflectionRow[] | ReflectionRow | null };
      const reflection = Array.isArray(r.reflections) ? (r.reflections[0] ?? null) : r.reflections;
      return { ...r, reflection };
    },
  });

export const profileQuery = (userId: string) =>
  queryOptions({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("ai_enabled, ai_enabled_at").eq("id", userId).maybeSingle();
      if (error) throw error;
      return data ?? { ai_enabled: false, ai_enabled_at: null };
    },
  });

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
