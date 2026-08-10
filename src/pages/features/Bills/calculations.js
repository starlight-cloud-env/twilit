// Pure tax/split math for the Bills feature — kept dependency-free so it's
// straightforward to unit test independent of Supabase or React.

export function calculateTaxMultiplier(taxRate) {
  return 1 + taxRate / 100
}

export function calculatePersonTotal(subtotal, taxMultiplier) {
  return subtotal * taxMultiplier
}

export function calculateItemizedGrandTotal(people, taxMultiplier) {
  return people.reduce((sum, p) => sum + calculatePersonTotal(p.subtotal, taxMultiplier), 0)
}

export function calculateEvenSplitGrandTotal(preTaxTotal, taxMultiplier) {
  return (preTaxTotal ?? 0) * taxMultiplier
}

export function calculateEvenSplitPerPerson(grandTotal, peopleCount) {
  return peopleCount > 0 ? grandTotal / peopleCount : 0
}