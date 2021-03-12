import { BaseCmd } from 'cliyargs/lib/BaseCmd';
import { dotEnv } from './util/dot-env';
import { generateTransformerFile } from './helpers/generateTransformerFile';
import { conprint, isYesInput } from 'cliyargs/lib/utils';
import { cliyargs } from 'cliyargs';

export class InitCommand extends BaseCmd {
  async run(): Promise<void> {
    await super.run();

    /*
     - Read and parse .env file if exists
     - Create altenv.js file; initialize with data from .env file if exists
     */

    let filePath = dotEnv.getFilePath();
    if (filePath && filePath.length > 0) {
      const input = await cliyargs.askInput(
        'ask_replace_dotenv',
        `${filePath} already exists. Would you like to replace it? (y/n)`
      );
      if (!isYesInput(input)) {
        conprint.notice('Ignoring...');
        return;
      }
    } else {
      // If no .env file, create it.
      dotEnv.createDotEnv();
    }

    const envInit = dotEnv.parse();
    let result = generateTransformerFile(envInit);
    if (result.success) {
      conprint.success(`${filePath} created`);
    }

    //console.log(envInit);
  }
}
