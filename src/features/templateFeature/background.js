/**
 * Этот скрипт запускается при включении (install) и выключении (uninstall) фичи в
 * popup расширения или его настройках в контексте background-скриптов.
 * 
 * Доступен browser api для background-скриптов.
 * 
 * Свойство this в методах указывает на инстанс класса Background.
 */
export default {
    install() {
        this.test() // Вызовет метод test класса Background.
    },
    uninstall() { }
}