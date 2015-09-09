	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	/**
	 * [access description]
	 * @param  {string}   		elems     元素
	 * @param  {Function} 		fn        callback
	 * @param  {string,obj}   	key       key
	 * @param  {string}   		value     [description]
	 * @param  {booleam}   		chainable [description]			//是否是链式操作
	 * @param  {undefined}   	emptyGet  [description]			//没有选择到JQuery对象时，返回的值
	 * @param  {[typ}   raw     [description]					//判断值是否是fn类型
	 * @return {[type]}         [description]
	 */
	access: function(elems, fn, key, value, chainable, emptyGet, raw) {
			var i = 0,
				length = elems.length,
				bulk = key == null;

			//如果key值是一个对象，说明是给对象设置属性值，
			//chainable是true,链式操作	


			//chainable是全局变量
			// Sets many values
			if (jQuery.type(key) === "object") {
				chainable = true;
				for (i in key) {
					jQuery.access(elems, fn, i, key[i], true, emptyGet, raw);
				}

				// Sets one value
				/**
				 * $('#box').attr('customvalue','abc')
				 * $('#box').attr('customvalue',function (value) {});
				 */
				//return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
			else if (value !== undefined) {
					chainable = true;

					//判断value不是一个函数
					if (!jQuery.isFunction(value)) {
						raw = true;
					}
					//key==null
					if (bulk) {
						// Bulk operations run against the entire set
						// raw为true，表示value的不是一个函数
						if (raw) { //(&& value !== undefined  && value不是一个函数)		
							fn.call(elems, value); //fn已经执行完成，jQuery.attr.call(eles,value)		
							fn = null;

							// ...except when executing function values
							//  $('#box').attr(null,function () {})
						} else {
							bulk = fn;
							fn = function(elem, key, value) {
								return bulk.call(jQuery(elem), value); //执行get操作
							};
						}
					}
					//
					if (fn) {
						for (; i < length; i++) {
							fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
						}
					}
				}

				return chainable ?
					elems :

					// Gets
					bulk ?
					fn.call(elems) :
					length ? fn(elems[0], key) : emptyGet;
		},

				
		/**
		 * access方法整理，是对fn函数的一个综合性处理，
		 * key值是==null值时候，value值===undefined时，这时chainable->undefined,bulk->true;执行fn函数,this指向elems，
		 * key的值是null,value的值是string，直接49行fn.call(elems,value),fn=null
		 * key的值是null,value的值是fn,执行一次fn,让fn的的this指向fn,参数是value,   在64行执行fn, fn(elems[i],key,)
		 * key的值是string，value的值是string，bulk为false,执行64fn函数，fn(elems[i],key,value);	
		 * key的值是string,value的值是fn时,bulk为false,执行fn函数64fn(elems[i], key,  value.call(elems[i], i, fn(elems[i], key)) )
		 * 
		 * key值是object，对象的属性设置值，chainable为true,执行access(elems,fn,i,key[i],true,emptyGet,raw)
		 *
		 *
		 * chaiable的值为true,前面执行，当chainable的值为false,执行fn.call(elems)
		 * 总要value有值时，chainable为true,能进行链式操作,直接返回elems
		 * 
		 * chainable没有值时，key也为==null时，直接执行fn.call(elems),
		 * key有值时，执行fn(elems[0],key)
		 */