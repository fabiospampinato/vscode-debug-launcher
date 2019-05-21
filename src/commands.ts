
/* IMPORT */

import * as _ from 'lodash';
import * as vscode from 'vscode';
import Config from './config';
import Script from './script';
import {custom, extension, launchConfiguration, fileNode, filePython, projectNode, projectPython} from './providers';

/* COMMANDS */

async function providers ( providers: Function[] = [], ...args ) {

  for ( let provider of providers ) {

    const launch = await provider ( ...args );

    if ( launch === false ) return;

    if ( !launch ) continue;

    if ( launch.provider ) {

      const config = Config.get (),
            override = _.get ( config, `[${launch.provider}]` );

      if ( override ) {

        if ( override.configuration ) {

          _.merge ( launch.configuration, override.configuration );

        }

        if ( override.commands ) {

          launch.commands = override.commands;

        }

      }

    }

    if ( launch.commands ) {

      try {

        await Script.run ( launch.provider || provider, launch.commands );

      } catch ( e ) {

        return vscode.window.showErrorMessage ( '[Debug Launcher] An error occurred, check the terminal' );

      }

    }

    if ( launch.command ) return vscode.commands.executeCommand ( launch.command );

    if ( launch.configuration ) {

      vscode.debug.startDebugging ( undefined, launch.configuration );

      return vscode.commands.executeCommand ( 'workbench.debug.action.focusRepl' );

    }

    return vscode.window.showErrorMessage ( `Invalid launch configuration returned from provider "${launch.provider || provider}"` );

  }

  vscode.window.showErrorMessage ( 'Couldn\'t generate a launch configuration' );

}

async function auto ( ...args ) {

  return providers ( [custom, launchConfiguration, extension, projectNode, projectPython, fileNode, filePython], ...args );

}

async function file ( ...args ) {

  return providers ( [fileNode], [filePython], ...args );

}

async function launch ( ...args ) {

  return providers ( [custom], ...args );

}

/* EXPORT */

export {auto, file, launch};
