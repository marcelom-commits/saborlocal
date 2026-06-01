export const deliveryRegions = [
  { id: "sobradinho-2", label: "Sobradinho 2", price: 12.00, days: 1 },
  { id: "sobradinho-1", label: "Sobradinho 1", price: 15.00, days: 2 },
  { id: "plano-piloto", label: "Plano Piloto", price: 20.00, days: 2 },
  { id: "outra", label: "Outra região", price: 25.00, days: 3 },
];

export function getShippingOptionByRegion(regionId: string) {
  return deliveryRegions.find((r) => r.id === regionId) || null;
}
