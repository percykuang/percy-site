export function countWords(content: string) {
  const englishWords = content.match(/[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)*/g) ?? []
  const cjkCharacters = content.match(/[\u3400-\u9fff]/g) ?? []

  return englishWords.length + cjkCharacters.length
}
