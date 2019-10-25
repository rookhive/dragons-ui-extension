browser.runtime.onMessage.addListener(async request => {
    switch (request.type) {
        case 'DEAR_BACKGROUND_PLEASE_SWITCH_THE_FEATURE':
            return await switchFeature(request.data)
    }
})

async function switchFeature(data) {
    const tabs = await browser.tabs.query({ url: "*://world.mist-game.ru/" })
    await browser.storage.local.set({ [data.feature]: data.isEnabled })
    if (tabs.length) {
        return browser.tabs.sendMessage(
            tabs[0].id,
            {
                type: 'MY_DARLING_CORE_PLEASE_SWITCH_THE_FEATURE',
                data
            }
        )
    }
}