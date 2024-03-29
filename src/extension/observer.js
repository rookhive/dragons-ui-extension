if (window.DragonsUI) {
    DragonsUI.clear()
}
window.DragonsUI = new class DragonsUI {
    constructor() {
        this.features = new Map()
        this.redefinedFunctions = new Map()
    }

    Feature = class extends DragonsUI {
        install() {}
        uninstall() {}
        
        systemMessage(message) {
            C.cmd('systemMessage', {
                message: `[Dragons UI] ${message}`,
                timestamp: Date.now() / 1000
            })
        }

        redefine({ reset, key, path, additional }) {
            if (reset && key) {
                if (!this.redefinedFunctions[key]) return
                const redefined = this.redefinedFunctions[key]
                redefined.context[redefined.name] = redefined.original
                delete this.redefinedFunctions[key]
                return
            }
            const _this = this
            const redefinedFunctionName = path.pop()
            const redefinedContext = path
                .reduce(
                    (currentObject, currentProperty) => currentObject[currentProperty],
                    window
                )
            this.redefinedFunctions[key] = {
                context: redefinedContext,
                name: redefinedFunctionName,
                original: redefinedContext[redefinedFunctionName]
            }
            redefinedContext[redefinedFunctionName] = function() {
                const redefined = _this.redefinedFunctions[key]
                additional()
                return redefined.original.apply(redefined.context, [...arguments])
            }
        }

        parseSeconds(s) {
            const hours = parseInt(s / 3600)
            const minutes = parseInt((s - hours * 3600) / 60)
            const seconds = s % 60
            return [hours, minutes, seconds]
                .filter((item, i) => item || i > 0)
                .map(item => item < 10 ? '0' + item : item)
                .join(':')
        }

        getScrollbarWidth() {
            if (this.scrollbarWidth) {
                return this.scrollbarWidth
            }
            const body = document.body
            const div = document.createElement('div')
            div.style.cssText = `
                overflow-y: scroll;
                width: 50px;
                height: 50px;
                visibility: hidden;
            `
            body.appendChild(div)
            this.scrollbarWidth = div.offsetWidth - div.clientWidth
            body.removeChild(div)
            return this.scrollbarWidth
        }
    }

    register(featureName, featureClass) {
        if (this.features.has(featureName)) {
            return
        }
        const featureInstance = new featureClass()
        this.features.set(featureName, featureInstance)
        featureInstance.install()
    }

    unregister(featureName) {
        if (!this.features.has(featureName)) {
            return
        }
        this.features.get(featureName).uninstall()
        this.features.delete(featureName)
    }

    clear() {
        this.features.forEach((feature, name) => {
            this.unregister(name)
        })
    }

    log(type, message) {
        console[type](`[DragonsUI]: ${message}`)
    }
}