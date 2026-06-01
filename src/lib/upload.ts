import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function saveBase64Image(base64: string): Promise<string> {
  const matches = base64.match(/^data:image\/(png|jpeg|jpg|webp|gif);base64,(.+)$/);
  if (!matches) throw new Error("Formato de imagem inválido");

  const ext = matches[1] === "jpeg" ? "jpg" : matches[1];
  const buffer = Buffer.from(matches[2], "base64");
  const filename = `${crypto.randomUUID()}.${ext}`;
  const filepath = path.join(process.cwd(), "public", "uploads", filename);

  await fs.mkdir(path.dirname(filepath), { recursive: true });
  await fs.writeFile(filepath, buffer);

  return `/uploads/${filename}`;
}
