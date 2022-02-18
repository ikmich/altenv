import { Fs, Path } from '../deps';
import { fileUtil } from './file.util';
import { DIRECTIVE_NON_VALUE_PREFIX, ALTENV_FILENAME, AltenvConfig, defaultConfig } from '../index';
import { envFileUtil } from './env-file.util';
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

    // Save the selected target in the env file
    let KEY_ALTENV_TARGET = `ALTENV_TARGET`;
    env[KEY_ALTENV_TARGET] = target;

    // Write env file
    try {
      let envOutput = '';
      let keys = Object.keys(env);
      for (let k of keys) {
        const v = env[k];

        if (k.startsWith(DIRECTIVE_NON_VALUE_PREFIX)) {
          // Ignore altenv directive keys.
          envOutput += `${v}\n`;
        } else if (typeof v === 'string') {
          envOutput += `${k}="${v}"\n`;
        } else {
          envOutput += `${k}=${v}\n`;
        }
      }

      // Object.keys(env).forEach((k) => {
      //
      // });

      let envFilePath = envFileUtil.getFilePath();
      if (!envFilePath) {
        envFilePath = envFileUtil.createEnvFile();
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
