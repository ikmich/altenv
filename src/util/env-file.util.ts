import { Fs, Path } from '../deps';
import { fileUtil } from './file.util';
import { COMMENT_DIRECTIVE, EMPTY_LINE_DIRECTIVE, IEnv } from '../index';
import { isNumeric } from './util.index';

export const envFileUtil = {
  getFilePath(): string | null {
    const envFile = Path.join(fileUtil.getRootDir(), '.env');
    if (Fs.existsSync(envFile)) {
      return envFile;
    }
    return null;
  },

  createEnvFile() {
    const filepath = Path.join(fileUtil.getRootDir(), '.env');
    if (!Fs.existsSync(filepath)) {
      Fs.createFileSync(filepath);
    }
    return filepath;
  },

  getEnvContents() {
    const filepath = this.getFilePath();
    if (filepath) {
      return Fs.readFileSync(filepath, { encoding: 'utf-8' });
    }
    return '';
  },

  parseEnv() {
    let result: any = {};
    let contents: string = envFileUtil.getEnvContents();
    if (!contents) {
      return result;
    }

    let idx = -1;
    let tokens = [];
    let token = '';
    let quotedValueActive = false;
    const QUOTE = '"';
    const SPACE = ' ';
    let line = 1;
    while (++idx < contents.length) {
      const char = contents.charAt(idx);
      const prevChar = idx > 0 ? contents.charAt(idx - 1) : '';
      const isNewLine = char === '\n';

      token += char;
      if (!isNewLine) {
        if (char === QUOTE) {
          quotedValueActive = prevChar === '=';
        }

        if (char === SPACE && prevChar === '=') {
          let err = `Illegal space character after = on line ${line}`;
          throw new Error(err);
        }
      } else {
        ++line;
        if (quotedValueActive) {
          continue;
        }
        tokens.push(token);
        token = '';
      }
    }

    let key = '';
    let value:any = '';
    const env: IEnv = {};
    let lineNo = 0;
    for (let token of tokens) {
      ++lineNo;
      token = token.trim();
      if (!token.length) {
        key = `${EMPTY_LINE_DIRECTIVE}${lineNo}`;
        value = token;
      } else if (token.startsWith('#')) {
        key = `${COMMENT_DIRECTIVE}${lineNo}`;
        value = token;
      } else {
        const kv = token.split('=');
        key = kv[0];
        value = kv[1];
      }

      if (isNumeric(value)) {
        value = Number(value);
      }
      env[key] = value;
    }

    return env;
  }
};
