const DragonsUI = new class {
    Feature = class {
        systemMessage(message) {
            C.cmd('systemMessage', { message, timestamp: Date.now() / 1000 })
        }
    }
}

// This condition must be running in the content script. Then run all enabled features.
// switch (document.readyState) {
//     case 'complete':
//         DragonsUI.init()
//         break
//     default:
//         window.addEventListener('load', DragonsUI.init)
//         break
// }