window.DragonsUI = window.DragonsUI || new class DragonsUI {
    constructor() {
        this.features = new Map()
    }

    Feature = class {
        install() {}
        uninstall() {}
        systemMessage(message) {
            C.cmd('systemMessage', {
                message: `[Dragons UI] ${message}`,
                timestamp: Date.now() / 1000
            })
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

    log(type, message) {
        console[type](`[DragonsUI]: ${message}`)
    }
}