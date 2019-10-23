DragonsUI.register('battleMenuFix', class extends DragonsUI.Feature {
    init() {
        if (
            typeof C.getTimeObj !== 'function'
            || C.getTimeObj.toString() !== 'function(sD){var diff=Math.max(0,sD-Math.floor(+this.sdate/1000)),res=MOD.getDateParts(new Date(diff*1000));res.timeString=function(){return res.mn+":"+res.s};res.diff=diff;return res}'
            || C.stepHexTimer.toString() !== 'function(value,selector){var tObj=this.getTimeObj(value);if(tObj.diff==0&&C.PR.start_time_diff==0){if(window.worldMap!=undefined&&window.worldMap.way.length>0&&C.PR.intf=="worldMap"&&C.PR.data.coord!=undefined&&window.worldMap.coord!=C.PR.data.coord){if(C.PR.data.reset_way){window.worldMap.way=[];$("#trip_area_way").html("")}else{var coord=window.worldMap.way.shift();window.worldMap.coord=C.PR.data.coord;C.PR.lpost("step_on_hex",{coord:coord},function(){$("#legs_"+coord[0]+"_"+coord[1]).remove()})}}}C.PR.start_time_diff=tObj.diff;$(selector).simpleHtml(tObj.timeString()).toggleClass("red",tObj.diff<60);this.titleTimer(tObj.timeString())}'
        ) {
            // TODO: maybe switch to notification?
            this.systemMessage('Похоже, в игру были внесены изменения. Чтобы ничего не сломать, фикс таймера хода не будет включен. Пожалуйста, напишите <a href="https://www.mist-game.ru/user_270906.html">cwaffie</a> для скорейшего исправления проблемы.')
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

    dropSideEffects() {
        C.getTimeObj = this.getTimeObj
    }
})