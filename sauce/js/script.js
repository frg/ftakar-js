/**
 * Created by Jean Farrugia on 07/03/2015.
 */
'use strict';
(function (factory) {
    // If in an AMD environment, define() our module, else use the
    // jQuery global.
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }
}(function($) {
    $.fn.ftakar = function(options) {

        // default settings
        var settings = $.extend({
            savedDataName: 'FTAKAR',
            // saveOnInterval: 200,
            saveOnInterval: false,
            saveOnChange: true,
            clearOnSubmit: true,
            expireInMs: false,
            // priority by order
            idAttribs: ['id', 'data-ftakar'], 
            beforeSave: function(element){ console.info('FTAKAR: data is being saved', element) },
            // $(document).trigger( "ftakar__beforeSave" );
            onSave: function(element){ console.info('FTAKAR: data saved', element) },
            // $(document).trigger( "ftakar__onSave" );
            beforeLoad: function(){ console.info('FTAKAR: data is being loaded') },
            // $(document).trigger( "ftakar__beforeLoad" );
            onLoad: function(){ console.info('FTAKAR: data has loaded') },
            // $(document).trigger( "ftakar__onLoad" );
            beforeClear: function(){ console.info('FTAKAR: data is going to be cleared') },
            // $(document).trigger( "ftakar__beforeClear" );
            onClear: function(){ console.info('FTAKAR: data cleared') }
            // $(document).trigger( "ftakar__onClear" );
        }, options);

        // check if supports local storage
        var supports_html5_storage = function () {
            try {
                return 'localStorage' in window && window['localStorage'] !== null;
            } catch (e) {
                console.info('FTAKAR: html5 storage not supported.');
                return false;
            }
        }

        // KEY: attrib||element id
        // DATA:
        // expiry date
        // value

        if (supports_html5_storage()) {
            var store = {
                get: function() {
                    var a = JSON.parse(localStorage.getItem(settings.savedDataName));
                    return (typeof(a) === 'object' && a != null) ? a : {};
                },
                set: function(data) {
                    localStorage.setItem(settings.savedDataName, JSON.stringify(data));
                },
                destroy: function() {
                    localStorage.removeItem(settings.savedDataName);
                }
            };

            var key = {
                // this key generations stuff can and should be improved
                // dont just use delimietrs -- use escaping "escape(String here)"
                create: function(element) {
                    for (var i = 0; i < settings.idAttribs.length; i++) {
                        // check if attribute has value
                        if ($(element).attr(settings.idAttribs[i]) != null) {
                            // escape strings
                            return escape(settings.idAttribs[i]) + '~' + escape($(element).attr(settings.idAttribs[i]));
                        }
                    }

                    return false;
                },
                get: function(key) {
                    // split
                    var a = key.split(/~(.+)?/);
                    // unescape
                    for (var i = 0; i < a.length; i++) {
                        a[i] = unescape(a[i]);
                    }
                    return a;
                }
            };

            // save function
                // takes element
            var save = function(element) {
                if (element) {
                    // get data
                    var data = store.get();
                    
                    var elementId = key.create(element);
                    if (elementId) {
                        settings.beforeSave(element);

                        var now = new Date().getMilliseconds();
                        var expires = (settings.expiresInMs) ? parseInt(now.toString()) + settings.expiresInMs : null;

                        data[elementId] = { 
                                            expires: expires,
                                            val: $(element).val()
                                        };

                        // save data
                        store.set(data);
                        settings.onSave(element);
                        return true;
                    }
                }

                return false;
            };

            // delete function
                // takes element
            /*var delete = function(element) {
                if (element) {
                    // get data
                    var data = data.get();
                    
                    var elementId = key.create(element);
                    if (elementId) {
                        delete data[elementId];

                        // save data
                        data.set(data);
                        return true;
                    }
                }

                return false;
            };*/

            // hasExpired
                // check if element has expired
                // takes element
            var hasExpired = function(data) {
                var now = new Date().getMilliseconds();;
                return (data.expires) ? (now > data.expires) : false;
            };

            if (settings.clearOnSubmit) {
                this.closest('form').submit(function() {
                    // clear data
                    store.destroy();
                });
            }

            if (settings.saveOnInterval) {
                setInterval(function(){ 
                    // save input
                    save(this);
                }, settings.saveOnInterval);
            }

            $(document).ready(function() {
                // load all inputs
                    // if expired.. delete
                var data = store.get();
                settings.beforeLoad();
                for (var k in data) {
                    // loop through saved data
                    // check if data has expired
                    if (!hasExpired(data[k])) {
                        // get key
                        var id = key.get(k);
                        // find respective element & set saved data
                        $('[' + id[0] + '="' + id[1] + '"]').val(data[k].val);
                    } else {
                        // if data expired.. delete
                        delete data[key];
                    }
                }
                settings.onLoad();

                // save data.. in case some keys have been deleted
                store.set(data);
            });

            this.change(function(eventData, handler){
                // get input
                // save input
                save(this);
            });
        }

        return this;
    }
}));