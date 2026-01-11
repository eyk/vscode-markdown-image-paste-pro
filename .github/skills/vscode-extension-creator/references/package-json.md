# package.json Extension Specifics

## Required Fields

```json
{
  "name": "extension-name",
  "publisher": "publisher-id",
  "version": "1.0.0",
  "engines": {
    "vscode": "^1.85.0"
  },
  "categories": ["Other"],
  "activationEvents": [],
  "main": "./out/extension.js",
  "contributes": {},
  "scripts": {
    "vscode:prepublish": "npm run compile",
    "compile": "tsc -p ./",
    "watch": "tsc -watch -p ./",
    "lint": "eslint src --ext ts"
  },
  "devDependencies": {
    "@types/vscode": "^1.85.0",
    "@types/node": "18.x",
    "typescript": "^5.3.0"
  }
}
```

## activationEvents

- `onCommand:extension.commandId` - Load when command executed
- `onLanguage:markdown` - Load for specific language
- `onStartupFinished` - Load after startup (better than `*`)
- `*` - Load immediately (avoid)

## contributes

### Commands
```json
"contributes": {
  "commands": [{
    "command": "extension.commandId",
    "title": "Command Title"
  }]
}
```

### Keybindings
```json
"keybindings": [{
  "command": "extension.commandId",
  "key": "ctrl+shift+p",
  "mac": "cmd+shift+p",
  "when": "editorTextFocus"
}]
```

### Configuration
```json
"configuration": {
  "title": "Extension Name",
  "properties": {
    "extension.setting": {
      "type": "string",
      "default": "value",
      "description": "Setting description"
    }
  }
}
```
