'use strict';

const path = require( 'path' );

export default function mockr( options = {} ) {
	const modules = options.modules || options;
	const entries = Object.keys( modules );
	const fileExtension = `.${options.fileExtension || 'js'}`;
	let currentEntry;

	return {
		resolveId( toImport, importer ) {
			if ( !importer ) {
				currentEntry = toImport;
				return;
			}

			if ( entries.indexOf( currentEntry ) === -1 ) {
				return;
			}

			const mock = Object.keys( modules[ currentEntry ] ).filter( ( moduleId ) => {
				return toImport.indexOf( moduleId ) === 0;
			} )[ 0 ];

			if ( !mock ) {
				return;
			}

			const mocked = toImport.replace( mock, modules[ currentEntry ][ mock ] );

			if ( mocked.indexOf( './' ) === 0 || mocked.match( /^\w/ ) ) {
				const importerDir = path.parse( importer ).dir;

				return `${path.resolve( importerDir, mocked )}${path.extname( mocked ) ? '' : fileExtension}`;
			}
		}
	};
}
