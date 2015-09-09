jQuery.extend({
	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				// //成功的回调对象中的参数options = { once : true , memory : true } 表明可以连续执行Callbacks.add,不能够执行连续执行Callbacks.add
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				//返回当前的状态
				state: function() {
					return state;
				},
				//执行always函数，不管成功或者失败都会调用always中的函数
				//deferred.done = list.add
				//deferred.fail = list.add
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				// 把promise对象扩展到obj对象上
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		/**
		 * 		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
		 */

		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],				// list = Callbacks （三个不同回调函数对象） 
				stateString = tuple[ 3 ];		
			


			/**
			 * promise[ "done" ] = list.add
			 * promise[ "fail" ] = list.add
			 * promise[ "progress" ] = list.add
			 */
			promise[ tuple[1] ] = list.add;   		

			// Handle state       在done状态，或者fail状态
			/**
			 * console.log( 0 ^ 1  );			//1	
               console.log( 1 ^ 1 ) ;			//0
			 */
			
			

			//给2个回调函数对象添加三个方法 
			//
			// 当 i =0时
			// 
			//   list.add( function(){ state = stateString } , Callbacks.disable ,  Callbacks.lock   )    //把这三个方法填入list数组中

			//
			//  resolve , reject时，  把这三个方法放入到回调函数对象的list数组中
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			/**
			 * deferred[ "resolve" ] = function(){
			 * 		deferred[ "resolve" + "With" ]( this === deferred ? promise : this, arguments );
					return this;
			 * }
			 */
			
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};

			deferred[ "resolveWith" ] = list.fireWith
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		/**
		 * 调用promise对象的promise方法 扩展以下8个方法
		 * deferred[ "done" ]  = list.add
		 * 
		 * deferred[ "fail" ]  = list.add
		 * 
		 * deferred[ "progress" ]  = list.add
		 * 
		 * deferred[ "state" ] = promise[ "state" ]
		 * 
		 * deferred[ "always" ] = promise[ "always" ]
		 * 
		 * deferred[ "then" ] = promise[ "then" ] = promise[ "pipe" ]
		 * 
		 * deferred[ "promise" ] = promise[ "promise" ]		
		 *
		 *
		 *
		 * //以下方法单独绑定在deferred对象上面(类似于fires)
		 * deferred[ "resolve" ] = fn;
		 * 
		 * deferred[ "reject" ] = fn;
		 * 
		 * deferred[ "notify" ] = fn;
		 * 
		 * deferred[ "resolveWith" ] = list.fireWith
		 * 
		 * deferred[ "rejectWith" ] = list.fireWith
		 * 
		 * deferred[ "notifyWith" ] = list.fireWith
		 */
		promise.promise( deferred );

		// Call given func if any  @todo1
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		deferred = {

		}
		return deferred;
	}

	
});

