export const siteConfig = {
  name: "SaborLocal",
  tagline: "Plataforma de e-commerce para comerciantes de alimentos locais",
  description: "Sua loja online completa para vender comida local. Catálogo, carrinho, checkout com Pix e cartão, painel administrativo e muito mais.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "https://saborlocal.vercel.app",
  phone: "(61) 99999-0000",
  email: "contato@saborlocal.com.br",
  hero: {
    title: "Sua loja online de comida local em minutos",
    subtitle: "Plataforma completa para comerciantes de alimentos venderem online com catálogo, pagamentos e gestão profissional.",
  },
  highlights: [
    {
      title: "Pagamento brasileiro",
      description: "Pix, cartão de crédito e boleto. Tudo integrado com gateways nacionais.",
    },
    {
      title: "Entrega por região",
      description: "Calcule frete por CEP, defina regiões de cobertura e agende entregas.",
    },
    {
      title: "Área do cliente",
      description: "Clientes acompanham pedidos, endereços e histórico em área exclusiva.",
    },
  ],
  adminFeatures: {
    title: "Painel administrativo completo",
    description: "Gerencie produtos, pedidos, clientes e relatórios em um painel intuitivo e profissional.",
  },
};
