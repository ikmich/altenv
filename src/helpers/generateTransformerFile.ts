import { Fs } from '../deps';
import { fileUtil } from '../util/file-util';
import { _fn } from '../util';
import { TResult } from '../index';

export function generateTransformerFile(envInit?: { [k: string]: any }): TResult {
  let result: TResult = {
    error: null,
    success: false
  };

  try {
    let filepath = fileUtil.getAltenvFilepath();

    const defaultEnvStr = _fn(() => {
      if (envInit) {
        return JSON.stringify(envInit, null, 2);
      }
      return '{}';
    });

    let contents = `module.exports = {
  defaultEnv: ${defaultEnvStr},
  
  /**
   * Defines functions corresponding to each target environment for which environment variables should be set. The
   * existing/default environment variables will be passed as an object argument to each transformer function to be 
   * edited or extended as desired. The transformer function returns an object representing the updated environment 
   * variables that will be used to generate a new '.env' file.
   *
   * It is recommended to name the transformer functions according to the target environment (mainly for readability 
   * and context), but it is up to the developer to decide how the functions are named. The important thing to note is 
   * that the name of the function should be the same as the argument passed to the \`altenv\` command. 
   * E.g \`altenv staging\` will execute the transformer function named 'staging'.
   */
  transformers: {
    default: function(env) {
      return env ? env : {}
    },
    
    development: function(env) {
      return {
        ...env,
        // Update vars as desired for development environment
      }
    },
    
    staging: function(env) {
      return {
        ...env,
        // Update vars as desired for staging environment
      }
    },
    
    production: function(env) {
      return {
        ...env,
        // Update vars as desired for production environment
      }
    },
    
    /*
     Add other transformer targets as needed.
     */
  }
};`;
    Fs.writeFileSync(filepath, contents);
    result.success = true;
  } catch (e) {
    console.error(`[Error creating transformer] ${e.message}`);
    result.error = e;
  }

  return result;
}
