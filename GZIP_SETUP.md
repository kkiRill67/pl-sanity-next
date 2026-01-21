# Gzip Compression Setup Guide

Этот документ описывает как настроить и проверить сжатие Gzip в Nginx для вашего Next.js проекта.

## 📋 Обновлённая конфигурация

### Основные улучшения Gzip

**Старая конфигурация:**
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types
    text/plain
    text/css
    text/xml
    text/javascript
    application/javascript
    application/xml+rss
    application/json
    font/woff
    font/woff2
    image/svg+xml;
```

**Новая конфигурация (optimized):**
```nginx
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_min_length 256;
gzip_buffers 16 8k;
gzip_http_version 1.1;
gzip_types
    # Text types
    text/plain
    text/css
    text/xml
    text/javascript
    text/json
    text/x-component
    text/html
    # Application types
    application/javascript
    application/x-javascript
    application/json
    application/xml
    application/xml+rss
    application/vnd.ms-fontobject
    application/font-woff
    application/font-woff2
    # Font types
    font/truetype
    font/otf
    font/x-woff
    font/eot
    # Image types
    image/svg+xml
    image/x-icon
    image/bmp
    image/gif
    image/jpeg
    image/jpg
    image/png
    image/webp
    # Media and binary types
    application/wasm
    application/octet-stream
    audio/mpeg
    video/mp4
    video/quicktime
    video/webm
    video/x-msvideo;
gzip_disable "msie6";
```

## 🚀 Применение обновлённой конфигурации

### Вариант 1: Использовать оптимизированный конфиг (рекомендуется)

```bash
# 1. Скопируйте оптимизированный конфиг
sudo cp nginx-optimized.conf /etc/nginx/conf.d/default.conf

# 2. Замените домен на ваш (редактируйте файл)
sudo nano /etc/nginx/conf.d/default.conf
# Замените all "your-domain.com" на ваш реальный домен

# 3. Проверьте конфигурацию
sudo nginx -t

# 4. Перезагрузите Nginx
sudo systemctl reload nginx
```

### Вариант 2: Обновить существующий конфиг

```bash
# Если используете nginx-simple.conf
sudo cp nginx-simple.conf /etc/nginx/conf.d/default.conf

# Или если используете nginx.conf
sudo cp nginx.conf /etc/nginx/conf.d/default.conf

# Замените домен
sudo nano /etc/nginx/conf.d/default.conf

# Проверьте и перезагрузите
sudo nginx -t
sudo systemctl reload nginx
```

### Вариант 3: Использовать скрипт настройки

```bash
# Запустите скрипт с вашим доменом
sudo ./setup-nginx.sh
# Введите ваш домен при запросе

# Скрипт автоматически установит Nginx и применит конфигурацию
```

## 🔍 Тестирование Gzip

### Используйте созданный скрипт:

```bash
# Сделайте скрипт исполняемым
chmod +x test-gzip.sh

# Запустите тест (замените на ваш домен)
./test-gzip.sh your-domain.com
```

### Ручное тестирование:

#### 1. Проверка через curl

```bash
# Тест с gzip сжатием
curl -H "Accept-Encoding: gzip" -I https://your-domain.com/

# Ожидаемый результат:
# Content-Encoding: gzip

# Размер до и после сжатия
# Без сжатия:
curl -H "Accept-Encoding: identity" -w "%{size_download}\n" -o /dev/null https://your-domain.com/

# С gzip:
curl -H "Accept-Encoding: gzip" -w "%{size_download}\n" -o /dev/null https://your-domain.com/
```

#### 2. Проверка через браузер (DevTools)

1. Откройте DevTools (F12)
2. Вкладка "Network"
3. Обновите страницу
4. Выберите любой запрос
5. Смотрите заголовки:
   - `Content-Encoding: gzip` - сжатие активно
   - `Content-Type` - тип контента

#### 3. Проверка через онлайн сервисы

- [GIDZipTest](https://www.giftofspeed.com/gzip-test/)
- [Check Gzip Compression](https://www.giftofspeed.com/gzip-test/)
- [PageSpeed Insights](https://pagespeed.web.dev/)

## 📊 Ожидаемые результаты

### Процент сжатия (примерно)

| Тип файла | Оригинальный размер | После gzip | Сжатие |
|-----------|---------------------|------------|--------|
| HTML      | 100 KB             | 15-20 KB   | 80-85% |
| CSS       | 50 KB              | 8-12 KB    | 75-80% |
| JS        | 200 KB             | 40-60 KB   | 70-80% |
| JSON      | 50 KB              | 10-15 KB   | 70-80% |
| SVG       | 20 KB              | 4-6 KB     | 75-85% |

### Типичный ответ заголовков с gzip

```
HTTP/2 200
content-type: text/html; charset=utf-8
content-encoding: gzip
vary: Accept-Encoding
cache-control: public, immutable
expires: ...
```

## ⚙️ Настройка для Docker

### Обновление docker-compose-with-nginx.yml

```yaml
version: "3.8"

services:
  nginx:
    image: nginx:alpine
    container_name: nginx-proxy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx-optimized.conf:/etc/nginx/conf.d/default.conf:ro
      - ./ssl:/etc/ssl:ro
      - ./nginx-logs:/var/log/nginx
    depends_on:
      - app
    networks:
      - app-network
