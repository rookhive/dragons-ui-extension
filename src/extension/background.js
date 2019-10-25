const platform = typeof browser !== 'undefined'
    ? browser
    : chrome

const promisify = (context, func, ...args) => {
    if (typeof func === 'string') {
        func = context[func]
    }
    return new Promise(resolve => {
        func.apply(context, args.concat([data => resolve(data)]))
    })
}

// Обработка сообщений от content scripts
platform.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    switch (request.type) {
        case 'DEAR_BACKGROUND_PLEASE_SWITCH_THE_FEATURE':
            console.log('background получил сообщение от popup:', request.data)
            return await switchFeature(request.data)
    }
})

async function switchFeature(data) {
    console.log('background пробует включить/отключить фичу', data.feature)
    const tabs = await promisify(platform.tabs, 'query', { url: "*://world.mist-game.ru/" })
    console.log('вкладка с игрой:', tabs)
    await promisify(platform.storage.local, 'set', { [data.feature]: data.isEnabled })
    console.log('данные сохранены в extension storage')
    // Player is in the game now, push in or pull out feature's stuff.
    if (tabs.length) {
        // return platform.tabs.sendMessage(tabs[0].id, data)
        return promisify(
            platform.tabs,
            'sendMessage',
            tabs[0].id,
            {
                type: 'MY_DARLING_CORE_PLEASE_SWITCH_THE_FEATURE',
                data
            }
        )
        // return sendMessage(tabs, {
        //     type: 'SWITCH_FEATURE',
        //     data
        // })
    }
}

/**
 * Отправляет сообщение открытой вкладке с игрой
 * Возвращает: Promise с ответом на сообщение
 */
// function sendMessage(tabs, data) {
//     return promisify(
//         platform.tabs,
//         'sendMessage', 
//         tabs[0].id,
//         data
//     )
// }


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
