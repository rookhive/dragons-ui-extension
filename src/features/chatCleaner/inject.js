DragonsUIObserver.register('chatCleaner', class extends DragonsUIObserver.Feature {
    init() {
        console.log('Уборщик чата загружен')
    }

    dropSideEffects() {
        console.log('Уборщик чата прибрался за собой')
    }
})