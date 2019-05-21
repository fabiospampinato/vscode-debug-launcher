
/* IMPORT */

import Utils from '../../utils';

/* PYTHON */

async function python ( filePath = Utils.file.getActiveFilePath (), ...args ) {

  if ( !await Utils.file.is ( filePath ) ) return;

  if ( !/\.py$/.test ( filePath ) ) return;

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

/* EXPORT */

export default python;
