import platform from '../platform'
import combinedConfig from '../features/combinedConfig'

export default class Injector {
    analyse({ feature: featureName, isEnabled }) {
        if (!combinedConfig[featureName])
            throw new Error(`There is no feature "${featureName}".`)

        const featureConfig = combinedConfig[featureName]

        // Inject to the game page the file '{extensionFolder}/resources/(css|js)/{feature}.(css|js)'
        if (Array.isArray(featureConfig.extensionsToInject)) {
            featureConfig.extensionsToInject.forEach(ext => {
                this[(isEnabled ? 'push' : 'pull') + 'File'](ext, featureName)
            }, this)
        }
        
        // Starts/stops feature workflow.
        const featureModeHandler = featureConfig[isEnabled ? 'start' : 'stop']
        featureModeHandler && featureModeHandler()
    }

    pushFile(ext, featureName) {
        const nodeId = `dragons-ui__${featureName}-${ext}`
        if (document.getElementById(nodeId)) {
            return
        }
        const filePath = platform.runtime.getURL(
            `resources/${featureName}/index.${ext}`
        )
        document.head.appendChild(
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
    }

    pullFile(ext, featureName) {
        const nodeId = `dragons-ui__${featureName}-${ext}`
        if (ext === 'js') {
            // Reset feature side-effects to default values
            const scriptReseter = document.createElement('script')
            scriptReseter.id = nodeId + '-deleter'
            scriptReseter.text = `
                if (typeof DragonsUI !== 'undefined') {
                    DragonsUI[${featureName}].deleteSideEffects()
                    delete DragonsUI[${featureName}]
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