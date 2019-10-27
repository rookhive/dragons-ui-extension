export default {
    // Идентификатор фичи
    name: 'templateFeature',
    // Описание фичи
    title: 'Супер-фича, позволяющая делать просто нереальные вещи!',
    // Файлы фичи
    files: {
        // Запускаемые в контексте background-скриптов.
        // Доступ ко всему browser api. В частности, фишкам
        // вроде browser.webRequest и т.д.
        background: true,
        // Запускаемые в контексте content-скриптов.
        // Доступ ко всему browser api, доступному content-scripts.
        content: true,
        // Внедряемые на страницу, для которой пишется расширение,
        // посредством тэга <script> (или <link> для css).
        inject: {
            js: true,
            css: true
        }
    }
}