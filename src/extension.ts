
/* IMPORT */

import * as vscode from 'vscode';
import UriHandler from './uri_handler';
import Utils from './utils';

/* ACTIVATE */

function activate ( ctx: vscode.ExtensionContext ) {

  new UriHandler ();

  return Utils.initCommands ( ctx );

}

/* EXPORT */

export {activate};
