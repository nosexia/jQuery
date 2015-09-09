var Callbacks = $.Callbacks(  );

//如果fn中有参数的情况
function fn1( obj ){
	console.log( obj );				//Object {name: "nose"}
}
//执行函数处理对象的add方法  ，返回值 : Callbacks
Callbacks.add( fn1 );

//触发回调函数fn1   返回值 : Callbacks
Callbacks.fire({ "name" : "nose" })
	
