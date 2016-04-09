# rollup-plugin-mockr [![Build Status](https://travis-ci.org/Comandeer/rollup-plugin-mockr.svg?branch=master)](https://travis-ci.org/Comandeer/rollup-plugin-mockr) [![Dependency Status](https://david-dm.org/Comandeer/rollup-plugin-mockr.svg)](https://david-dm.org/Comandeer/rollup-plugin-mockr) [![devDependency Status](https://david-dm.org/Comandeer/rollup-plugin-mockr/dev-status.svg)](https://david-dm.org/Comandeer/rollup-plugin-mockr#info=devDependencies)

Allows mocking ES6 modules for tests. Heavily inspired by [rollup-plugin-alias](https://github.com/frostney/rollup-plugin-alias).

## Installation

```bash
npm install rollup-plugin-mockr [--save-dev]
```

## Usage

```javascript
import { rollup } from 'rollup';
import mockr from 'rollup-plugin-mockr';

rollup( {
	entry: './src/index.js',
	plugins: [
		mockr( {
			'./src/index.js': {
				exampleLib: 'path/to/localMock'
			}
		} )
	]
} );
```

You can also specify file extension for ES6 modules:

```javascript
rollup( {
	entry: './src/index.js',
	plugins: [
		mockr( {
			modules: {
				'./src/index.js': {
					exampleLib: 'path/to/localMock'
				}
			},
			fileExtension: 'jsm'
		} )
	]
} );
```

You can also specify more than one entry point (added with [karma-rollup-preprocessor](https://github.com/showpad/karma-rollup-preprocessor) in mind; unfortunately it doesn't work with [rollup-plugin-multi-entry](https://github.com/eventualbuddha/rollup-plugin-multi-entry)… yet).

```javascript
rollup( {
	entry: './src/index.js',
	plugins: [
		mockr( {
			'./src/index.js': {
				exampleLib: 'path/to/localMock'
			},
			'./src/index2.js': {
				someOtherLib: 'path/to/localMock2'
			}
		} )
	]
} );
```

## License

See [LICENSE](./LICENSE) file for details.
