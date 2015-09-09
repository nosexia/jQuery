//one的实现方式
/*one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},*/
//on的判断的方式，尽量存在回调函数
on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	type = {
		types : fn
	}
	if ( typeof types === "object" ) {
		// ( types-Object, selector, data )
		//参数(  { "click" : "li" } , { "name" : "nose" } );
		//(  { "click" : "li" } ,null { "name" : "nose" } );
		if ( typeof selector !== "string" ) {
			// ( types-Object, data )
			data = data || selector;	
			selector = undefined;
		}
		//参数( { "click" : fn } , selector , data  )
		for ( type in types ) {
			this.on( type, selector, data, types[ type ], one );
		}
		return this;
	}

	// data和fn都是true的情况 
	// fn = selector
	// 参数( "click" , fn1 , null ,null  )  //没有委托的情况
	if ( data == null && fn == null ) {
		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	//	
	} else if ( fn == null ) {
		//当selector的类型是string
		//fn = data
		//参数( "click" , "li" , fn , null)			//平时写的最多的就是这种情况
		if ( typeof selector === "string" ) {
			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {
			// ( types, data, fn )
			//当selector的类型不为string , 为对象字面量
			//fn = data
			//data = selector
			//参数( "click" , { "name" : "nose" } , fn , null  )			//没有委托，存在数据绑定和回调
			fn = data;		
			data = selector;
			selector = undefined;
		}
	}
	
	//参数( "click" , "li" , { "name" : "nose" } , false  )
	//( "click" , "li" , { "name" : "nose" } , null  )
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return this;
	}

	//当是one调用时，
	if ( one === 1 ) {
		//origFn函数指向fn
		origFn = fn;
		//给fn函数重新指向地址  ->当调用fn时，解绑event,并且执行origFn.apply( this, arguments  )
		fn = function( event ) {
			// Can use an empty set, since event contains the info
			jQuery().off( event );			//事件解绑，jQuery的实例调用原型方法off
			return origFn.apply( this, arguments );
		};
		//origFn指向fn，第一次没有guid属性，则执行 fn.guid = origFn.guid = jQuery.guid++;
		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return this.each( function() {
		//循环调用jQuery.event.add
		jQuery.event.add( this, types, fn, data, selector );
	});
},