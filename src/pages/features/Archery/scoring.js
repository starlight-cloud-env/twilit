// Small shared helper — counts 9s and 10s among a list of arrow scores.
// Used both per-end (live, while typing) and as a scorecard-wide total.
export function countNinesAndTens(scores) {
  let nines = 0
  let tens = 0
  for (const score of scores) {
    if (score === 9) nines++
    else if (score === 10) tens++
  }
  return { nines, tens }
}