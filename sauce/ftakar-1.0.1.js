/**
 * [Created by] Jean Farrugia on 07/03/2015 (dd/mm/yyyy).
 * [Definition] "ftakar" is the equivalent of "remember" in Maltese.
 */
(function($) {
    'use strict';

  var __nativeSI__ = window.setInterval;
  var setInterval = function (vCallback, nDelay ) {
    var oThis = this, aArgs = Array.prototype.slice.call(arguments, 2);
    return __nativeSI__(vCallback instanceof Function ? function () {
      vCallback.apply(oThis, aArgs);
    } : vCallback, nDelay);
  };

  $.fn.ftakar = function(options) {
    var settings = $.extend($.fn.ftakar.defaults, options),
    supports_html5_storage = function () {
        try {
            return 'localStorage' in window && window.localStorage !== null;
        } catch (e) {
            return false;
        }
    };

    if (supports_html5_storage()) {
        var $this = $(this),
        store = {
            get: function() {
                var a = JSON.parse(localStorage.getItem(settings.savedDataName));
                return (typeof(a) === 'object' && a !== null) ? a : {};
            },
            set: function(data) {
                localStorage.setItem(settings.savedDataName, JSON.stringify(data));
            },
            destroy: function() {
                localStorage.removeItem(settings.savedDataName);
            }
        },
        key = {
            create: function(element) {
                for (var i = 0; i < settings.idAttribs.length; i++) {
                    if ($(element).attr(settings.idAttribs[i]) !== null) {
                        return encodeURI(settings.idAttribs[i]) + " " + encodeURI($(element).attr( settings.idAttribs[i] ));
                    }
                }

                return false;
            },
            get: function(key) {
                var array =  key.split(" ");
                for (var index = 0; index < array.length; index++) {
                    array[index] = decodeURI(array[index]);
                }
                return array;
            }
        },
        elementData = {
            save: function(element) {
                if (element) {
                    var data = store.get();

                    var elementId = key.create(element);
                    if (elementId) {
                        settings.beforeSave.call();

                        var now = new Date().getTime();
                        var expires = (settings.expireInMs) ? parseInt(now.toString()) + settings.expireInMs : null;

                        var toSave = "";
                        switch ($(element).attr('type')){
                          case 'radio':
                          case 'checkbox':
                            toSave = $(element).prop('checked');
                            break;
                          default:
                            toSave = $(element).val();
                        }

                        data[elementId] = {
                                            expires: expires,
                                            val: toSave
                                        };

                        store.set(data);
                        settings.onSave.call();
                        return true;
                    }
                }

                return false;
            },
            destroy: function(element) {
                if (element) {
                    var data = store.get();

                    var elementId = key.create(element);
                    if (elementId) {
                        settings.beforeDelete.call();

                        delete data[elementId];

                        settings.onDelete.call();
                        store.set(data);
                        return true;
                    }
                }

                return false;
            },
            hasExpired: function(data) {
                var now = new Date().getTime();
                return (data.expires) ? (now > data.expires) : false;
            }
        };

        if (settings.clearOnSubmit) {

            this.closest('form')
                .submit(function(e){
                    e.preventDefault();
                    $this.each(function(){
                        elementData.destroy(this);
                    });
            });
        }

        if (settings.saveOnInterval && !isNaN(settings.saveOnInterval) && parseInt(settings.saveOnInterval) > 0) {
          setInterval(
            function(that){
              for (var i = 0; i < that.length; i++) {
                elementData.save(that[i]);
              }
            },
            parseInt(settings.saveOnInterval),
            this
          );
        }

        $(document).ready(function() {
            settings.beforeLoad.call();

            var data = store.get();
            for (var k in data) {
                if (!elementData.hasExpired(data[k])) {
                    var id = key.get(k);
                    var $element = $('[' + id[0] + '="' + id[1] + '"]');

                    switch ($element.attr('type')){
                      case 'radio':
                      case 'checkbox':
                        $element.prop('checked', data[k].val);
                        break;
                      case 'select':
                        $element.find("option").filter(function() {
                            return $(this).text() === data[k].val;
                        }).attr('selected', true);
                        break;
                      default:
                        $element.val(data[k].val);
                    }
                } else {
                    delete data[key];
                }
            }

            store.set(data);

            settings.onLoad.call();
        });

        if (settings.saveOnChange) {
          this.change(function(){
              elementData.save(this);
          });
        }
    }

    return this;
  };

  $.fn.ftakar.defaults = {
    savedDataName: 'FTAKAR',
    saveOnInterval: false,
    saveOnChange: true,
    clearOnSubmit: true,
    expireInMs: false,
    idAttribs: ['id', 'name', 'data-ftakar'],
    beforeSave: function(){  },
    onSave: function(){  },
    beforeLoad: function(){  },
    onLoad: function(){  },
    beforeDelete: function(){  },
    onDelete: function(){  },
    beforeClear: function(){  },
    onClear: function(){  }
  };
}( jQuery ));
