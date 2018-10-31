
/* IMPORT */

import * as _ from 'lodash';
import * as absolute from 'absolute';
import * as fs from 'fs';
import * as JSON5 from 'json5';
import * as pify from 'pify';
import * as vscode from 'vscode';
import * as Commands from './commands';

/* UTILS */

const Utils = {

  initCommands ( context: vscode.ExtensionContext ) {

    const {commands} = vscode.extensions.getExtension ( 'fabiospampinato.vscode-debug-launcher' ).packageJSON.contributes;

    commands.forEach ( ({ command }) => {

      const commandName = _.last ( command.split ( '.' ) ) as string,
            handler = Commands[commandName],
            disposable = vscode.commands.registerCommand ( command, () => handler () );

      context.subscriptions.push ( disposable );

    });

    return Commands;

  },

  delay ( ms ) {

    return new Promise ( resolve => setTimeout ( resolve, ms ) );

  },

  file: {

    async is ( filePath ) {

      try {

        return ( await pify ( fs.lstat )( filePath ) ).isFile ();

      } catch ( e ) {

        return false;

      }

    },

    async read ( filePath ) {

      try {

        return ( await pify ( fs.readFile )( filePath, { encoding: 'utf8' } ) ).toString ();

      } catch ( e ) {

        return;

      }

    },

    async readJSON ( filePath ) {

      const content = await Utils.file.read ( filePath );

      if ( !content ) return;

      const obj = _.attempt ( JSON5.parse, content );

      if ( _.isError ( obj ) ) return;

      return obj as any;

    },

    getActiveFilePath () {

      const {activeTextEditor} = vscode.window;

      if ( !activeTextEditor ) return;

      return activeTextEditor.document.uri.fsPath;

    }

  },

  folder: {

    async is ( folderPath ) {

      try {

        return ( await pify ( fs.lstat )( folderPath ) ).isDirectory ();

      } catch ( e ) {

        return false;

      }

    },

    getRootPath ( basePath? ) {

      const {workspaceFolders} = vscode.workspace;

      if ( !workspaceFolders ) return;

      const firstRootPath = workspaceFolders[0].uri.fsPath;

      if ( !basePath || !absolute ( basePath ) ) return firstRootPath;

      const rootPaths = workspaceFolders.map ( folder => folder.uri.fsPath ),
            sortedRootPaths = _.sortBy ( rootPaths, [path => path.length] ).reverse () as string[]; // In order to get the closest root

      return sortedRootPaths.find ( rootPath => basePath.startsWith ( rootPath ) );

    },

    getActiveRootPath () {

      const {activeTextEditor} = vscode.window,
            editorPath = activeTextEditor && activeTextEditor.document.uri.fsPath;

      return Utils.folder.getRootPath ( editorPath );

    }

  }

};

/* EXPORT */

export default Utils;
