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
    }

    async switchFeature({ name, mode }) {
        if (!combinedConfig[name])
            throw new Error(`There is no feature "${name}".`)
        const featureConfig = combinedConfig[name]
        if (!featureConfig) {
            throw new Error(`Couldn\'t find config for ${name} feature.`)
        }
        if (!featureConfig.files) {
            return
        }
        if (featureConfig.files.inject) {
            ['js', 'css'].forEach(ext => {
                if (featureConfig.files.inject[ext]) {
                    this[(mode ? 'push' : 'pull') + 'File'](ext, name)
                }
            }, this)
        }
        if (featureConfig.files.content) {
            const contentChunk = await import(/* webpackMode: "eager" */ `../features/${name}/content.js`)
                .then(module => module.default)
                .catch(error => {
                    throw new Error(`Couldn\'t import "../features/${name}/content.js":`, error)
                })
            contentChunk[mode ? 'install' : 'uninstall']()
        }
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
                    src: browser.runtime.getURL(`observer.js`)
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
        const filePath = browser.runtime.getURL(
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
                if (typeof DragonsUI !== 'undefined') {
                    DragonsUI.unregister('${featureName}')
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