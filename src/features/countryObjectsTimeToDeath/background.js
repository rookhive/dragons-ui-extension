export default {
    install() {
        this.httpRequestHandler({
            mode: 'add',
            name: 'countryObjectsTimeToDeath',
            listener: this.listener,
            useDefaultHttpListener: true
        })
    },
    uninstall() {
        this.httpRequestHandler({
            mode: 'remove',
            name: 'countryObjectsTimeToDeath'
        })
    },

    listener(response) {
        try { response = JSON.parse(response) } catch (error) { return }
        if (
            !response
            || !response.process
            || !response.process.controller
            || response.process.controller === "Chat"
        ) return
        console.log('Получены данные:', response)
    }
}