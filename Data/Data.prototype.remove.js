remove: function( owner, key ) {
	var i, name, camel,
		unlock = this.key( owner ),
		cache = this.cache[ unlock ];

	if ( key === undefined ) {
		this.cache[ unlock ] = {};

	} else {
		// Support array or space separated string of keys
		if ( jQuery.isArray( key ) ) {
			// If "name" is an array of keys...
			// When data is initially created, via ("key", "val") signature,
			// keys will be converted to camelCase.
			// Since there is no way to tell _how_ a key was added, remove
			// both plain key and camelCase key. #12786
			// This will only penalize the array argument path.
			name = key.concat( key.map( jQuery.camelCase ) );
		} else {
			camel = jQuery.camelCase( key );
			// Try the string as a key before any manipulation
			if ( key in cache ) {
				name = [ key, camel ];
			} else {
				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				name = camel;
				name = name in cache ?
					[ name ] : ( name.match( core_rnotwhite ) || [] );
			}
		}

		i = name.length;
		while ( i-- ) {
			delete cache[ name[ i ] ];
		}
	}
},