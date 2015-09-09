jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	// 当options为"once"字符串时    options = ｛ "once" :true ｝
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,					//fired参数的作用，回调函数是否已经执行过一次
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],			//带有once参数时, stack=false , 否则stack为[]
		// data = [context , ""]
		fire = function( data ) {
			memory = options.memory && data;			//memory = undefined
			fired = true;
			//当有参数memory时,  firingIndex = firingStart = list.length 
			firingIndex = firingStart || 0;				//firingIndex = 0
			firingStart = 0;							//firingStart = 0
			firingLength = list.length;					//firingLength = 1
			firing = true;								//回调函数没执行之前firing为true
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				//函数的返回值是false么，   然后options对象的属性stopOnFalse为true
				//list[ firingIndex ].apply( data[ 0 ], data[ 1 ] )  真正调用回调函数的地方
				//回调函数this指向data[ 0 ]也就是Callbacks ，data[1] 函数中的第二个参数
				//判断回调函数的返回值是否为false,且options中有stopOnFalse属性 条件都成立 ，那么memory = false 
				//
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					//@todo
					memory = false; // To prevent further calls using add
					break;
				}
			}



			/**
			 *没有带"once"操作符时，stack = []  
			 *
			 * 
			 * memory = false
			 * 执行 self.disable -> list = stack = memory = undefined; 
			 *  
			*/
			firing = false;					//回调函数已经完成fire为false
			if ( list ) {	
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},

};


/**
 * 总结，什么操作符都没有时，stack.length == 0，不进行任何的操作
 * 当没有once操作符， stack.length暂时不清楚，啥时候会有值
 * 当有"once"操作符时，而没有memory操作符， 执行self.disable   ---> list = stack = memory = undefined   ( 表明清空list ，必须执行self.add()  --->self.fire()才能够执行回调函数 )
 * 当有"once" 也有menory时 ，只是清空了list 后面需要执行回调函数，必须执行self.add()函数
 */