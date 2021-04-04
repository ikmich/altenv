import { IOptions } from './index';
import { ClyBaseCommand } from 'cliyargs';
import { altenvUtil } from './util/altenv-util';

class LsCommand extends ClyBaseCommand<IOptions> {
  async run() {
    await super.run();

    const config = altenvUtil.getConfig();
    if (config) {
      let targets = Object.keys(config.transformers);
      console.log('Defined targets...');
      console.log(targets);
    }
  }
}

export default LsCommand;
