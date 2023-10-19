export const countNumbersBetween = (array, lowerBound, upperBound) => {
  const numbersBetween = array.filter(
    element => element < lowerBound || element > upperBound
  )

  return numbersBetween.length + 1
}
