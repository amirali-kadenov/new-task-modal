const SPACE = ' '

export const getSpacesAmount = (text: string) => {
  return text.split('').reduce((acc, char) => {
    if (char === SPACE) {
      return acc + 1
    }
    return acc
  }, 0)
}
