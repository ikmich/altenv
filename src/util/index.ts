export function _fn(f: () => any) {
  return f();
}

export function isNumeric(s: string) {
  return !isNaN(parseFloat(s));
}

// const value = '343';
// console.log(`isNumeric(${value}):`, isNumeric(value));
// console.log(`parseInt('e')`, parseInt(''));
// console.log(`parseFloat('')`, parseFloat(''));
