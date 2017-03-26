# Настройка сервера для запуска сайта
## Платформы и технологии
Пятая версия сайта написана на платформе Node.js, что, при желании, позволяет запускать его на любой операционной системе.

Данный документ подразумевает, что в продакшен среде используется ОС Debian Linux версии 8.

## Компоненты
Этапы настройки сервера представлены установкой и настройкой следующих компонент:

- [Пользователь](#user)
- [FTP](#ftp)
- [База данных](#db)
- [Node.js и npm](#node)
- [Сайт](#site)
- [Менеджер процессов](#pm2)
- [Web-сервер](#nginx)
- [SSL сертификат](#ssl)

### <a name='user'></a> Пользователь
Логином пользователя определим `psycho`. 
Для создания пользователя необходимо выполнить команды:
```
adduser psycho

# установка sudo
apt-get install sudo

# добавление нового пользователя в группу sudo
usermod -aG sudo psycho
```

### <a name='ftp'></a> FTP
Используется vsftpd.

Установка сервера: 
```
sudo apt-get install vsftpd
```
*После назначения домена и получения SSL-сертификата настоятельно рекомендуется активировать протокол SSL для FTP.*

### <a name='db'></a> База данных
Используется PostgreSQL.

Установка: 
```
sudo apt-get install postgresql-9.4
```

После установки необходимо задать пользователю `postgres` пароль:
```
# запуск psql
sudo -u postgres psql

# установка пароля
alter user postgres password 'password';

# выход из psql
\q
```

*Конфигурация сервера подразумевает, что на нём будет работать только psycho, подключаться к БД по сети будет нельзя и поэтому для работы можно использовать пользователя `postgres` с аутентификацией через `localhost`.*

Теперь необходимо создать БД сайта и восстановить данные из бэкапа (который должен быть предварительно загружен), для этого:
```
# запуск psql
psql -U postgres -h localhost

# создаём БД `psycho5` в psql
CREATE DATABASE psycho5;

# выход из psql
\q

# восстановление БД из дампа
pg_restore -F c -h localhost -d psycho5 -U postgres -cvO [файл с дампом БД]
```
*Для создания дампов можно использовать команду:*
```
pg_dump --file=[файл с дампом] -F c -U postgres -h localhost -Ccv psycho5
```

### <a name='node'></a> Node.js и npm
Для установки может потребоваться `curl`:
```
sudo apt-get install curl
```
Инструкцию по инсталляции можно найти [на сайте](https://nodejs.org) программы. [Актуальная версия](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions) на 30.01.17.

### <a name="site"></a> Сайт
Прежде всего необходимо установить переменную окружения `NODE_ENV` в для Node.js.  
Для этого в файл `/etc/profile.d/nodejs.sh` необходимо добавить строки:  
```
NODE_ENV=production  
export NODE_ENV
```
Для применения настроек нужно выйти из сессии и снова войти.

Далее в домашней папке необходимо распаковать предварительно созданный и загруженный релизный билд сайта:
```
tar xvf psycho.ru.tar
```
После необходимо задать оставшиеся переменные окружения.

### <a name='pm2'></a> Менеджер процессов
Используется pm2.
```
sudo npm i -g pm2
```
После установки необходимо [настроить автозапуск](http://pm2.keymetrics.io/docs/usage/startup).

После настройки автозапуска необходимо запустить сайт и сохранить состояние pm2 для автоматического восстановления после перезагрузки:
```
# выполняется из папки с сайтом
pm2 start main.js --name=psycho.ru
pm2 save
```

### <a name="nginx"></a> Web–сервер
Используется nginx.

Инструкцию по установке можно найти [на сайте](https://nginx.org/ru) программы. [Актуальная версия](https://nginx.org/ru/linux_packages.html) на 30.01.17.

После установки, необходимо настроить прокси для pm2 и параметры сервера в `/etc/nginx/conf.d/default.conf`.  
Пример:
```
server {
    listen 80;
    server_name psycho.ru;

    location / {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_max_temp_file_size 0;
        proxy_pass http://localhost:8105;
        proxy_redirect off;
        proxy_read_timeout 240s;
    }
}

```
После необходимо проверить корректность конфигурации nginx и перезапустить сервер.

Опционально можно настроить в nginx сжатие. Пример конфигурации `gzip` для файла `/etc/nginx/nginx.conf`:
```
gzip  on;
gzip_comp_level 6;
gzip_vary on;
gzip_min_length  1000;
gzip_proxied any;
gzip_types
    application/atom+xml
    application/javascript
    application/json
    application/rss+xml
    application/vnd.ms-fontobject
    application/x-font-ttf
    application/x-web-app-manifest+json
    application/xhtml+xml
    application/xml
    font/opentype
    image/svg+xml
    image/x-icon
    text/css
    text/plain
    text/x-component;
gzip_buffers 16 8k;
```
Если всё сделано правильно сайт должен стать доступным.

### <a name="ssl"></a> SSL–сертификат
Используется [Let's Encrypt](https://letsencrypt.org/).

Подробные инструкции по получению и установке сертификата находятся на сайте.

*Важно! Сертификататы Let's Encrypt выдаются на 3 месяца. Администратор сервера
должен сам решить вопрос их автоматического обновления. Для обновления сертификата
вручную можно воспользоваться командой:*
```
certbot renew --pre-hook "service nginx stop" --post-hook "service nginx start"
```

После получения сертификата необходимо изменить конфигурацию nginx, а именно 
файл `/etc/nginx/conf.d/default.conf`. Пример конфигурации:
```
server {
    listen       80;
    server_name  psycho.ru;
    return 301 https://$host$request_uri;
}

server {
    listen 443;
    server_name psycho.ru;

    ssl on;
    # Use certificate and key provided by Let's Encrypt:
    ssl_certificate /etc/letsencrypt/live/psycho.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/psycho.ru/privkey.pem;
    ssl_session_timeout 5m;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH';

    location / {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_max_temp_file_size 0;
        proxy_pass http://localhost:8105;
        proxy_redirect off;
        proxy_read_timeout 240s;
    }
}
```
