import platform from '../platform'
import Injector from './injector'

const injector = new Injector()

// Receives messages from background script
platform.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    switch (request.type) {
        case 'SWITCH_FEATURE':
            injector.switchFeature(request.data)
            return true
    }
})