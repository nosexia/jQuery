// arg is for internal usage only
map: function( elems, callback, arg ) {
	var value,
		i = 0,
		length = elems.length,
		isArray = isArraylike( elems ),
		ret = [];

	// Go through the array, translating each of the items to their
	/**
	 * isArray判断elems是否是数组或者类数组
	 */
	if ( isArray ) {
		for ( ; i < length; i++ ) {
			/**
			 * 如果是类数组，调用callback函数,返回值赋值到value上
			 */
			value = callback( elems[ i ], i, arg );
			//判断返回值是否为null,undefined
			if ( value != null ) {
				//存值到ret中
				ret[ ret.length ] = value;
			}
		}

	// Go through every key on the object,
	} else {
		//和上面操作一样，只是是进行for in循环
		for ( i in elems ) {
			value = callback( elems[ i ], i, arg );

			if ( value != null ) {
				ret[ ret.length ] = value;
			}
		}
	}

	// Flatten any nested arrays
	return core_concat.apply( [], ret );
}

