
/* IMPORT */

import * as _ from 'lodash';
import * as vscode from 'vscode';
import Utils from './utils';

/* SCRIPT */

const Script = {

  async run ( name, texts = [] ) {

    texts = _.castArray ( texts );

    if ( !texts.length ) return;

    const term = vscode.window.createTerminal ({ name: `Debug Launcher - ${name}`});

    await term.processId;
    await Utils.delay ( 150 );

    return new Promise ( async resolve => {

      vscode.window.onDidCloseTerminal ( t => t === term && resolve () );

      term.show ( true );

      texts.push ( 'exit 0' );

      texts.forEach ( text => term.sendText ( text ) );

    });

  }

};

/* EXPORT */

export default Script;
