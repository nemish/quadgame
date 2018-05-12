
export const whileForward = () => ({fn, begin, limit}) => {
  let i = begin;
  while (i <= limit) {
    fn(i);
    i = i + 1;
  }
}

export const whileBack = () => ({fn, begin, limit}) => {
  let i = begin;
  while (i >= limit) {
    fn(i);
    i = i - 1;
  }
}

export const getRandomFromArray = (arr) => arr[Math.floor(Math.random() * arr.length)]

export const sequenceNumbers = (length) => Array.from({ length }, (v, k) => k)


export const genId = () => {
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
}