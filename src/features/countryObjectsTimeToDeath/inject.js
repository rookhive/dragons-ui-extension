DragonsUI.register('countryObjectsTimeToDeath', class extends DragonsUI.Feature {
    install() {
        const timerClassName = 'dragons-ui__country-timer'
        const _this = this

        this.redefine({
            key: 'stepHexTimer',
            path: ['C', 'stepHexTimer'],
            additional: function () {
                const timers = $('.' + timerClassName)
                if (!timers.length) return
                timers.each(function () {
                    const $this = $(this)
                    const timeToLiveTimestamp = +$this.attr('data-time-to-live')
                    const timeToLive = timeToLiveTimestamp
                        ? parseInt(timeToLiveTimestamp - Date.now() / 1000)
                        : 0
                    if (timeToLive < 1) {
                        C.PR.refresh()
                        return
                    }
                    $this.find('span').html(_this.parseSeconds(timeToLive))
                })
            }
        })

        UI.DECL("rCanvasBigObj", function (a) {
            this.obj = a.obj
        }, {
            makeHTML: function () {
                const timeToLive = this.obj.expire && typeof this.obj.expire === 'number'
                    ? this.obj.expire - Date.now() / 1000
                    : 0
                const timeToLiveHTML = timeToLive > 0
                    ? `<div class="${timerClassName}" data-time-to-live="${this.obj.expire}"><span></span></div>` 
                    : ''
                var b = this.obj
                    , c = (b.info.login ? MOD.name(b.info, false, false, true) : MOD.tripObjName(b))
                    , a = IIS + "/i/trip/rcanvas/obj/b/" + b.pic
                return '<tr id="' + this.params.id + '"><td><img class="map_cnv_bpic" src="' + a + '"/></td><td class="treb"><div style="height: 18px">' + (b.info.login ? MOD.name(b.info, false, "white", true) : MOD.tripObjName(b))
                    + "</div><div>" + (this.obj.actions ? $.map(this.obj.actions, function (d) {
                    return UI.HTML({
                        ctrl: "rCanvasObjAct",
                        action: d,
                        idObj: b.id,
                        title: c
                    })
                }).join(" | ") : "") + timeToLiveHTML + "</div></td></tr>"
            },
            setHandlers: function () {}
        })
        C.PR.refresh()
    }

    uninstall() {
        this.redefine({
            key: 'stepHexTimer',
            reset: true
        })

        UI.DECL("rCanvasBigObj", function (a) {
            this.obj = a.obj
        }, {
            makeHTML: function () {
                var b = this.obj
                    , c = (b.info.login ? MOD.name(b.info, false, false, true) : MOD.tripObjName(b))
                    , a = IIS + "/i/trip/rcanvas/obj/b/" + b.pic;
                return '<tr id="' + this.params.id + '"><td><img class="map_cnv_bpic" src="' + a + '"/></td><td class="treb"><div style="height: 18px">' + (b.info.login ? MOD.name(b.info, false, "white", true) : MOD.tripObjName(b)) + "</div><div>" + (this.obj.actions ? $.map(this.obj.actions, function (d) {
                    return UI.HTML({
                        ctrl: "rCanvasObjAct",
                        action: d,
                        idObj: b.id,
                        title: c
                    })
                }).join(" | ") : "") + "</div></td></tr>"
            },
            setHandlers: function () {}
        })

        INTF.SCN.scene.rebuild()
    }
})












// this.post = function (pname, data, isLocation, dontrun, cb, isRegistration) {
//     if (TR && pname != "contacts_info" && !isRegistration) {
//         if (cb) {
//             cb()
//         }
//         return this
//     }
//     var path = isLocation ? C.paths.location[pname] : (isRegistration ? C.paths.registration[pname] : (C.paths[pname] || C.paths.location[pname]))
//         , callback = dontrun ? function (data) {
//             if (cb) {
//                 cb(data)
//             }
//         }
//             : function (data, reportData) {
//                 C.run(data, cb || null, reportData)
//             }
//         ;
//     if (!path) {
//         return
//     }
//     if (!data) {
//         data = {}
//     }
//     data.id_process = C.PR.id;
//     data.process_type = C.PR.type;
//     data.afk = this.afk ? 1 : 0;
//     C.debug_post_data = [pname, data, isLocation, new Error().stack];
//     var pingstart = +new Date
//         , ltimer = setTimeout("$('#loading_wnd').show();", 1000);
//     if (this.requestId >= 100) {
//         this.requestId = 0
//     }
//     var requestId = ++this.requestId;
//     if (this.responseHandlerQueue.hasOwnProperty(requestId)) {
//         delete this.responseHandlerQueue[requestId];
//         Trace13480(new Error(), "request already has a queue")
//     }
//     if (false == this.activeRequestId) {
//         this.activeRequestId = requestId
//     }
//     var defaultHandler = function () {
//         ping = +new Date - pingstart;
//         clearTimeout(ltimer);
//         $("#loading_wnd").hide()
//     }
//         , successHandler = _.bind(function (data, tS, XMLHttpRequest) {
//             var responseHandler = function (data, tS, XMLHttpRequest, pingstart, ltimer, path) {
//                 return function () {
//                     defaultHandler();
//                     callback(data, {
//                         path: path,
//                         contentLength: XMLHttpRequest.getResponseHeader("X-Content-Length")
//                     })
//                 }
//             }
//                 .call(this, data, tS, XMLHttpRequest, pingstart, ltimer, path);
//             this.processRequestQueue(requestId, responseHandler)
//         }, this)
//         , errorHandler = _.bind(function () {
//             this.processRequestQueue(requestId, defaultHandler)
//         }, this);
//     $.ajax({
//         type: "POST",
//         url: "/?" + path + "&h1=" + MD5.Hash(this.pack.system.public_key + PRK + path),
//         data: this.clearPost(data),
//         success: successHandler,
//         error: errorHandler
//     });
//     this.rs();
//     return this
// }