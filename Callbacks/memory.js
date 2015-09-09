var Callbacks = $.Callbacks( "memory" );
		
		
function fn1( obj ){
	console.log( obj );				//Object {name: "nose"}
}

//第一次执行add函数
Callbacks.add( fn1 );


Callbacks.fire({ "name" : "nose" })

Callbacks.add( fn1 );			//再次执行fire函数



概要  执行memory的过程
第一步是执行第一个add(fn1),此时没有执行fire ,所有此时的memory为undefined
执行CallBacks.fire ->  函数中arguments[0] -> { "name" : "nose" };
CallBacks.fireWith  ->  args = [ Callbacks , arguments  ] ;
fire( args );  调用真正的回调函数    list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse






add: function() {
	if ( list ) {
		// First, we save the current length
		var start = list.length;
		(function add( args ) {
			//args为[fn1]
			jQuery.each( args, function( _, arg ) {
				var type = jQuery.type( arg );
				if ( type === "function" ) {
					if ( !options.unique || !self.has( arg ) ) {
						//把arg参数push到list数组中
						list.push( arg );
					}
				} else if ( arg && arg.length && type !== "string" ) {
					// Inspect recursively
					add( arg );
				}
			});
		})( arguments );
		// Do we need to add the callbacks to the
		// current firing batch?
		if ( firing ) {
			firingLength = list.length;
		// With memory, if we're not firing then
		// we should call right away
		// 
		//1.只有执行add没有执行fire之前memory的值为undefined
		} else if ( memory ) {
			firingStart = start;			//firingStart = list.length =1  只执行此次add中的回调函数
			fire( memory );				
		}
	}
	return this;
},







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
		stack = !options.once && [],			//带有once参数是，stack为false
		// data = [context , ""]
		fire = function( data ) {
			//当options.memory有值时，data为
			data = [
				Callbacks , [ { "name" : nose } ]
			] 
			memory = options.memory && data;			//memory = undefined
			fired = true;
			//当有参数memory时,  firingIndex = firingStart = list.length 
			firingIndex = firingStart || 0;				//firingIndex = firingStart = 1
			firingStart = 0;							//重置firingStart = 0
			firingLength = list.length;					//firingLength = 2
			firing = true;								//回调函数没执行之前firing为true
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				//函数的返回值是false么，   然后options对象的属性stopOnFalse为true
				//list[ firingIndex ].apply( data[ 0 ], data[ 1 ] )  真正调用回调函数的地方
				//回调函数this指向data[ 0 ]也就是Callbacks ，data[1] 函数中的第二个参数
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					//@todo
					memory = false; // To prevent further calls using add
					break;
				}
			}
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


