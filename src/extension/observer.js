var DragonsUIObserver = new class DragonsUIObserver {
    constructor() {
        this.features = new Map()
    }

    Feature = class extends DragonsUIObserver {
        dropSideEffects() {}
    }

    // Observer has successfully injected.
    // init() {}

    register(featureName, featureClass) {
        if (this.features.has(featureName))
            return
        const featureInstance = new featureClass()
        this.features.set(featureName, featureInstance)
        featureInstance.init()
    }

    unregister(featureName) {
        if (!this.features.has(featureName))
            return
        this.features.get(featureName).dropSideEffects()
        this.features.delete(featureName)
    }

    systemMessage(message) {
        C.cmd('systemMessage', {
            message: `[Dragons UI] ${message}`,
            timestamp: Date.now() / 1000
        })
    }

    log(type, message) {
        console[type](`[DragonsUIObserver]: ${message}`)
    }
}

// This condition must be running in the content script. Then run all enabled features.
// switch (document.readyState) {
//     case 'complete':
//         DragonsUIObserver.init()
//         break
//     default:
//         window.addEventListener('load', DragonsUIObserver.init)
//         break
// }