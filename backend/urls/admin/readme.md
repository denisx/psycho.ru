# Модуль редактора статей
Url путь модуля `/admin`.
## Структура
### /controllers
Содержит в себе `.js` файлы отвечающие за главную логику модуля
### /libs
Вспомогательные `.js` файлы
##### boostrapPaginator.js
Хелпер пререндера пагинации. 
##### passport.js
Хелпер для проверки username & password, вернёт ошибку или сериализованный массив с данными пользователя(администратора)
### /views
Содержит в себе `.html` файлы отображения
## Особенности
Для правильной работы модуля в папке [/frontend/js/admin](/frontend/js/admin) содержится плагин **tinymce** v.4.5.3, 
a также
[/frontend/css/bootstrap.min.css](/frontend/css/bootstrap.min.css)  
[/frontend/css/bundle-admin.css](/frontend/css/bundle-admin.css)  
[/frontend/js/bootstrap.min.js](/frontend/js/bootstrap.min.js)  