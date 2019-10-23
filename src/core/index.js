import platform from '../platform'
import Injector from './injector'

const injector = new Injector()

// Receives messages from background script
platform.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    switch (request.type) {
        case 'SWITCH_FEATURE':
            injector.analyse(request.data)
            return true
    }
})

// Injects all enabled in popup.html features
// Injector.inject(['first feature', 'second feature'])

/**
 * Fetch list of enabled content scripts from localStorage.
 * Pass them to initial load handler.
 */
/*
window.addEventListener('load', (contentScripts => {
    const platform = typeof chrome !== 'undefined' ? chrome : browser
    contentScripts.forEach(scriptName => {
        const url = platform.runtime.getURL(`js/${scriptName}.js`)
        let script = document.createElement('script')
        script.setAttribute('src', url)
        document.head.appendChild(script)
    })
})(['adventuresTimerFix']))
*/