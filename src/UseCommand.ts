import { altenvUtil } from './util/altenv-util';
import { conprint } from 'cliyargs/lib/utils';
import { ALTENV_FILENAME, IOptions } from './index';
import { ClyBaseCommand } from 'cliyargs';

export class UseCommand extends ClyBaseCommand<IOptions> {
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

    const shouldPrint: boolean = this.options.print;

    const config = altenvUtil.getConfig();
    if (!config) {
      return conprint.error(`Error reading altenv config`);
    }

    if (typeof config.transformers[target] !== 'function') {
      const msgBuilder = ['ERROR!'];
      msgBuilder.push(` No target function named '${target}' is defined in ${ALTENV_FILENAME}.`);
      msgBuilder.push(` Please use a different target or edit ${ALTENV_FILENAME} to include the desired target.`);
      return conprint.error(msgBuilder.join(''));
    }

    const envOutput = altenvUtil.writeToEnv(target);
    if (shouldPrint && envOutput && envOutput.length > 0) {
      console.log(envOutput);
    }
  }
}
