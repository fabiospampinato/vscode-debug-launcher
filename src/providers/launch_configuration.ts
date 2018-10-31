
/* IMPORT */

import * as _ from 'lodash';
import * as path from 'path';
import * as vscode from 'vscode';
import Utils from '../utils';

/* LAUNCH CONFIGURATION */

async function launchConfiguration ( rootPath = Utils.folder.getActiveRootPath () ) {

  if ( !await Utils.folder.is ( rootPath ) ) return;

  const launchPath = path.join ( rootPath, '.vscode', 'launch.json' ),
        launch = await Utils.file.readJSON ( launchPath );

  if ( !launch || !launch.configurations || !launch.configurations.length ) return;

  const {configurations, compounds} = launch,
        configs = _.filter ( _.flatten ( [_.castArray ( configurations ), _.castArray ( compounds )] ) ),
        names = configs.map ( config => config.name );

  if ( !names.length ) return;

  return {
    provider: 'launch-configuration',
    command: ( names.length === 1 ) ? 'workbench.action.debug.start' : 'workbench.action.debug.selectandstart'
  };

}

/* EXPORT */

export default launchConfiguration;
