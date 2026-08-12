# Yandex Pet Day

Интерактивный одностраничный лендинг конференции Yandex Pet Day о digital-продуктах и технологиях в сфере зообизнеса.

Это учебный проект по работе с AI и Codex. Он демонстрирует разработку адаптивного лендинга, геометрических CSS-иллюстраций, форм с проверкой полей и декоративных pet-tech микровзаимодействий.

> Неофициальный учебный концепт. Проект не является официальным сайтом или продуктом Яндекса.

## Технологии

- HTML5;
- CSS3, адаптивная вёрстка и CSS-анимации;
- JavaScript без тяжёлых библиотек;
- Vite 8;
- GitHub Actions и GitHub Pages.

## Локальный запуск

Требуется Node.js 22 или новее.

```bash
npm install
npm run dev
```

После запуска откройте адрес, который покажет Vite, обычно `http://localhost:5173/yandex-pet-day/`.

Проверка production-сборки:

```bash
npm run build
npm run preview
```

Готовые файлы создаются в папке `dist`.

## GitHub Pages

Будущий адрес публикации:

`https://USERNAME.github.io/yandex-pet-day/`

После загрузки проекта в репозиторий `yandex-pet-day`:

1. Убедитесь, что файлы находятся в ветке `main`.
2. Откройте **Settings → Pages**.
3. В разделе **Build and deployment** выберите **GitHub Actions**.
4. Workflow `.github/workflows/deploy.yml` автоматически соберёт и опубликует содержимое `dist`.

## Структура проекта

- `index.html` — разметка и контент страницы;
- `src/main.js` — интерактивность и проверка форм;
- `src/styles.css` — визуальная система, адаптивность и анимации;
- `public/og.png` — изображение для социального превью;
- `vite.config.js` — конфигурация сборки с базовым путём GitHub Pages;
- `.github/workflows/deploy.yml` — автоматическая публикация GitHub Pages.