```

### Проверка в Docker

```bash
# 1. Обновите конфиг
cp nginx-optimized.conf nginx.conf

# 2. Перезапустите контейнеры
docker-compose -f docker-compose-with-nginx.yml down
docker-compose -f docker-compose-with-nginx.yml up -d

# 3. Проверьте логи
docker-compose -f docker-compose-with-nginx.yml logs -f nginx

# 4. Протестируйте
./test-gzip.sh your-domain.com
```

## 🎛️ Параметры Gzip

### gzip_comp_level (1-9)

- **1-2**: Быстрое сжатие, низкая степень (для development)
- **3-5**: Сбалансированное (рекомендуется для production)
- **6-9**: Медленное, высокая степень (для статических файлов)

**Рекомендация**: `6` - оптимальный баланс

### gzip_min_length

- **256**: Минимальный размер для сжатия (байты)
- Меньше - сжимать всё
- Больше - экономия CPU на маленьких файлах

### gzip_proxied

- **any**: Сжимает все ответы через прокси
- Подходит для Next.js (proxy to https://bodymetrics.ru)

### gzip_vary

- **on**: Добавляет заголовок Vary: Accept-Encoding
- Важно для кэширования

## 🐛 Устранение проблем

### Проблема 1: Gzip не работает

```bash
# Проверьте конфигурацию
sudo nginx -t

# Проверьте логи
sudo tail -f /var/log/nginx/error.log

# Убедитесь, что заголовки установлены
curl -I -H "Accept-Encoding: gzip" https://your-domain.com/
```

### Проблема 2: Сервер не загружает новый конфиг

```bash
# Проверьте статус
sudo systemctl status nginx

# Перезагрузите
sudo systemctl reload nginx

# Если не помогло, перезапустите
sudo systemctl restart nginx
```

### Проблема 3: Сайт не работает после изменений

```bash
# Проверьте конфиг
sudo nginx -t

# Если есть ошибки, верните предыдущую версию
sudo cp /etc/nginx/conf.d/default.conf.bak /etc/nginx/conf.d/default.conf

# Перезагрузите
sudo systemctl reload nginx
```

### Проблема 4: Gzip не работает для определённых типов файлов

```nginx
# Убедитесь, что тип файла указан в gzip_types
gzip_types text/plain text/css application/json;

# Проверьте Content-Type заголовок от Next.js
curl -I https://your-domain.com/your-file.css
```

## 📈 Производительность

### Тест производительности

```bash
# Используйте Apache Bench для теста
ab -n 1000 -c 10 https://your-domain.com/

# Или curl для измерения времени
time curl -s -H "Accept-Encoding: gzip" https://your-domain.com/ > /dev/null
```

### Ожидаемые улучшения

- **Скорость загрузки**: 40-80% быстрее для текстовых файлов
- **Трафик**: 60-85% меньше трафика
- **Пользовательский опыт**: Быстрая загрузка страниц

## 🔧 Автоматизация

### Cron для проверки

```bash
# Добавить в crontab для ежедневной проверки
0 2 * * * /path/to/your/project/test-gzip.sh your-domain.com > /var/log/gzip-check.log
```

### Скрипт обновления

```bash
#!/bin/bash
# update-nginx.sh

DOMAIN=$1

# Копируем оптимизированный конфиг
sudo cp nginx-optimized.conf /etc/nginx/conf.d/default.conf

# Заменяем домен
sudo sed -i "s/your-domain.com/$DOMAIN/g" /etc/nginx/conf.d/default.conf

# Проверяем
if sudo nginx -t; then
    sudo systemctl reload nginx
    echo "✅ Nginx обновлён успешно"
else
    echo "❌ Ошибка в конфигурации"
    exit 1
fi
```

## 📝 Чек-лист

- [ ] Конфигурация скопирована в /etc/nginx/conf.d/
- [ ] Домен заменён на реальный
- [ ] SSL сертификат установлен
- [ ] `sudo nginx -t` показывает "successful"
- [ ] Nginx перезагружен (`sudo systemctl reload nginx`)
- [ ] Проверка через curl показывает `Content-Encoding: gzip`
- [ ] Тест скрипт проходит успешно
- [ ] Страница загружается корректно
- [ ] Статические файлы кэшируются
- [ ] Логи чистые (без ошибок)

## 📚 Дополнительные ресурсы

- [Nginx Gzip Documentation](https://nginx.org/en/docs/http/ngx_http_gzip_module.html)
- [Brotli Compression](https://github.com/google/ngx_brotli)
- [Web Performance Best Practices](https://web.dev/fast/)

## 🎯 Рекомендации для Production

1. **Всегда используйте оптимизированный конфиг** (nginx-optimized.conf)
2. **Настройте кэширование** для статических файлов
3. **Используйте HTTP/2** (уже включено в конфиге)
4. **Установите SSL сертификат** (Let's Encrypt или другой)
5. **Мониторьте логи** для проверки производительности
6. **Регулярно тестируйте** с помощью test-gzip.sh
7. **Обновляйте Nginx** до последней версии

---

**Последнее обновление**: Январь 2026  
**Версия**: 2.0
