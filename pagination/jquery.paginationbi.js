(function($){
  $.fn.pagination = function(param1, param2) {
    var element = this;
    if ($.isPlainObject(param1)) {
      if (this.data('options')) return ;
      var opts = $.extend({}, $.fn.pagination.defaults, param1);
      this.data('options', opts);
      buildElements(element);
      addEventListeners(element);

    } else if (typeof param1 === "string") {
      switch(param1) {
        case "options": 
          return element.data('options');
          break;
        case "loading":
          break;
        case "loaded":
          break;
        case "refresh":
          refreshUI(element, param2);
          break;
        case "select":
          if ($.isNumeric(param2)) {
            gotoPage(element, param2);
          } else {
            refreshUI(element);
          }
          break;
      }
    }

    return this;
  };

  $.fn.pagination.defaults = {
    total: 1,
    pageList: [10, 20, 30, 50],
    pageSize: 10,
    pageNumber: 1,
    loading: false,
    onChangePageSize: function(pageSize) {
    },
    onSelectPage: function(pageNumber, pageSize) {
    }
  };

  function buildElements(element) {
    var opts = element.data('options');
    var pages = Math.ceil(opts.total / opts.pageSize);
    var tplstr = '<div class="page_wrap">\
                      <div class="num_wrap">\
                          <span>共<em>{total}</em>条记录，显示行数</span>\
                          <select name="" id="">\{pageList}</select>\
                          <span>页</span>\
                      </div>\
                      <ul>\
                          <li class="page_prev border disable"><a href="#"></a></li>\
                          <li class="page_next border"><a href="#"></a></li>\
                          <li class="text t1">转到</li>\
                          <li class="page_input"><input type="text" name="page_num"></li>\
                          <li class="text">页</li>\
                          <li class="page_go"><button>go</button></li>\
                      </ul>\
                  </div>';
    var pageListDomStr = opts.pageList.map(function(v) {
      return '<option value="'+v+'">'+v+'</option>';
    });
    tplstr = tplstr.replace('{total}', opts.total).replace('{pageList}', pageListDomStr).replace('{pageNumber}', opts.pageNumber).replace('{pages}', pages);
    element.append($(tplstr));
    
    buildPageNumberElements(element);
    
    // Select the default page size
    element.find('option[value="' + opts.pageSize + '"]').prop('selected', true);
    
    updatePageBtnsStyle(element);
  }
  
  function buildPageNumberElements(element) {
    var pageNumberElements = [];
    var opts = element.data('options');
    var pages = Math.ceil(opts.total / opts.pageSize);
    for(var i = 0; i < pages; i++) {
      var page = i + 1;
      pageNumberElements.push('<li class="page_num" data-pagenum="'+ page +'"><a href="javascript:void(0);">' + page + '</a></li>');
    }
    element.find('li.page_num').remove();
    element.find(".page_prev").after(pageNumberElements.join(''));
  }

  function refreshUI(element, options) {
    var opts = element.data('options');
    if (options) {
      if (options.total) {
        opts.total = options.total;
      }
      // TODO validation
      if (options.pageNumber) {
        opts.pageNumber = options.pageNumber;
      }
      if (options.pageSize) {
        opts.pageSize = options.pageSize;
      }
    }
    var pages = Math.ceil(opts.total / opts.pageSize);
    element.find('.num_wrap span em').text(opts.total);
    element.find('.cur_page em').text(opts.pageNumber);
    element.find('.cur_page b').text(pages);
    element.find('input').val('');
    
    element.find('select').val(opts.pageSize);
    
    // refresh pageNumberElements
    buildPageNumberElements(element);
    updatePageBtnsStyle(element);
  }
  
  function addEventListeners(element) {
    element.on('click', '.page_prev', function(e) {
      if ($(this).hasClass('disable')) return false;
      gotoPage(element, 'prev');
      return false;
    });
    element.on('click', '.page_next', function(e) {
      if ($(this).hasClass('disable')) return false;
      gotoPage(element, 'next');
      return false;
    });
    element.on('click', 'li.page_go', function(e) {
      var newPage = element.find('input').val();
      if ($.isNumeric(newPage)) {
        gotoPage(element, newPage);
      }
      return false;
    });
    element.on('click', 'li[data-pagenum]', function(e) {
      var elm = $(this);
      if (elm.hasClass('on')) return false;
      var num = elm.attr('data-pagenum');
      if ($.isNumeric(num) == false) return false;
      gotoPage(element, num);
    });
    
    element.on('change', 'select', function(e) {
      var selectValue = $(this).val();
      if ($.isNumeric(selectValue) == false) return false;
      changePageSize(element, parseInt(selectValue));
      
      return false;
    });
  }
  
  function updatePageBtnsStyle(element) {
    var opts = element.data('options');
    var pageNumber = parseInt(opts.pageNumber);
    var pages = Math.ceil(opts.total / opts.pageSize);
    element.find('li.page_num').removeClass('on');
    element.find('li[data-pagenum="'+pageNumber+'"]').addClass('on');
    element.find('.page_prev').toggleClass('disable', pageNumber < 2);
    element.find('.page_next').toggleClass('disable', pageNumber == pages);
  }
  
  function changePageSize(element, pageSize) {
    var opts = element.data('options');
    
    if (typeof pageSize !== "number") return false;
    opts.pageSize = pageSize;
    var pages = Math.ceil(opts.total / opts.pageSize);
    if (opts.pageNumber > pages) {
      opts.pageNumber = pages;
    }
    refreshUI(element);
    opts.onChangePageSize(opts.pageSize);
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
    // Valid new page 
    if (typeof newPageNum === "number" && newPageNum > 0 && newPageNum <= pages) {
      opts.pageNumber = newPageNum;
      // refresh UI
      element.find('.cur_page em').text(newPageNum);
      updatePageBtnsStyle(element);
      // trigger custom event
      opts.onSelectPage(newPageNum);
    }
  }

}(jQuery));