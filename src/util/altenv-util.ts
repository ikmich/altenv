import { Fs, Path } from '../deps';
import { fileUtil } from './file-util';
import { ALTENV_FILENAME } from '../index';

export const altenvUtil = {
  getFilePath(): string | null {
    const rootPath = fileUtil.getRootDir();
    const filepath = Path.join(rootPath, ALTENV_FILENAME);

    if (Fs.existsSync(filepath)) {
      return filepath;
    }

    return null;
  },

  getObject() {
    const filepath = this.getFilePath();
    if (filepath) {
      return require(filepath);
    }
    return null;
  }
};
