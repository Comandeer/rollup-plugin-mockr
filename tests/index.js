'use strict';

const chai = require( 'chai' );
const expect = chai.expect;
const rollup = require( 'rollup' );
const mockr = require( '../dist/rollup-plugin-mockr' );
const cwd = process.cwd();

describe( 'mockr', () => {
	it( 'is a function', () => {
		expect( mockr ).to.a( 'function' );
	} );

	it( 'changes paths to specified modules to point at the mocked ones', () => {
		return rollup.rollup( {
			entry: './tests/support/index.js',

			plugins: [
				mockr( {
					'./tests/support/index.js': {
						'test1': 'mock1.js',
						'./test2': 'mock2'
					}
				} )
			]
		} ).then( ( stats ) => {
			const modules = stats.modules;

			expect( modules[ 0 ].id ).to.equal( `${cwd}/tests/support/mock1.js` );
			expect( modules[ 1 ].id ).to.equal( `${cwd}/tests/support/mock2.js` );
		} );
	} );

	it( 'allows to specify custom file extension', () => {
		return rollup.rollup( {
			entry: './tests/support/index.js',

			plugins: [
				mockr( {
					modules: {
						'./tests/support/index.js': {
							'test1': 'mock1.js',
							'./test2': 'mockExt'
						}
					},
					fileExtension: 'jsm'
				} )
			]
		} ).then( ( stats ) => {
			const modules = stats.modules;

			expect( modules[ 0 ].id ).to.equal( `${cwd}/tests/support/mock1.js` );
			expect( modules[ 1 ].id ).to.equal( `${cwd}/tests/support/mockExt.jsm` );
		} );
	} );

	it( 'supports mocking nested dependencies', () => {
		return rollup.rollup( {
			entry: './tests/support/nested.js',

			plugins: [
				mockr( {
					'./tests/support/nested.js': {
						'test1': 'mock1.js',
						'./test2': 'mock2'
					}
				} )
			]
		} ).then( ( stats ) => {
			const modules = stats.modules;

			expect( modules[ 0 ].id ).to.equal( `${cwd}/tests/support/mock1.js` );
			expect( modules[ 1 ].id ).to.equal( `${cwd}/tests/support/mock2.js` );
		} );
	} );

	it( 'supports multiple entry points', () => {
		const conf = {
			'./tests/support/multi1.js': {
				'test1': 'mock1.js'
			},
			'./tests/support/multi2.js': {
				'./test2': 'mock2'
			}
		};

		return Promise.all( [
			rollup.rollup( {
				entry: './tests/support/multi1.js',

				plugins: [
					mockr( conf ),
				]
			} ),

			rollup.rollup( {
				entry: './tests/support/multi2.js',

				plugins: [
					mockr( conf )
				]
			} )
		] ).then( ( stats ) => {
			const multi1Modules = stats[ 0 ].modules;
			const multi2Modules = stats[ 1 ].modules;

			expect( multi1Modules.length ).to.equal( 3 );
			expect( multi1Modules[ 0 ].id ).to.equal( `${cwd}/tests/support/mock1.js` );
			expect( multi1Modules[ 1 ].id ).to.equal( `${cwd}/tests/support/test2.js` );

			expect( multi2Modules.length ).to.equal( 2 );
			expect( multi2Modules[ 0 ].id ).to.equal( `${cwd}/tests/support/mock2.js` );
		} );
	} );
} );
