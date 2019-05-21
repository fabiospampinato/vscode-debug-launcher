
/* IMPORT */

import * as path from 'path';
import Utils from '../../utils';

/* PYTHON */

async function python ( rootPath = Utils.folder.getActiveRootPath (), ...args ) {

  if ( !await Utils.folder.is ( rootPath ) ) return;

  const pkgPath = path.join ( rootPath, 'package.json' ),
        pkg = await Utils.file.readJSON ( pkgPath );

  if ( !pkg || ( !pkg.bin && !pkg.main ) ) return;

  return {
    provider: 'project.python',
    configuration: {
      name: 'Python',
      type: 'python',
      request: 'launch',
      program: path.join ( rootPath, pkg.bin || pkg.main ),
      args,
      cwd: rootPath,
      smartStep: true,
      sourceMaps: true,
      stopOnEntry: false,
      outFiles: [
        path.join ( rootPath, 'dist', '**', '*.js' ),
        path.join ( rootPath, 'out', '**', '*.js' )
      ]
    },
    commands: [
      'npm run compile'
    ]
  };

}

/* EXPORT */

export default python;
