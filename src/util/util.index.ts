export function _fn(f: () => any) {
  return f();
}

export function isNumeric(s: string) {
  return s != '' && !isNaN(Number(s));
}

// const value = '0.0.0.0';
// console.log(`isNumeric(${value}):`, isNumeric(value));
// // console.log(`parseInt('e')`, parseInt(''));
// console.log(`Number(e)`, Number('e'));
// // console.log(`parseFloat('')`, parseFloat(''));
// console.log(`Number(${value})`, Number(value));
