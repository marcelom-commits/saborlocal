import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  return [
    { url: siteConfig.url, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/catalogo`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    ...categories.map((cat) => ({
      url: `${siteConfig.url}/catalogo?categoria=${encodeURIComponent(cat.slug)}`,
      lastModified: cat.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    { url: `${siteConfig.url}/carrinho`, changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${siteConfig.url}/login`, changeFrequency: "monthly" as const, priority: 0.2 },
    { url: `${siteConfig.url}/cadastro`, changeFrequency: "monthly" as const, priority: 0.2 },
  ];
}
