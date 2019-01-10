
/* IMPORT */

import * as _ from 'lodash';
import * as vscode from 'vscode';
import Utils from './utils';

/* SCRIPT */

const Script = {

  async run ( name, texts = [] ) {

    /* TEXT */

    texts = _.castArray ( texts );

    if ( !texts.length ) return;

    /* SHOW */

    const term = vscode.window.createTerminal ({ name: `Debug Launcher - ${name}`});

    await term.processId;
    await Utils.delay ( 200 );

    term.show ( true );

    /* RUN */

    return new Promise ( async ( res, rej ) => {

      if ( term['onDidWriteData'] ) { // Support for detecting errors

        let textIndex = 0,
            textSendNext = () => term.sendText ( `(${texts[textIndex++]}) && echo 'Command executed successfully' || echo 'An error occurred'` );

        term['onDidWriteData']( data => {

          if ( data.includes ( 'An error occurred' ) && !data.includes ( 'echo' ) ) return rej ();

          if ( data.includes ( 'Command executed successfully' ) && !data.includes ( 'echo' ) ) {

            if ( textIndex < ( texts.length - 1 ) ) return textSendNext ();

            term.dispose ();

            return res ();

          }

        });

        textSendNext ();

      } else { // Fallback in case the API name changes or something

        vscode.window.onDidCloseTerminal ( t => t === term && res () );

        texts.push ( 'exit 0' );

        texts.forEach ( text => term.sendText ( text ) );

      }

    });

  }

};

/* EXPORT */

export default Script;
