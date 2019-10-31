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
            { id: 'silenced', title: 'Замолченные' },
            { id: 'party',    title: 'Групповые'   },
            { id: 'fight',    title: 'Боевые'      },
            { id: 'location', title: 'Общие'       },
            { id: 'brown',    title: 'Приватные'   },
            { id: 'clan',     title: 'Клановые'    },
            { id: 'alliance', title: 'Альянсовые'  },
            { id: 'system',   title: 'Системные'   }
        ]

        document
            .getElementById('chat_cut')
            .insertAdjacentHTML('afterend', chatCleanerMarkup)

        this.chatListeners('add')

        document
            .querySelector('.dragons-ui__chat-cleaner__main-button')
            .addEventListener('mousedown', () => {
                this.cleanChatMessages('all')
            })

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
        this.chatListeners('remove')
        $('.dragons-ui__chat-cleaner').remove()
    }

    chatListeners(action) {
        const chatNode = document.getElementById('chat_cut').parentNode
        switch (action) {
            case 'add':
                this.chatMouseEnterHandler = this.chatMouseEnter.bind(this)
                this.chatMouseLeaveHandler = this.chatMouseLeave.bind(this)
                this.chatMessagesObserver = new MutationObserver(() => {
                    this.setChatCleanerNodePosition('.dragons-ui__chat-cleaner')
                })
                this.chatMessagesObserver.observe(
                    document.getElementById('messages'),
                    { childList: true }
                )
                break

            case 'remove':
                this.chatMessagesObserver.disconnect()
                delete this.chatMessagesObserver
                break
        }
        chatNode[action + 'EventListener']('mouseenter', this.chatMouseEnterHandler)
        chatNode[action + 'EventListener']('mouseleave', this.chatMouseLeaveHandler)
    }

    cleanChatMessages(category) {
        const $oldMessages = category !== 'silenced'
            ? $(this.getOldMessages())
            : $('.ch_message.ch_silenced')
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
            case 'silenced':
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
    }

    getOldMessages() {
        const messages = Array.prototype.slice.call(document.querySelectorAll('.ch_message'))
        const serverTimeString = document.getElementById('clock').textContent
        let lastIndex = messages.length
        for (let i = messages.length - 1; i > -1; i--) {
            const messageTimeString = messages[i].querySelector('span').textContent
            const timeDifference = this.getTimeStringsDifference(serverTimeString, messageTimeString)
            if (timeDifference < 2) {
                lastIndex = i
            } else {
                break
            }
        }
        return messages.slice(0, lastIndex)
    }

    getTimeStringsDifference(serverTimeString, messageTimeString) {
        let [serverTime, messageTime] = [...arguments].map(timeString => {
            const timeArray = timeString.split(':').map(item => +item)
            return timeArray[0] * 3600 + timeArray[1] * 60 + timeArray[2]
        })
        return serverTime - messageTime
    }

    chatMouseEnter(event) {
        const chatCleanerNode = event.target.querySelector('.dragons-ui__chat-cleaner')
        this.setChatCleanerNodePosition(chatCleanerNode)
        chatCleanerNode.classList.add('dragons-ui__chat-cleaner_visible')
    }

    chatMouseLeave(event) {
        event.target
            .querySelector('.dragons-ui__chat-cleaner')
            .classList.remove('dragons-ui__chat-cleaner_visible')
    }

    setChatCleanerNodePosition(node) {
        $(node).css({
            right: $('#chat_cut').height() < $('#mess_bg').height()
                ? this.getScrollbarWidth() + 5 + 'px'
                : ''
        })
    }
})