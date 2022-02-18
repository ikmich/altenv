export function _fn(f: () => any) {
  return f();
}

export function isNumeric(s: string) {
  return s != '' && !isNaN(Number(s));
}
