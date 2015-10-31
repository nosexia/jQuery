require([
    'jquery'
],function($){
    //还原之前$为全局变量
    $.noConflict();
});

//实现原理
//_$ = window.$    如果再次调用jQuery库，那么_$指向之前jQuery对象，window.$
    /*noConflict: function( deep ) {
        if ( window.$ === jQuery ) {
            window.$ = _$;
        }

        if ( deep && window.jQuery === jQuery ) {
            window.jQuery = _jQuery;
        }

        return jQuery;
    },*/

/*if ( typeof window === "object" && typeof window.document === "object" ) {
    window.jQuery = window.$ = jQuery;
} */   

//执行jquery最后，window.jQuery = window.$ = jQuery; 
//调用noConflict方法，window.$ = _$, 全局$指向之前jQuery对象