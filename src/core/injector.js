import platform from '../platform'
import combinedConfig from '../features/combinedConfig'

export default class Injector {
    constructor() {
        switch (document.readyState) {
            case 'complete':
                this.init()
                break
            default:
                window.addEventListener('load', this.init.bind(this))
                break
        }
    }

    init() {
        this.injectObserver()
        this.injectEnabledFeatures()
    }

    async injectEnabledFeatures() {
        try {
            const storageData = await platform.storage.local.get(null)
            Object.entries(storageData)
                // .filter(field => field[1])
                .map(([feature, isEnabled]) => this.switchFeature({
                    feature,
                    isEnabled
                }))
        } catch (error) {
            console.error('Couldn\'t inject enabled features:', error)
        }
    }

    switchFeature({ feature: featureName, isEnabled }) {
        if (!combinedConfig[featureName])
            throw new Error(`There is no feature "${featureName}".`)

        const featureConfig = combinedConfig[featureName]

        // Inject to the game page the file '{extensionFolder}/features/{feature}/inject.(css|js)'
        if (Array.isArray(featureConfig.extensionsToInject)) {
            featureConfig.extensionsToInject.forEach(ext => {
                this[(isEnabled ? 'push' : 'pull') + 'File'](ext, featureName)
            }, this)
        }
        
        // Starts/stops feature workflow.
        const featureModeHandler = featureConfig[isEnabled ? 'start' : 'stop']
        featureModeHandler && featureModeHandler()
    }

    injectObserver() {
        const observerClassName = 'dragons-ui__observer'
        const existingObserver = document.getElementById(observerClassName)
        if (existingObserver) {
            existingObserver.remove()
        }
        document.head.appendChild(
            Object.assign(
                document.createElement('script'),
                {
                    id: observerClassName,
                    src: platform.runtime.getURL(`observer.js`)
                }
            )
        )
    }

    pushFile(ext, featureName) {
        const nodeId = `dragons-ui__${featureName}-${ext}`
        const existingNode = document.getElementById(nodeId)
        if (existingNode) {
            existingNode.remove()
        }
        const filePath = platform.runtime.getURL(
            `features/${featureName}/inject.${ext}`
        )
        const node = document.head.appendChild(
            Object.assign(
                document.createElement(ext === 'js' ? 'script' : 'link'),
                {
                    id: nodeId,
                    ...(
                        ext === 'js'
                            ? { src: filePath }
                            : { rel: 'stylesheet', href: filePath }
                    )
                }
            )
        )
        if (ext === 'js') {
            node.remove()
        }
    }

    pullFile(ext, featureName) {
        const nodeId = `dragons-ui__${featureName}-${ext}`
        if (ext === 'js') {
            // Reset feature side-effects to default values
            const scriptReseter = document.createElement('script')
            scriptReseter.id = nodeId + '-deleter'
            scriptReseter.text = `
                if (typeof DragonsUIObserver !== 'undefined') {
                    DragonsUIObserver.unregister('${featureName}')
                }
            `
            document.head.appendChild(scriptReseter)
            scriptReseter.remove()
        }
        const node = document.getElementById(nodeId)
        if (node) {
            node.remove()
        }
    } 
}