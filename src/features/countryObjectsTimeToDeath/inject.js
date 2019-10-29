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
                    ? `<div class="${timerClassName}" data-time-to-live="${this.obj.expire}"><span>${_this.parseSeconds(parseInt(timeToLive))}</span></div>` 
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
        C.PR.refresh && C.PR.refresh()
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

        INTF.SCN && INTF.SCN.scene && INTF.SCN.scene.rebuild && INTF.SCN.scene.rebuild()
    }
})