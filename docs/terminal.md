
## Terminal

Some helper functions/plugins for launching the debugger from the terminal.

They will need some adaptation to your system, especially if you're not on macOS.

### Shell Function

For your convenience you can add the following function to your shell configuration:

```sh
function debug-launcher () {
  open "vscode://fabiospampinato.vscode-debug-launcher/$1?args=${$(printf %s, ${@:2} )}"
}

```

With it you can now do this:

```sh
debug-launcher launch '{"type":"node","name":"Foo","request":"launch","program":"/path/to/foo.js"}' # Launch the debugger using a custom launch configuration
debug-launcher auto /path/to/project # Trigger `Debug Launcher: Auto` on the provided path
debug-launcher file /path/to/foo.js # Trigger `Debug Launcher: File` on the provided path
```

### `Zsh` Plugin

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
