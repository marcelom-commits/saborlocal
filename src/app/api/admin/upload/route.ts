import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/access";
import { saveBase64Image } from "@/lib/upload";

export async function POST(request: Request) {
  const admin = await requireAdminApi();
  if (admin instanceof NextResponse) return admin;

  try {
    const { image } = await request.json();
    const url = await saveBase64Image(image);
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: "Erro ao fazer upload" }, { status: 400 });
  }
}
