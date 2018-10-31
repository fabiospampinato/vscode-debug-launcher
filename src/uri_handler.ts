
/* IMPORT */

import * as _ from 'lodash';
import * as path from 'path';
import * as querystring from 'querystring';
import * as vscode from 'vscode';
import * as Commands from './commands';
import Utils from './utils';

/* URI HANDLER */

class DebugLauncherUriHandler implements vscode.UriHandler {

	private disposables: vscode.Disposable[] = [];

	constructor () {

    this.disposables.push ( vscode.window.registerUriHandler ( this ) );

	}

	dispose () {

    this.disposables.forEach ( disposable => disposable.dispose () );

    this.disposables = [];

	}

	handleUri ( uri: vscode.Uri ) {

    const command = _.trim ( uri.path, '/' );

    if ( !command ) return vscode.window.showErrorMessage ( 'You need to provide a command' );

    if ( !Commands[command] ) return vscode.window.showErrorMessage ( `No command named "${command}" found` );

    const plainArgs = _.trim ( querystring.parse ( uri.query ).args || '', ',' );

    let args = [_.attempt ( JSON.parse, plainArgs )];

    if ( !_.isPlainObject ( args[0] ) ) {

      args = _.filter ( plainArgs.split ( ',' ).map ( ( plainArg, index ) => {

        try {

          return JSON.parse ( plainArg );

        } catch ( e ) {

          return plainArg;

        }

      }));

    }

    return Commands[command]( ...args );

	}

}

/* EXPORT */

export default DebugLauncherUriHandler;
