(function($){
  $.fn.pagination = function(param1, param2) {
    if ($.isPlainObject(param1)) {

      var opts = $.extend({}, $.fn.pagination.defaults, param1);
      this.data('options', opts);
      var element = $(this);
      buildElements(element);
      addEventListeners(element);

    } else if (typeof param1 === "string") {
      switch(param1) {
        case "options": 
          return this.data('options');
          break;
        case "loading":
          break;
        case "loaded":
          break;
        case "refresh":
          break;
        case "select":
          break;
      }
    }

    return this;
  };

  $.fn.pagination.defaults = {
    total: 1,
    pageSize: 10,
    pageNumber: 1,
    loading: false,
    onSelectPage: function(pageNumber, pageSize) {
      debugger;
    }
  };

  function buildElements(element) {
    var opts = element.data('options');
    var pages = Math.ceil(opts.total / opts.pageSize);
    var tplstr = '\
      <div class="pagination">\
        <span class="page_prev"></span>\
        <div class="cur_page"><em>{pageNumber}</em>/<b>{pages}</b></div>\
        <span class="page_next"></span>\
        <input type="text">\
        <button class="go">跳转</button>\
      </div>';
    tplstr = tplstr.replace('{pageNumber}', opts.pageNumber).replace('{pages}', pages);
    element.append($(tplstr));
  }
  
  function addEventListeners(element) {
    element.on('click', 'span.page_prev', function(e) {
      gotoPage(element, 'prev');
      return false;
    });
    element.on('click', 'span.page_next', function(e) {
      gotoPage(element, 'next');
      return false;
    });
    element.on('click', 'button.go', function(e) {
      var newPage = element.find('input').val();
      if ($.isNumeric(newPage)) {
        gotoPage(element, newPage);
      }
      return false;
    });
  }

  function gotoPage(element, newPage) {
    var opts = element.data('options');
    var pageNumber = opts.pageNumber;
    var pages = Math.ceil(opts.total / opts.pageSize);
    var newPageNum;
    if ($.isNumeric(newPage)) {
      newPageNum = parseInt(newPage);
    } else if (newPage === 'prev') {
      newPageNum = pageNumber - 1;
    } else if (newPage === 'next') {
      newPageNum = pageNumber + 1;
    }
    if (newPageNum > 0 && newPageNum <= pages) {
      // Valid new page 
      opts.pageNumber = newPageNum;
      //debugger;
      // refresh UI
      element.find('.cur_page em').text(newPageNum);
      // trigger custom event
      opts.onSelectPage(newPageNum);
    }
  }

}(jQuery));
