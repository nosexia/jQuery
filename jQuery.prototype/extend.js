/**
 * 解析extend方法
 * 
 */

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	// 判断第一个参数是否是boolean值
	// 如果是boolean值那么，重新对参数进行赋值
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	// 如果target即不是一个对象 ，也不是函数
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	// 只有一个目标元素被传递，
	// 直接return target对象
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base 
			// 
			//  options为参数对象   
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				// 后面的参数对象里面的属性，是对象或者数组的情况
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					//当是数组的情况
					if ( copyIsArray ) {
						copyIsArray = false;
						//目标元素属性值是数组，clone赋值为目标元素属性， 否则为赋值为空对象
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						//目标元素属性为对象字面量 ，clone赋值为目标元素属性 ， 否则赋值为空对象
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					//copy为数组或者对象字面量  ，再次调用extend方法，返回值是return target对象
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					//通过深拷贝执行 ,此时的target为参数clone
					//而参数clone为src或者是空数组
					//为src的情况  src为最开始的target对象中name属性值
					//形成了作用链为
					//[target1][name] = [target2];			//此时的target2是一个对象
					//[copy1][name] = [copy2]
					//[target2][name] =  [copy2][name]
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};


//所有的深拷贝都是转为浅拷贝来我完成
//
//
//
//
//
//
//
//
//
//
//
//
//
//example
//
//浅拷贝的情况

//extend中只有一个参数的时候
//在jQuery类上面设置name1属性，值为nose
//返回值是jQuery类
var obj = { "name1" :  "nose"  };

$.extend( obj ) ;			//jQuery对应的方法





//extend中有两个参数的情况
//第一个参数后面的所有对象扩展到第一个对象中
var obj1 = { "name1" : "nose" };

var obj2 = { "age" : 23 };

var obj3 = { "sex" : "nan" }

obj3 = $.extend( obj1 , obj2 , obj3 );

//console.log( obj3 )				//{name1: "nose", age: 23, sex: "nan"}




//深拷贝的情况

var obj1 = { list : { "name" : "nose" } };
var obj2 = { list1 : { "age" : 23 } };

obj1 = $.extend( true , obj1 , obj2 );
console.log( obj1 )        //{ list : { "name" : "nose" } , list1 : { "age" : 23 }  }  

