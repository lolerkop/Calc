# Управление индексацией сайта CALC.IT

## 🚫 Текущий статус: ИНДЕКСАЦИЯ ОТКЛЮЧЕНА

Сайт временно закрыт для индексирования поисковыми системами.

### Что сделано для блокировки индексации:

1. **robots.txt** - установлен `Disallow: /` для всех ботов
2. **Мета-тег robots** - добавлен `noindex, nofollow` на все страницы  
3. **sitemap.xml** - переименован в `sitemap.xml.disabled`

---

## ✅ Как ВКЛЮЧИТЬ индексацию (когда будет готово):

### 1. Обновить robots.txt
```bash
# Заменить содержимое /app/frontend/public/robots.txt на:
User-agent: *
Allow: /

# Sitemap
Sitemap: https://calcit-suite.preview.emergentagent.com/sitemap.xml

# Allow specific search bots
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Yandexbot
Allow: /

# Crawl delay to be respectful
Crawl-delay: 1
```

### 2. Обновить мета-тег в index.html
```bash
# В файле /app/frontend/public/index.html изменить:
<meta name="robots" content="noindex, nofollow" />
# На:
<meta name="robots" content="index, follow" />
```

### 3. Восстановить sitemap.xml
```bash
mv /app/frontend/public/sitemap.xml.disabled /app/frontend/public/sitemap.xml
```

### 4. Обновить SEOHead компонент
```bash
# В файле /app/frontend/src/components/SEOHead.jsx изменить:
noindex = true
# На:
noindex = false
```

### 5. Перезапустить фронтенд
```bash
sudo supervisorctl restart frontend
```

---

## 🔍 Проверка статуса индексации:

### Проверить robots.txt:
```bash
curl http://localhost:3000/robots.txt
```

### Проверить мета-теги:
```bash
curl -s "http://localhost:3000" | grep -i "robots"
```

### Проверить sitemap.xml:
```bash
curl http://localhost:3000/sitemap.xml
```

---

## 📋 После включения индексации рекомендуется:

1. **Google Search Console** - добавить сайт и отправить sitemap
2. **Yandex.Webmaster** - зарегистрировать сайт и отправить sitemap  
3. **Bing Webmaster Tools** - добавить сайт
4. **Мониторинг** - отслеживать индексацию страниц

---

*Файл создан: $(date)*