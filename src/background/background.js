
import config from '../config'
import combinedConfig from '../features/combinedConfig'

export default class Background {
    constructor() {
        this.backgroundObjects = new Map()
        this.httpRequestHandlerContextMap = new Map()

        this.init()
    }

    test() {
        console.log('inheritance works!')
    }

    init() {
        this.injectEnabledFeatures()
    }

    async injectEnabledFeatures() {
        try {
            const storageData = await browser.storage.local.get(null)
            Object.entries(storageData)
                .forEach(async ([name, mode]) => {
                    if (!combinedConfig[name]) {
                        console.warn(`Couldn't find feature '${name}' in combinedConfig, the key '${name}' will be deleted from storage.`)
                        await browser.storage.local.remove(name)
                        return
                    }
                    await this.switchFeature({
                        name,
                        mode
                    })
                })
        } catch (error) {
            throw error
        }
    }

    async switchFeature(data) {
        const tabs = await browser.tabs.query({ url: config.injectionUrlMask })
        await browser.storage.local.set({ [data.name]: data.mode })
        const featureConfig = combinedConfig[data.name]
        if (!featureConfig) {
            throw new Error(`Couldn't find config for the ${data.name} feature.`)
        }
        if (featureConfig.files && featureConfig.files.background) {
            let backgroundObject
            if (this.backgroundObjects.has(data.name)) {
                backgroundObject = this.backgroundObjects.get(data.name)
            } else {
                const backgroundChunk = await import(/* webpackMode: "eager" */ `../features/${data.name}/background.js`)
                    .then(module => module.default)
                    .catch(error => {
                        throw new Error(`Couldn\'t import backgroundChunk from "../features/${data.name}/background.js":`, error)
                    })
                this.backgroundObjects.set(
                    data.name,
                    backgroundObject = Object.assign(
                        Object.create(this),
                        backgroundChunk
                    )
                )
            }
            backgroundObject[data.mode ? 'install' : 'uninstall']()
        }
        if (tabs.length) {
            return browser.tabs.sendMessage(
                tabs[0].id,
                { type: 'MY_DARLING_CORE_PLEASE_SWITCH_THE_FEATURE', data }
            )
        }
        return { success: true }
    }

    httpRequestHandler({ name, mode, listener, useDefaultHttpListener }) {
        try {
            const handler = browser.webRequest.onBeforeRequest
            switch (mode) {
                case 'add':
                    if (useDefaultHttpListener) {
                        listener = this.getDefaultHttpResponseListener(listener)
                    }
                    if (handler.hasListener(listener) || this.httpRequestHandlerContextMap.has(name)) {
                        return
                    }
                    this.httpRequestHandlerContextMap.set(name, listener)
                    handler.addListener(
                        listener,
                        { urls: [config.injectionUrlMask] }, // , types: ["main_frame"]
                        ['blocking']
                    )
                    console.log('http listened has added')
                    break

                case 'remove':
                    if (!this.httpRequestHandlerContextMap.has(name)) {
                        return
                    }
                    listener = this.httpRequestHandlerContextMap.get(name)
                    handler.hasListener(listener) && handler.removeListener(listener)
                    this.httpRequestHandlerContextMap.delete(name)
                    console.log('http listened has removed')
                    break
            }
        } catch (error) {
            throw new Error('Supersex error:', error)
        }
    }

    getDefaultHttpResponseListener(listener) {
        return details => {
            if (details.method === 'GET') {
                return
            }

            const filter = browser.webRequest.filterResponseData(details.requestId)
            let decoder = new TextDecoder('utf-8', { fatal: true })
            let response = ''

            filter.ondata = event => {
                response += decoder.decode(event.data, {
                    stream: true
                })
                filter.write(event.data)
            }

            filter.onstop = () => {
                listener(response)
                filter.disconnect()
            }
        }
    }
}