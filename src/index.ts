#!/usr/bin/env node
import { InitCommand } from './InitCommand';
import { UseCommand } from './UseCommand';
import { cliyargs, IClyCommandInfo, IClyCommandOpts } from '../../cliyargs';

export const ALTENV_FILENAME = 'altenv.js';

export type TResult = {
  success: boolean;
  error?: Error | string | null;
  data?: any;
};

export interface IEnv {
  [k: string]: any;
}

export interface AltenvConfig {
  defaultEnv: IEnv;
  transformers: { [k: string]: (env: IEnv) => IEnv };
}

export interface IOptions extends IClyCommandOpts {
  print: boolean;
}

// ----

const argv = cliyargs.yargs
  .command('init', 'Create config file')
  .command('use', 'Apply the specified env transformer')
  .help().argv;

const commandInfo: IClyCommandInfo<IOptions> = cliyargs.parseYargv(argv);

cliyargs.processCommand(commandInfo, async (commandName: string) => {
  switch (commandName) {
    case 'init':
      await new InitCommand(commandInfo).run();
      break;
    case 'use':
      await new UseCommand(commandInfo).run();
      break;
    default:
    // No command. Check options
  }
});
