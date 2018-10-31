# Debug Launcher

<p align="center">
	<img src="https://raw.githubusercontent.com/fabiospampinato/vscode-debug-launcher/master/resources/logo/logo-128x128.png" alt="Logo">
</p>

Start debugging, without having to define any tasks or launch configurations, even from the terminal.

This extension will generate a launch configuration for you, unless you explicitly provide one, via one of its included launch configurations [providers](//TODO).

There's currently built-in support for Node.js projects/files and VSCode extensions. Support for other types of projects/files can be added easily, PRs are welcome.

## Install

Follow the instructions in the [Marketplace](https://marketplace.visualstudio.com/items?itemName=fabiospampinato.vscode-debug-launcher), or run the following in the command palette:

```sh
ext install fabiospampinato.vscode-debug-launcher
```

## Usage

#### Auto

Run the `Debug Launcher: Auto` command to automatically start debugging. The launch configuration will be generated this way:

- If you defined any launch configurations => ask which one to use, unless there's only one
- If your project is a VSCode extension => generate a launch configuration for it
- If your project is a Node.js project and the `bin`/`main` field in `package.json` is set => generate a launch configuration for it
- If your current file is a Node.js file => generate a launch configuration for it

#### File

Run the `Debug Launcher: File` command to automatically start debugging the current file.

#### Terminal

You can also launch VSCode's debugger from the terminal, this extension defines a custom URI handler that looks like this:

`vscode://fabiospampinato.vscode-debug-launcher/<command>?args=<arg1>,<arg2>,<argN>`

You can substitute `<command>` with the name of any command defined by this extension, like `auto`, `file` or `launch`.

You can substitute `<argN>` with an argument to pass to the command. Any JSON-parsable value or string is allowed.

Some examples:

```sh
open 'vscode://fabiospampinato.vscode-debug-launcher/auto?args=/path/to/project' # Trigger `Debug Launcher: Auto` on the provided path
open 'vscode://fabiospampinato.vscode-debug-launcher/file?args=/path/to/foo.js' # Trigger `Debug Launcher: File` on the provided path
open 'vscode://fabiospampinato.vscode-debug-launcher/launch?args={"type":"node","name":"Foo","request":"launch","program":"/path/to/foo.js"}' # Launch the debugger using a custom launch configuration
```

Here there are some helper functions/plugins for launching the debugger from the terminal, they might need some adaptation to your system, especially if you're not on macOS:

<details>
<summary>Shell function</summary>

For your convenience you can add the following function to your shell configuration:

```sh
function debug-launcher () {
  open "vscode://fabiospampinato.vscode-debug-launcher/$1?args=${$(printf %s, ${@:2} )}"
}

```

With it you can now simplify the above commands as:

```sh
debug-launcher launch '{"type":"node","name":"Foo","request":"launch","program":"/path/to/foo.js"}' # Launch the debugger using a custom launch configuration
debug-launcher auto /path/to/project # Trigger `Debug Launcher: Auto` on the provided path
debug-launcher file /path/to/foo.js # Trigger `Debug Launcher: File` on the provided path
```

</details>

<details>
<summary>Zsh plugin</summary>

For even better convenience you can add the following to your `zsh` configuration, with it you can debug almost any Node.js project/file with a <kbd>ESC</kbd> <kbd>ESC</kbd> (double ESC).

If the command is executed inside VSCode's terminal it will use its debugger, otherwise it will automatically attach Chrome's DevTools:

```sh
export DEBUGGER_PORTS=(9222 9229 5858)

function debugger () {
  if [ $TERM_PROGRAM = 'vscode' ]; then
    debugger-inspect "$@"
  else
    ( sleep 1 && debugger-devtools ) & debugger-inspect "$@"
  fi
}

function debugger-inspect () {
  if [[ $1 == .* ]]; then
    local app=$1
    local args=${@:2}
  elif [[ $1 == 'node' ]]; then
    local app=$2
    local args=${@:3}
  else
    local app=`( which $1 || echo $1 ) | tail -n 1 | sed 's/\(.* aliased to \)//' `
    local args=${@:2}
  fi
  local app=`echo $app | sed "s#^~#$HOME#"`
  if [ $TERM_PROGRAM = 'vscode' ]; then
    if [[ $app == .* ]]; then
      local cwd=`pwd -P`
      local app="$cwd/$app"
    fi
    open "vscode://fabiospampinato.vscode-debug-launcher/auto?args=$app,${$(printf %s, $args )}"
  else
    node --inspect-brk $app $args
  fi
}

function debugger-devtools () {
  for port in ${DEBUGGER_PORTS[*]}; do
    local list=`curl -s http://localhost:$port/json/list`
    if [[ ! -z "$list" ]]; then
      local url=`echo $list | jq -r '.[0].devtoolsFrontendUrl'`
      /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome
      osascript -e "tell application \"Google Chrome\" to open location \"$url\""
    fi
  done
}

function plugin-debugger () {
  if [[ $LBUFFER == debugger\ * ]]; then
    LBUFFER=`echo $LBUFFER | cut -d' ' -f2-`
  else
    LBUFFER="debugger $LBUFFER"
  fi
}

zle -N plugin-debugger
bindkey "\e\e" plugin-debugger
```

Now you can use the following commands and toggle the `debugger` prefix with a <kbd>ESC</kbd> <kbd>ESC</kbd> (double ESC):

```sh
debugger foo
debugger ./foo.js
debugger /path/to/foo.js
debugger node /path/to/foo.js
```
</details>

## Settings

Each launch configuration [provider](//TODO) has a name, you can overwrite its configuration and prepartion commands via the settings:

```js
{
  "debugLauncher": {
    "[project.node]": { // Name of the provider wrapped in brackets
      "configuration": { // Configuration settings to override
        "stopOnEntry": true
      },
      "commands": [ // Commands to execute before launching the debugger
        "npm run bundle",
        "./prepare
      ]
    }
  }
}
```

## Demo

#### Auto

![Auto](resources/demo/auto.gif)

#### File

![File](resources/demo/file.gif)

#### Terminal

![Terminal](resources/demo/terminal.gif)

## Hints

- **[StatusBar Debugger](https://marketplace.visualstudio.com/items?itemName=fabiospampinato.vscode-statusbar-debugger)** - this other extension has built-in support for Debug Launcher and allows you to debug with a click. Also it gives you a debugger in the statusbar.

## License

MIT © Fabio Spampinato
