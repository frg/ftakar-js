/**
 * [Created by] Jean Farrugia on 07/03/2015 (dd/mm/yyyy).
 * [Definition] "ftakar" is the equivalent of "remember" in Maltese.
 */
(function($) {
    'use strict';

  // https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval#The_.22this.22_problem
  var __nativeSI__ = window.setInterval;
  var setInterval = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
    var oThis = this, aArgs = Array.prototype.slice.call(arguments, 2);
    return __nativeSI__(vCallback instanceof Function ? function () {
      vCallback.apply(oThis, aArgs);
    } : vCallback, nDelay);
  };

  $.fn.ftakar = function(options) {
    // default settings
    var settings = $.extend($.fn.ftakar.defaults, options),
    supports_html5_storage = function () {
        // check if browser supports local storage
        try {
            return 'localStorage' in window && window.localStorage !== null;
        } catch (e) {
            // console.info('FTAKAR: html5 storage not supported.');
            return false;
        }
    };

    // check for loacl storage support
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
            // this key generations stuff can and should be improved
            create: function(element) {
                for (var i = 0; i < settings.idAttribs.length; i++) {
                    // check if attribute has value
                    if ($(element).attr(settings.idAttribs[i]) !== null) {
                        // escape strings
                        return encodeURI(settings.idAttribs[i]) + " " + encodeURI($(element).attr( settings.idAttribs[i] ));
                    }
                }

                return false;
            },
            get: function(key) {
                // split
                var array =  key.split(" ");
                for (var index = 0; index < array.length; index++) {
                    // escape strings
                    array[index] = decodeURI(array[index]);
                }
                return array;
            }
        },
        elementData = {
            save: function(element) {
                if (element) {
                    // get data
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
                          /*case 'select':
                          case 'input':*/
                          default:
                            toSave = $(element).val();
                        }

                        data[elementId] = {
                                            expires: expires,
                                            val: toSave
                                        };

                        // save data
                        store.set(data);
                        settings.onSave.call();
                        return true;
                    }
                }

                return false;
            },
            destroy: function(element) {
                if (element) {
                    // get data
                    var data = store.get();

                    var elementId = key.create(element);
                    if (elementId) {
                        settings.beforeDelete.call();

                        delete data[elementId];

                        settings.onDelete.call();
                        // save data
                        store.set(data);
                        return true;
                    }
                }

                return false;
            },
            hasExpired: function(data) {
                // check if element has expired
                var now = new Date().getTime();
                return (data.expires) ? (now > data.expires) : false;
            }
        };

        if (settings.clearOnSubmit) {
            // Most of this can be deleted when form domains are implemented
            /*var input = $('input[type=submit]');
            var form = input.length > 0 ? $(input[0].form) : $();*/

            this.closest('form')
                .submit(function(e){
                    e.preventDefault();
                    // when closest form is submitted
                    $this.each(function(){
                        // delete element data
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
                // loop through saved data
                // check if data has expired
                if (!elementData.hasExpired(data[k])) {
                    // get key
                    var id = key.get(k);
                    // find respective element & set saved data
                    var $element = $('[' + id[0] + '="' + id[1] + '"]');

                    switch ($element.attr('type')){
                      case 'radio':
                      case 'checkbox':
                        $element.prop('checked', data[k].val);
                        break;
                      case 'select':
                        $element.find("option").filter(function() {
                            // may want to use $.trim in here
                            return $(this).text() === data[k].val;
                        }).attr('selected', true);
                        break;
                      default:
                        $element.val(data[k].val);
                    }
                } else {
                    // if data expired.. delete
                    delete data[key];
                }
            }

            // save data.. in case some keys have been deleted
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

  // defaults may be overridden
  $.fn.ftakar.defaults = {
    savedDataName: 'FTAKAR',
    // saveOnInterval: 2000,
    saveOnInterval: false,
    saveOnChange: true,
    clearOnSubmit: true,
    expireInMs: false,
    // priority by order of attribute
    idAttribs: ['id', 'name', 'data-ftakar'],
    beforeSave: function(){ /*console.info('FTAKAR: data is being saved', this);*/ },
    // $(document).trigger( "ftakar__beforeSave" ); // TODO
    onSave: function(){ /*console.info('FTAKAR: data saved', this);*/ },
    // $(document).trigger( "ftakar__onSave" ); // TODO
    beforeLoad: function(){ /*console.info('FTAKAR: data is being loaded');*/ },
    // $(document).trigger( "ftakar__beforeLoad" ); // TODO
    onLoad: function(){ /*console.info('FTAKAR: data has loaded');*/ },
    // $(document).trigger( "ftakar__onLoad" ); // TODO
    beforeDelete: function(){ /*console.info('FTAKAR: element data is going to be deleted', this);*/ },
    // $(document).trigger( "ftakar__beforeDelete" ); // TODO
    onDelete: function(){ /*console.info('FTAKAR: element data deleted', this);*/ },
    // $(document).trigger( "ftakar__onDelete" ); // TODO
    beforeClear: function(){ /*console.info('FTAKAR: data is going to be cleared');*/ },
    // $(document).trigger( "ftakar__beforeClear" ); // TODO
    onClear: function(){ /*console.info('FTAKAR: data cleared');*/ }
    // $(document).trigger( "ftakar__onClear" ); // TODO
  };
}( jQuery ));
