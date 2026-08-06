// Tier progression for Nebula — merges climb this ladder instead of 2048's
// plain doubling numbers. Index = tier, value = classic 2048-style score value.
export const TIERS = [
  { name: 'Dust',        bg: '#4b5563', text: '#e5e7eb', glow: false },
  { name: 'Asteroid',    bg: '#64748b', text: '#f1f5f9', glow: false },
  { name: 'Comet',       bg: '#38bdf8', text: '#082f3d', glow: false },
  { name: 'Moon',        bg: '#c7d2fe', text: '#1e1b4b', glow: false },
  { name: 'Planet',      bg: '#818cf8', text: '#1e1b4b', glow: false },
  { name: 'Star',        bg: '#fbbf24', text: '#3f2d00', glow: true },
  { name: 'Nova',        bg: '#fb923c', text: '#3f1900', glow: true },
  { name: 'Supernova',   bg: '#f87171', text: '#450a0a', glow: true },
  { name: 'Black Hole',  bg: '#1e1b4b', text: '#c7d2fe', glow: true },
  { name: 'Galaxy',      bg: 'linear-gradient(135deg, #a78bfa, #f472b6)', text: '#1e1033', glow: true },
]

export const WIN_TIER_INDEX = TIERS.length - 1 // reaching "Galaxy" wins

// Value is uncapped and always doubles per tier (2, 4, 8 ... 1024, 2048, ...)
// so infinite play past Galaxy keeps scoring correctly forever.
export function tierValue(tierIndex) {
  return 2 ** (tierIndex + 1)
}

// Visuals cap at Galaxy — tiers beyond that reuse Galaxy's look, with a
// multiplier suffix so continued progress is still visible ("Galaxy ×2", ...).
export function tierVisual(tierIndex) {
  const base = TIERS[Math.min(tierIndex, WIN_TIER_INDEX)]
  if (tierIndex <= WIN_TIER_INDEX) return { ...base, label: base.name }
  const multiplier = 2 ** (tierIndex - WIN_TIER_INDEX)
  return { ...base, label: `${base.name} ×${multiplier}` }
}