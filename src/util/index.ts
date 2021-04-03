import { AltenvConfig } from '../index';

export function _fn(f: () => any) {
  return f();
}

export const defaultConfig: AltenvConfig = {
  defaultEnv: {},
  transformers: {}
};
