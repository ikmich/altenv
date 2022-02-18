import { Fs, Path } from '../deps';
import { ALTENV_FILENAME } from '../index';

export const fileUtil = {
  getRootDir() {
    return process.cwd();
  },

  getAltenvFilepath() {
    return Path.join(this.getRootDir(), ALTENV_FILENAME);
  },

  readJSOB(filepath: string) {
    if (Fs.existsSync(filepath)) {
      try {
        return require(filepath);
      } catch (e) {
        throw e;
      }
    }
    return null;
  },

  readFileContents(filepath: string) {
    if (!Fs.existsSync(filepath)) {
      throw new Error('File not found');
    }
    return Fs.readFileSync(filepath, { encoding: 'utf-8' });
  }
};
