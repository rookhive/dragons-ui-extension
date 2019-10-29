DragonsUI.register('chatCleaner', class extends DragonsUI.Feature {
    install() {
        const chatCleanerMarkup =
            `<div class="dragons-ui__chat-cleaner">
                <div class="dragons-ui__chat-cleaner__arrow">
                    <i><span></span><span></span><span></span></i>
                    <div class="dragons-ui__chat-cleaner__flyout">
                        <ul class="dragons-ui__chat-cleaner__flyout-content"></ul>
                    </div>
                </div>
                <div class="dragons-ui__chat-cleaner__main-button">Очистить</div>
            </div>`

        const itemsLib = [
            { id: 'group',    title: 'Групповые'  },
            { id: 'fight',    title: 'Боевые'     },
            { id: 'location', title: 'Общие'      },
            { id: 'brown',    title: 'Приватные'  },
            { id: 'clan',     title: 'Клановые'   },
            { id: 'alliance', title: 'Альянсовые' },
            { id: 'system',   title: 'Системные'  }
        ]

        document
            .getElementById('chat_cut')
            .insertAdjacentHTML('afterend', chatCleanerMarkup)

        document
            .querySelector('.dragons-ui__chat-cleaner__main-button')
            .addEventListener('mousedown', () => { this.cleanChatMessages('all') })

        itemsLib.forEach(item => {
            const itemNode = document.createElement('li')
            itemNode.className = `dragons-ui__chat-cleaner__flyout-item dragons-ui__chat-cleaner__flyout-item_${item.id}`
            itemNode.textContent = item.title
            itemNode.addEventListener('mousedown', () => {
                this.cleanChatMessages(item.id)
            })
            document.querySelector('.dragons-ui__chat-cleaner__flyout-content').appendChild(itemNode)
        })
    }

    uninstall() {
        $('.dragons-ui__chat-cleaner').remove()
    }

    cleanChatMessages(category) {
        const $oldMessages = this.getOldMessages()
        switch(category) {
            case 'system':
                $oldMessages.each(function () {
                    const $message = $(this)
                    const messageType = $message.find("span.bold").text()
                    if (
                        $message.find('span.dred').length
                        && $message.find('span.bold').length
                        && $message.text().includes('Системное')
                        || messageType === 'Объявление'
                        || messageType == 'Информация'
                        || $message.find('span').eq(2).text() === 'Глашатай'
                    ) $message.remove()
                })
                break

            case 'all':
                console.log('Удаляем все старые сообщения чата.')
                $oldMessages.each(function () {
                    this.remove()
                })
                break

            default:
                $oldMessages.each(function () {
                    const $message = $(this)
                    if ($message.find('span:nth-child(2)').attr('class') === (category === 'brown' ? category : `ch_${category}`))
                        $message.remove()
                })
                break
        }
        // this.setChatCleanerNodePosition()
    }

    // setChatCleanerNodePosition() {
    //     $('.dragons-ui__chat-cleaner').css({
    //         right: $('#chat_cut').height() < $('#messages').height()
    //             ? 20
    //             : 5
    //     })
    // }

    // Проверяем последнее сообщение в #messages. Если оно получено ранее, чем
    // секунду назад, то завершаем цикл и удаляем все сообщения остальные. Если
    // нет, то проверяем следующее. И так далее, пока не наткнёмся на сообщение,
    // полученное ранее, чем секунду назад. Тогда удаляем его и все более ранние
    // сообщения.
    getOldMessages() {
        return $(".ch_message")
    }
})