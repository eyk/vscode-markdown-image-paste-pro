# Testing Setup

## @vscode/test-electron

### runTest.ts
```typescript
import { runTests } from '@vscode/test-electron';
import * as path from 'path';

async function main() {
  const extensionDevelopmentPath = path.resolve(__dirname, '../../');
  const extensionTestsPath = path.resolve(__dirname, './suite/index');

  await runTests({ extensionDevelopmentPath, extensionTestsPath });
}

main();
```

### suite/index.ts
```typescript
import * as path from 'path';
import Mocha from 'mocha';
import { glob } from 'glob';

export function run(): Promise<void> {
  const mocha = new Mocha({ ui: 'tdd', color: true });
  const testsRoot = path.resolve(__dirname, '..');

  return new Promise((resolve, reject) => {
    glob('**/**.test.js', { cwd: testsRoot }).then(files => {
      files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));
      mocha.run(failures => failures > 0 ? reject(new Error(`${failures} tests failed.`)) : resolve());
    }).catch(reject);
  });
}
```

## GitHub Actions CI

```yaml
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node-version: [18.x, 20.x]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm test
        if: runner.os != 'Linux'
      - run: xvfb-run -a npm test
        if: runner.os == 'Linux'
```

**Critical**: Linux needs `xvfb-run -a` for GUI tests
