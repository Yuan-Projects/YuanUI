(function($){
  $.fn.dialog = function(param1) {
    // Init dialog
    initDialog();
    var element = this;
    element.hide();
    if ($.isPlainObject(param1)) {
      var opts = $.extend({}, $.fn.dialog.defaults, param1);
      if (this.data('options')) return ;
      
      this.data('options', opts);
      buildElements(element);
      opts.onaftershow && opts.onaftershow($('#yuanui-dialog'));
    } else if (typeof param1 === "string") {
      switch(param1) {
        case "dialog": 
          
          break;
        case "refresh":
          refreshUI(element);
          break;
        case "close":
          closeDialog();
          break;
      }
    }

    return this;
  };

  $.fn.dialog.defaults = {
    title: 'New Dialog',
    resizable: false,
    buttons: null,
    width: 520,
    customCls: '',
    onaftershow: function() {}
  };

  function buildElements(element) {
    var opts = element.data('options');
    var tplstr = '\
      <div class="pop_wrapper">\
        <div class="pop_outer">\
          <div class="pop_main {customCls}" style="width:{width};">\
            <div class="pop_title">{title}<b class="btn_close"></b></div>\
            <div class="pop_con">{main_content}</div>\
          </div>\
        </div>\
      </div>';
    tplstr = tplstr.replace('{customCls}', opts.customCls).replace('{title}', opts.title).replace('{width}', opts.width + 'px').replace('{main_content}', element.html());
    $('#yuanui-dialog').eq(0).empty().append($(tplstr));
  }
  
  function initDialog() {
    if (document.querySelectorAll('#yuanui-dialog').length === 0) {
      $(document.body).append('<div id="yuanui-dialog"></div>');
      addEventListeners();
    }
  }

  function refreshUI(element, options) {
    var opts = element.data('options');
  }
  
  function addEventListeners() {
    $('#yuanui-dialog').on('click', '.pop_title .btn_close', function() {
      closeDialog();
      return false;
    });
  }

  function closeDialog() {
    $('#yuanui-dialog').off().empty();
  }

}(jQuery));