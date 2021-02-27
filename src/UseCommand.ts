import { BaseCmd } from 'cliyargs/lib/BaseCmd';
import { altenvUtil } from './util/altenv-util';
import { conprint } from 'cliyargs/lib/utils';
import { ALTENV_FILENAME } from './index';
import { dotEnv } from './util/dot-env';
import { Fs } from './deps';

export class UseCommand extends BaseCmd {
  async run() {
    await super.run();

    const filepath = altenvUtil.getFilePath();
    if (!filepath || filepath.length === 0) {
      return conprint.error(
        `${ALTENV_FILENAME} not found. Please run \`altenv init\` to create the altenv config file.`
      );
    }

    const target: string = this.getArg(1) ?? '';
    if (!target || target.length < 1) {
      return conprint.error(`No target specified. Usage: \`altenv use <target>\``);
    }

    const config = altenvUtil.getObject();
    if (!config) {
      return conprint.error(`Error reading altenv config`);
    }

    if (typeof config.transformers[target] !== 'function') {
      const msgBuilder = ['ERROR!'];
      msgBuilder.push(` No target function named '${target}' is defined in ${ALTENV_FILENAME}.`);
      msgBuilder.push(` Please use a different target or edit ${ALTENV_FILENAME} to include the desired target.`);
      return conprint.error(msgBuilder.join(''));
    }

    function altenv() {
      let env = Object.assign({}, config.defaultEnv);
      const keys = Object.keys(config.transformers);
      if (target && keys.includes(target)) {
        env = config.transformers[target](env);
      }

      // Write env file
      try {
        let output = '';
        Object.keys(env).forEach((k) => {
          const v = env[k];
          if (typeof v === 'string') {
            output += `${k}="${v}"\n`;
          } else {
            output += `${k}=${v}\n`;
          }
        });

        const filepath = dotEnv.getFilePath();
        if (!filepath) {
          dotEnv.createDotEnv();
        }

        Fs.writeFileSync(dotEnv.getFilePath()!, output, 'utf-8');
        conprint.success(`.env has been updated for target '${target}'`);
      } catch (e) {
        conprint.error('Error writing env file');
        console.error(e);
      }
    }

    altenv();
  }
}
