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

		test ,
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],			//带有once参数是，stack为false
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			test = "xxx";
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				//options中有stopOnFalse选项，回调函数的值返回false ,不再执行回调函数
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
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
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						//args为[fn1]
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								//判断是否有unique参数  ，如果有判断函数是否在self函数列表中，如有都成立，不执行push操作
								if ( !options.unique || !self.has( arg ) ) {
									//把arg参数push到list数组中
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );			//arguments[0]  -->指向传入的第一个参数所以arguments是一个类数组
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					// 
					//只是执行add没有执行fire之前memory的值为undefined
					} else if ( memory ) {
						firingStart = start;			//firingStart = list.length =1
						fire( memory );				
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			// 如果有fn是否有值，如果有值判断是否在回调函数列表中
			// 如果fn无值      判断回调函数对象是否绑定了函数
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			// 清空回调函数列表
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore、
			// list = undefined      执行不了回调函数
			// stack =  undefined    @todo
			// memory = undefined	 禁止有"memory"参数，调用add函数的情况		  
			disable: function() {

				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?   
			// 是否已经执行过了disable函数
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			// 
			lock: function() {
				stack = undefined;			
				//memory没值时  list = stack = memory = undefined
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				//执行过add函数把fn函数push到list中     没有执行过fire函数，或者stack为true( 当有once值是，stack的默认值是false )
				if ( list && ( !fired || stack ) ) {
					// args布尔值为false时 
					args = args || [];
					// args = [ context , [] ]      	args为[]      
					// args = [ context , args ]		args的布尔值为true				
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						//执行fire( args )  
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				//this指向函数处理对象
				//arguments的第0项指向传入的对象  ->arguments[0] ->{ "name" : "nose" }
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};
	//return self 对象  self对象
	//self 就是一个函数处理对象，上面有这个多个方法
	self = {
		add 	: fn
		remove  : fn
		has   	: fn
		empty   : fn
		disable : fn
		disabled : fn
		lock    : fn
		locked  : fn
		fireWith ：fn
		fire    :  fn
		fired   :  fn
	}	
	return self;
};