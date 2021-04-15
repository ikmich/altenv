import { Fs, Path } from '../deps';
import { fileUtil } from './file-util';
import { ALTENV_FILENAME, AltenvConfig, defaultConfig } from '../index';
import { dotEnv } from './dot-env';
import { conprint } from 'cliyargs/lib/utils';

export const altenvUtil = {
  getFilePath(): string | null {
    const rootPath = fileUtil.getRootDir();
    const filepath = Path.join(rootPath, ALTENV_FILENAME);

    if (Fs.existsSync(filepath)) {
      return filepath;
    }

    return null;
  },

  getConfig(): AltenvConfig {
    const filepath = this.getFilePath();
    if (filepath) {
      return <AltenvConfig>require(filepath);
    }
    return defaultConfig;
  },

  hasAltenvFile(): boolean {
    const filePath = this.getFilePath();
    return !!filePath && filePath.length > 0;
  },

  /**
   * Write to .env file using properties defined in the specified target function.
   * @param target
   */
  writeToEnv(target: string) {
    const config = this.getConfig();

    let env = Object.assign({}, config.defaultEnv);
    const keys = Object.keys(config.transformers);
    if (target && keys.includes(target)) {
      env = config.transformers[target](env);
    }

    // Write env file
    try {
      let envOutput = '';
      Object.keys(env).forEach((k) => {
        const v = env[k];
        if (typeof v === 'string') {
          envOutput += `${k}="${v}"\n`;
        } else {
          envOutput += `${k}=${v}\n`;
        }
      });

      let envFilePath = dotEnv.getFilePath();
      if (!envFilePath) {
        envFilePath = dotEnv.createDotEnv();
      }

      Fs.writeFileSync(envFilePath, envOutput, 'utf-8');

      conprint.success(`.env has been updated for target '${target}'`);

      return envOutput;
    } catch (e) {
      conprint.error('Error writing env file');
      console.error(e);
      return '';
    }
  }
};
