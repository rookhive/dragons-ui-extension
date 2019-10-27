import Background from './background'

const background = new Background()

browser.runtime.onMessage.addListener(async request => {
    switch (request.type) {
        case 'DEAR_BACKGROUND_PLEASE_SWITCH_THE_FEATURE':
            return await background.switchFeature(request.data)
    }
})