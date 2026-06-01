const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt(10);
  const customerHash = await bcrypt.hash("123456", salt);
  const adminHash = await bcrypt.hash("admin123", salt);

  // Categorias
  const catBolos = await prisma.category.upsert({
    where: { slug: "bolos" },
    update: {},
    create: { name: "Bolos", slug: "bolos", description: "Bolos artesanais para festas e datas especiais.", imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80", sortOrder: 1 },
  });
  const catDoces = await prisma.category.upsert({
    where: { slug: "doces-finos" },
    update: {},
    create: { name: "Doces finos", slug: "doces-finos", description: "Brigadeiros, trufas e doces gourmet.", imageUrl: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=1200&q=80", sortOrder: 2 },
  });
  const catKits = await prisma.category.upsert({
    where: { slug: "kits-presenteaveis" },
    update: {},
    create: { name: "Kits presenteaveis", slug: "kits-presenteaveis", description: "Combinacoes especiais para presentear.", imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80", sortOrder: 3 },
  });

  // Produtos
  const p1 = await prisma.product.upsert({
    where: { slug: "kit-cafe-e-afeto" },
    update: {},
    create: { categoryId: catKits.id, name: "Kit Cafe e Afeto", slug: "kit-cafe-e-afeto", description: "Selecao de mini bolo, doces e mimo especial.", price: 129.90, stock: 10, isFeatured: true },
  });
  const p2 = await prisma.product.upsert({
    where: { slug: "caixa-com-24-brigadeiros" },
    update: {},
    create: { categoryId: catDoces.id, name: "Caixa com 24 Brigadeiros", slug: "caixa-com-24-brigadeiros", description: "Sabores classicos e gourmet com acabamento artesanal.", price: 74.90, stock: 20, isFeatured: true },
  });
  const p3 = await prisma.product.upsert({
    where: { slug: "bolo-de-cenoura-com-brigadeiro" },
    update: {},
    create: { categoryId: catBolos.id, name: "Bolo de Cenoura com Brigadeiro", slug: "bolo-de-cenoura-com-brigadeiro", description: "Classico brasileiro com cobertura cremosa.", price: 139.90, stock: 5, isFeatured: true },
  });
  const p4 = await prisma.product.upsert({
    where: { slug: "bolo-red-velvet-premium" },
    update: {},
    create: { categoryId: catBolos.id, name: "Bolo Red Velvet Premium", slug: "bolo-red-velvet-premium", description: "Massa aveludada com recheio leve de cream cheese.", price: 169.90, stock: 5, isFeatured: true },
  });

  // Imagens dos produtos
  const images = [
    { productId: p1.id, url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80", alt: "Kit Cafe e Afeto", sortOrder: 0 },
    { productId: p2.id, url: "https://images.unsplash.com/photo-1511381939415-c1f69419868d?auto=format&fit=crop&w=1200&q=80", alt: "Caixa com 24 Brigadeiros", sortOrder: 0 },
    { productId: p3.id, url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80", alt: "Bolo de Cenoura com Brigadeiro", sortOrder: 0 },
    { productId: p4.id, url: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1200&q=80", alt: "Bolo Red Velvet Premium", sortOrder: 0 },
  ];
  for (const img of images) {
    const existing = await prisma.productImage.findFirst({ where: { productId: img.productId, sortOrder: img.sortOrder } });
    if (!existing) await prisma.productImage.create({ data: img });
  }

  // Usuários demo
  const customerUser = await prisma.user.upsert({
    where: { email: "cliente@saborlocal.com" },
    update: {},
    create: { email: "cliente@saborlocal.com", passwordHash: customerHash, name: "Cliente Demo", role: "CUSTOMER" },
  });
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@saborlocal.com" },
    update: {},
    create: { email: "admin@saborlocal.com", passwordHash: adminHash, name: "Admin SaborLocal", role: "ADMIN" },
  });

  // Perfis
  const existingProfile = await prisma.customerProfile.findUnique({ where: { userId: customerUser.id } });
  if (!existingProfile) {
    await prisma.customerProfile.create({ data: { userId: customerUser.id, phone: "(61) 99999-0000" } });
  }
  const existingAdmin = await prisma.adminUser.findUnique({ where: { userId: adminUser.id } });
  if (!existingAdmin) {
    await prisma.adminUser.create({ data: { userId: adminUser.id, title: "Super Admin", permissions: ["all"] } });
  }

  console.log("Seed concluído com sucesso!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
