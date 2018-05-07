
export const whileForward = () => ({fn, begin, val}) => {
  let i = begin;
  while (i <= val) {
    fn(i);
    i = i + 1;
  }
}

export const whileBack = () => ({fn, begin, val}) => {
  let i = begin;
  while (i >= val) {
    fn(i);
    i = i - 1;
  }
}

export const getRandomFromArray = (arr) => arr[Math.floor(Math.random() * arr.length)]

export const sequenceNumbers = (length) => Array.from({ length }, (v, k) => k)
