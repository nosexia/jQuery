/**
 * 带有参数 "once"的情况，只会触发一次回调函函数fn1
 * 执行原理 ://执行过add函数把fn函数push到list中     没有执行过fire函数，或者stack为true( 当有once值是，stack的默认值是false )
		fireWith: function( context, args ) {
		//执行过add函数把fn函数push到list中     没有执行过fire函数，或者stack为true( 当有once值是，stack的默认值是false )
		if ( list && ( !fired || stack ) ) {
			args = args || [];
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
*/

//只会调用一次fn1
function fn1( obj ){
	console.log( obj );				//Object {name: "nose"}
}
//执行函数处理对象的add方法  ，返回值 : Callbacks
Callbacks.add( fn1 );

//触发回调函数fn1   返回值 : Callbacks
Callbacks.fire({ "name" : "nose" })



Callbacks.fire({ "age" : "21" })

1.第一次执行  Callbacks.add( fn1 );  					list中有一个  list[ fn ]
2.执行Callbacks.fire({ "name" : "nose" }) 				list 有值， 且fired为undefined
3.第二次执行Callbacks.fire({ "name" : "nose" })			list有值    由于执行过了一次fire()函数之后， fired = true ,且options = { "once" true },所有stack为ture;
只能够执行一次回调函数