import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  // 🔹 Ambil data portofolio berdasarkan ID beserta gambar
  const { data, error } = await supabase
    .from("portfolios")
    .select(`
      id,
      title,
      excerpt,
      description,
      link,
      portfolio_images ( id, image_url )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching portfolio:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
