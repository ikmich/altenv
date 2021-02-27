import { Fs, Path } from '../deps';
import { fileUtil } from './file-util';

export const dotEnv = {
  getFilePath(): string | null {
    const envFile = Path.join(fileUtil.getRootDir(), '.env');
    if (Fs.existsSync(envFile)) {
      return envFile;
    }
    return null;
  },

  createDotEnv() {
    const filepath = Path.join(fileUtil.getRootDir(), '.env');
    if (!Fs.existsSync(filepath)) {
      Fs.createFileSync(filepath);
    }
  },

  getContents() {
    const filepath = this.getFilePath();
    if (filepath) {
      return Fs.readFileSync(filepath, { encoding: 'utf-8' });
    }
    return null;
  },

  parse(): object {
    let result: any = {};
    let contents = this.getContents();
    if (contents) {
      let lines: string[] = contents.split(/\n|\r|\r\n/);
      if (Array.isArray(lines)) {
        lines.forEach((line) => {
          let [k, v] = line.split(/\s*=\s*/);
          if (k && k.length > 0) {
            let isNumber = false;
            let isBoolean = false;
            let val: any = v;
            if (v && v.length > 0) {
              let isSingleQuoted = v.startsWith("'") && v.endsWith("'");
              let isDoubleQuoted = v.startsWith('"') && v.endsWith('"');
              let quoted = isSingleQuoted || isDoubleQuoted;

              if (!quoted) {
                isBoolean = v === 'true' || v === 'false';
                if (!isBoolean) {
                  isNumber = !isNaN(Number(v));
                }
              }

              // Remove the quotes, since value is going into a js object literal, which assigns a string by default.
              v = v.replace(/^['"]/, '').replace(/['"]$/, '');

              if (isNumber) {
                val = Number(v);
              } else if (isBoolean) {
                val = Boolean(v);
              } else {
                val = v;
              }
            }

            result[k] = val;
          }
        });
      }
    }
    return result;
  }
};
