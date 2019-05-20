
/* IMPORT */

import Utils from '../../utils';

/* NODE */

async function node ( filePath = Utils.file.getActiveFilePath (), ...args ) {

  if ( !await Utils.file.is ( filePath ) ) return;

  if ( /\.py$/.test ( filePath ) ) {

    return {
      provider: 'file.python',
      configuration: {
        name: 'Python',
        type: 'python',
        request: 'launch',
        program: filePath,
        args,
        smartStep: true,
        sourceMaps: true,
        stopOnEntry: false
      }
    };
  }

  if ( /\.js$/.test ( filePath ) ) {

    return {
      provider: 'file.node',
      configuration: {
        name: 'Node',
        type: 'node',
        request: 'launch',
        program: filePath,
        args,
        smartStep: true,
        sourceMaps: true,
        stopOnEntry: false
      }
    };
  }

}

/* EXPORT */

export default node;
