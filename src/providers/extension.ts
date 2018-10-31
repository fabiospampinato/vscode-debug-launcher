
/* IMPORT */

import * as path from 'path';
import Utils from '../utils';

/* EXTENSION */

async function extension ( rootPath = Utils.folder.getActiveRootPath () ) {

  if ( !await Utils.folder.is ( rootPath ) ) return;

  const pkgPath = path.join ( rootPath, 'package.json' ),
        pkg = await Utils.file.readJSON ( pkgPath );

  if ( !pkg || !pkg.displayName || !pkg.activationEvents ) return;

  return {
    provider: 'extension',
    configuration: {
      name: 'Extension',
      type: 'extensionHost',
      request: 'launch',
      args: [`--extensionDevelopmentPath=${rootPath}`],
      cwd: rootPath,
      runtimeExecutable: '${execPath}',
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

export default extension;
