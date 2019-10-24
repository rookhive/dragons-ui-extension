const platform = typeof browser !== 'undefined'
    ? browser
    : chrome

// Обработка сообщений от content scripts
platform.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    switch (request.type) {
        case 'SET_FEATURE':
            await setFeature(request.data)
            return true
    }
})

async function setFeature(data) {
    const tabs = await platform.tabs.query({
        url: "*://world.mist-game.ru/"
    })
    await platform.storage.local.set({ [data.feature]: data.isEnabled })
    // Player is in the game now, push in or pull out feature's stuff.
    if (tabs.length) {
        return await sendMessage(tabs, {
            type: 'SWITCH_FEATURE',
            data
        })  
    }
}

/**
 * Отправляет сообщение открытой вкладке с игрой
 * Возвращает: Promise с ответом на сообщение
 */
function sendMessage(tabs, data) {
    return platform.tabs.sendMessage(
        tabs[0].id,
        data
    )
}


// function addCssLine() {
//     var style2 = document.createElement('style');
//     style2.type = 'text/css';
//     style2.appendChild(document.createTextNode('.box { background: red }'));
//     document.head.appendChild(style2);
// }

// function addCssFile(id, href) {
//     const link = document.createElement('link')
//     link.rel = 'stylesheet'
//     link.href = href
//     link.id = id === 'undefined' ? Date.now() : id
//     document.head.appendChild(link)
// }


// window.addEventListener('load', (contentScripts => {
//     const platform = typeof chrome !== 'undefined' ? chrome : browser
//     contentScripts.forEach(scriptName => {
//         const url = platform.runtime.getURL(`js/${scriptName}.js`)
//         let script = document.createElement('script')
//         script.setAttribute('src', url)
//         document.head.appendChild(script)
//     })
// })(['adventuresTimerFix']))

// Обработка кликабельности иконки расширения..
// browser.runtime.onInstalled.addListener(this.browserActionHandler) // ..при установке расширения
// browser.tabs.onActivated.addListener(this.browserActionHandler)    // ..при переключении активной вкладки
// browser.tabs.onUpdated.addListener(this.browserActionHandler)      // ..при обновлении вкладки - например, url (при входе в игру)
