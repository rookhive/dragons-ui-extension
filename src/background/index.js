import combinedConfig from '../features/combinedConfig'
import config from '../config.js'

browser.runtime.onMessage.addListener(async request => {
    switch (request.type) {
        case 'DEAR_BACKGROUND_PLEASE_SWITCH_THE_FEATURE':
            return await switchFeature(request.data)

        // case 'DEAR_BACKGROUND_PLEASE_REGISTER_HTTP_LISTENER':
        //     return await httpRequestHandler(request.data)
    }
})

async function switchFeature(data) {
    const tabs = await browser.tabs.query({ url: config.injectionUrlMask })
    await browser.storage.local.set({ [data.name]: data.mode })
    const featureConfig = combinedConfig[data.name]
    if (!featureConfig) {
        throw new Error(`Couldn't find config for the ${data.name} feature.`)
    }
    if (featureConfig.files && featureConfig.files.background) {
        const backgroundChunk = await import(/* webpackMode: "eager" */ `../features/${data.name}/background.js`)
            .then(module => module.default)
            .catch(error => {
                throw new Error(`Couldn\'t import backgroundChunk from "../features/${data.name}/background.js":`, error)
            })
        backgroundChunk[data.mode ? 'install' : 'uninstall']()
    }
    if (tabs.length) {
        return browser.tabs.sendMessage(
            tabs[0].id,
            { type: 'MY_DARLING_CORE_PLEASE_SWITCH_THE_FEATURE', data }
        )
    }
    return { success: true }
}

// const httpRequestHandlerContextMap = new Map()
// async function httpRequestHandler({ mode, id, listener, httpListener }) {
//     const handler = browser.webRequest.onBeforeRequest
//     let responseListener

//     try {
//     switch (mode) {
//         case 'add':
//             responseListener = httpListener
//                 ? httpListener(listener)
//                 : defaultHttpResponseListener(listener)
//             if (handler.hasListener(responseListener)) {
//                 return
//             }
//             if (!httpRequestHandlerContextMap.has(id)) {
//                 httpRequestHandlerContextMap.set(id, responseListener)
//             }
//             handler.addListener(
//                 responseListener,
//                 { urls: ['*://world.mist-game.ru/*'] }, // , types: ["main_frame"]
//                 ['blocking']
//             )
//             console.log('http listened has added')
//             break

//         case 'remove':
//             if (!httpRequestHandlerContextMap.has(id)) {
//                 return
//             }
//             responseListener = httpRequestHandlerContextMap.get(id)
//             handler.hasListener(responseListener) && handler.removeListener(responseListener)
//             httpRequestHandlerContextMap.delete(id)
//             console.log('http listened has removed')
//             break
//     }
// } catch (error) {
//     throw new Error('Supersex error:', error)
// }
// }

// function defaultHttpResponseListener(listener, context) {
//     return details => {
//         if (details.method === 'GET') {
//             return
//         }

//         const filter  = browser.webRequest.filterResponseData(details.requestId)
//         let decoder = new TextDecoder('utf-8', { fatal: true })
//         let response = ''

//         filter.ondata = event => {
//             response += decoder.decode(event.data, {
//                 stream: true
//             })
//             filter.write(event.data)
//         }

//         filter.onstop = () => {
//             listener.call(context, response)
//             filter.disconnect()
//         }
//     }
// }