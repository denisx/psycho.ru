# Настройка сервера для запуска сайта
## Платформы и технологии
Пятая версия сайта написана на платформе Node.js, что, при желании, позволяет запускать его на любой операционной системе.

Данный документ подразумевает, что в продакшен среде используется ОС Debian Linux версии 8.
## Компоненты
Этапы настройки сервера представлены установкой и настройкой следующих компонент:

- Пользователь
- FTP
- База данных
- Web-сервер
- Node.js и npm
- Менеджер процессов
- Развертывание сайта
- Мониторинг
### Пользователь
Логин: `psycho`.  
`adduser psycho` — создание
### FTP


pg_dump --file=psycho5.sqlc --format=c --username=pnbdev --host=176.112.200.249 --verbose psycho5

pg_restore.exe -F c -c -d psycho5 -v -h 127.0.0.1 -U postgres c:\coding\DBDumps\psycho5.sqlc

certbot renew --pre-hook "service nginx stop" --post-hook "service nginx start"
