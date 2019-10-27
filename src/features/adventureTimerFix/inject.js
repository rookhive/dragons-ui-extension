DragonsUI.register('adventureTimerFix', class extends DragonsUI.Feature {
    install() {
        if (
            typeof C.getTimeObj !== 'function'
            || C.getTimeObj.toString() !== 'function(sD){var diff=Math.max(0,sD-Math.floor(+this.sdate/1000)),res=MOD.getDateParts(new Date(diff*1000));res.timeString=function(){return res.mn+":"+res.s};res.diff=diff;return res}'
        ) {
            this.systemMessage('Похоже, в игру были внесены изменения. Чтобы ничего не сломать, фикс таймера хода не будет включен. В следующей версии расширения проблема будет исправлена.')
            return
        }

        // Cache defaults
        this.getTimeObj = C.getTimeObj

        C.getTimeObj = function (sdate) {
            var diff = Math.max(0, sdate - Math[this.PR.type === 'adventure' ? 'ceil' : 'floor'](+this.sdate / 1000)),
                res = MOD.getDateParts(new Date(diff * 1000))
            res.timeString = function () {
                return res.mn + ":" + res.s
            }
            res.diff = diff
            return res
        }
    }

    uninstall() {
        C.getTimeObj = this.getTimeObj
    }
})