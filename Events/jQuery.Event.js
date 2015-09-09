/***创建事件对象原型***/
/**
 * 给原始事件对象添加三个属性
 * this.type = src
 * this.timeStamp = jQuery.now();
 * this[ jQuery.expando ] = true;
 */
jQuery.Event = function( src, props ) {
     // Allow instantiation without the 'new' keyword
     /**
     * 暂时没有发现他的用处 
     */
     if ( !(this instanceof jQuery.Event) ) {
          return new jQuery.Event( src, props );
     }

     // Event object
     if ( src && src.type ) {
          /**
          * new jQuery.Event.originalEvent=originalEvent
          */
          this.originalEvent = src;
          /**
          * jQuery.Event实例添加type属性，并且赋值为src.type(keypress,mouseover)
          */
          this.type = src.type;

          // Events bubbling up the document may have been marked as prevented
          // by a handler lower down the tree; reflect the correct value.
          this.isDefaultPrevented = ( src.defaultPrevented ||
               src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

     // Event type
     } else {
          this.type = src;
     }

     // Put explicitly provided properties onto the event object
     if ( props ) {
          jQuery.extend( this, props );
     }

     // Create a timestamp if incoming event doesn't have one
     this.timeStamp = src && src.timeStamp || jQuery.now();

     // Mark it as fixed   //标记jQuery.Event实例化完成，完成了fix处理
     this[ jQuery.expando ] = true;
};