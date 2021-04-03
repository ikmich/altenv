import { dotEnv } from './util/dot-env';
import { generateTransformerFile } from './helpers/generateTransformerFile';
import { IOptions } from './index';
import { cliyargs, ClyBaseCommand } from '../../cliyargs';
import { conprint, isYesInput } from '../../cliyargs/lib/utils';
import { altenvUtil } from './util/altenv-util';

export class InitCommand extends ClyBaseCommand<IOptions> {
  async run(): Promise<void> {
    await super.run();

    let envFilepath = dotEnv.getFilePath();
    if (envFilepath && envFilepath.length > 0) {
      const input = await cliyargs.askInput(
        'ask_replace_dotenv',
        `${envFilepath} already exists. Would you like to replace it? (y/n)`
      );
      if (!isYesInput(input)) {
        conprint.notice('Ignoring...');
        return;
      }
    } else {
      // If no .env file, create it.
      envFilepath = dotEnv.createDotEnv();
    }

    if (!altenvUtil.hasAltenvFile()) {
      const envInit = dotEnv.parse();
      let result = generateTransformerFile(envInit);
      if (result.success) {
        conprint.success(`${envFilepath} created`);
      }
    } else {
      /*
       * altenv config file exists
       * assume it has configurations in it already
       * use the defaultEnv to write to the env file
       */
      altenvUtil.writeToEnv('default');
    }
  }
}
