import Injector from './injector'

const injector = new Injector()

browser.runtime.onMessage.addListener(async request => {
    switch (request.type) {
        case 'MY_DARLING_CORE_PLEASE_SWITCH_THE_FEATURE':
            try {
                await injector.switchFeature(request.data)
            } catch (error) {
                return { error: error.message }
            }
            return { success: true }
    }
})