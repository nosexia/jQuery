//分析serializeObject方法，  设置所有的表单元素中的name的属性名和name的属性值为一个对象
//

serializeObject : function(){
	var o = {};
	/**
	 * serializeArray,可以把表单中的项分成n个对象
	 *  obj = {
	 *  	name : "start_date",
	 *  	value: "2015/05/01"
	 *  }
	 *
	 * obj = {
	 * 		name: "end_date",
	 * 		value: "2015/05/09"
	 * }
	 *
	 * obj = {
	 * 		name : "code"
	 * 		value: "1"
	 * }
	 *
	 */
	var a = this.serializeArray();
	$.each(a, function() {
		//某个属性在对象o中已经存在的情况下
		if (o[this.name]) {
			//某个属性存在，但属性在this中对应的值不是array的时候
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			//当是数据复选框的情况，push如o[this.name]
			o[this.name].push(this.value || '');
		} else {
			//直接赋值到o[ this.name ]
			o[this.name] = this.value || '';
		}
	});
	return o;
},




