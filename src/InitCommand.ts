import { envFileUtil } from './util/env-file.util';
import { generateTransformerFile } from './impl/generate-transformer-file.impl';
import { IOptions } from './index';
import { altenvUtil } from './util/altenv.util';
import { conprint } from 'cliyargs/lib/utils';
import { ClyBaseCommand } from 'cliyargs';

export class InitCommand extends ClyBaseCommand<IOptions> {
  async run(): Promise<void> {
    await super.run();

    const envFilepath = envFileUtil.getFilePath();
    const hasEnvFile = envFilepath && envFilepath.length > 0;
    if (!hasEnvFile) {
      // If no .env file, create it.
      envFileUtil.createEnvFile();
      console.log('.env file created');
    }

    if (!altenvUtil.hasAltenvFile()) {
      // No altenv file exists
      const envInit = envFileUtil.parseEnv();

      let result = generateTransformerFile(envInit);
      if (result.success) {
        conprint.success(`${altenvUtil.getFilePath()} created`);
      } else {
        conprint.error('There was an error when generating the altenv config file');
      }
    } else {
      conprint.notice(`${altenvUtil.getFilePath()} already exists.`);
    }
  }
}
