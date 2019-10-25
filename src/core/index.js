import { platform } from '../utils'
import Injector from './injector'

const injector = new Injector()

console.log('content script has been loaded!')

// Receives messages from background script
platform.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.type) {
        case 'MY_DARLING_CORE_PLEASE_SWITCH_THE_FEATURE':
            console.log('core получил сообщение от background:', request.data)
            try {
                injector.switchFeature(request.data)
            } catch (error) {
                sendResponse({
                    error: error.message
                })
            }
            sendResponse({ success: true })
    }
})