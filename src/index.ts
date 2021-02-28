#!/usr/bin/env node
import { conprint } from 'cliyargs/lib/utils';
import { cliyargs, ICommandInfo } from 'cliyargs';
import { InitCommand } from './InitCommand';
import { UseCommand } from './UseCommand';

export const ALTENV_FILENAME = 'altenv.js';

export type TResult = {
  success: boolean;
  error?: Error | string | null;
  data?: any;
};

// ----

const argv = cliyargs.yargs
  .command('init', 'Create config file')
  .command('use', 'Apply the specified env transformer')
  .help().argv;

const commandInfo: ICommandInfo = cliyargs.parseArgv(argv);

cliyargs
  .processCommand(commandInfo, async (commandName) => {
    switch (commandName) {
      case 'init':
        await new InitCommand(commandInfo).run();
        break;
      case 'use':
        await new UseCommand(commandInfo).run();
        break;
      default:
      // No command. Check options
      // Todo - Show altenv version
    }
  })
  .catch((e) => {
    console.error(e);
  });
