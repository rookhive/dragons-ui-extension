/**
 * Этот скрипт был внедрён в страницу игры тэгом <script>.
 * 
 * Метод install запускается при включении фичи в popup расширения или настройках.
 * 
 * Метод uninstall должен очистить все side-effects, созданные методом install, и
 * запускается при выключении фичи.
 * 
 * DragonsUIObserver.Feature имеет следующие методы:
 *     void systemMessage(string message) - Отправляет системку в чат юзера.
 */
DragonsUI.register('templateFeature', class extends DragonsUI.Feature {
    install() {}
    uninstall() {}
})