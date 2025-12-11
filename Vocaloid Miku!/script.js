// Feature Flags Loader
/*--------------------------------------------*/
let myVibeMiku, kagamineRinStyle, fullscreenMikuXDStyle;

// --- БАЗОВАЯ ТЕМА ---
function applyDefaultTheme() {
    const root = document.documentElement;

    root.style.setProperty('--main-color', '#86cecb');
    root.style.setProperty('--light-main-color', '#AEFFFF');
    root.style.setProperty('--basic-color', '#137a7f');
    root.style.setProperty('--hatsune-light', '#bec8d1');
    root.style.setProperty('--font-color', '#373b3e');
    root.style.setProperty('--miku-color', '#e12885');

    kagamineRinStyle = 'http://127.0.0.1:2007/assets/Kagamine-Rin.webp?name=Vocaloid Miku!';
    fullscreenMikuXDStyle = 'http://127.0.0.1:2007/assets/fullscreen-miku-XD.png?name=Vocaloid Miku!';
    myVibeMiku = 'http://127.0.0.1:2007/assets/My-vibe.png?name=Vocaloid Miku!';

    let oldStyle = document.getElementById('dynamic-style');
    if (oldStyle) oldStyle.remove();

    const styleTag = document.createElement('style');
    styleTag.id = 'dynamic-style';
    styleTag.textContent = `
        :root {
            --main-color: ${getComputedStyle(root).getPropertyValue('--main-color')};
            --light-main-color: ${getComputedStyle(root).getPropertyValue('--light-main-color')};
            --basic-color: ${getComputedStyle(root).getPropertyValue('--basic-color')};
            --hatsune-light: ${getComputedStyle(root).getPropertyValue('--hatsune-light')};
            --font-color: ${getComputedStyle(root).getPropertyValue('--font-color')};
            --miku-color: ${getComputedStyle(root).getPropertyValue('--miku-color')};
        }

        .AssetsImages:before {
            content: url("${kagamineRinStyle}");
        }

        .AssetsImages:after {
            background-image: url("${fullscreenMikuXDStyle}");
        }
    `;
    document.head.appendChild(styleTag);
}

// --- ПРИМЕНЕНИЕ ТЕМЫ ИЗ JSON ---
async function applyTheme() {
    const themeTitleText = document.querySelector('.ThemeTitleText');
    if (!themeTitleText) return;

    try {
        const response = await fetch('https://github.com/Diramix/Vocaloid-Miku/releases/download/feature-flags/flags.json');
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const data = await response.json();

        window.applyStlTheme = data.style?.toLowerCase();
        const root = document.documentElement;

        // Сначала — базовая тема
        applyDefaultTheme();

        // Потом, если есть тематическая — меняем
        if (applyStlTheme === 'halloween') {
            themeTitleText.textContent = 'Miku-Miku Boo!';
            myVibeMiku = 'http://127.0.0.1:2007/assets/My-vibe-halloween.png?name=Vocaloid Miku!';
            kagamineRinStyle = 'http://127.0.0.1:2007/assets/Kagamine-Rin-Halloween.webp?name=Vocaloid Miku!';
            fullscreenMikuXDStyle = 'http://127.0.0.1:2007/assets/fullscreen-miku-XD-halloween.png?name=Vocaloid Miku!';

            root.style.setProperty('--main-color', '#E48742');
            root.style.setProperty('--light-main-color', '#FFCB63');
            root.style.setProperty('--basic-color', '#A75245');
            root.style.setProperty('--hatsune-light', '#ffae44');
            root.style.setProperty('--font-color', '#000009');
            root.style.setProperty('--miku-color', '#B556A6');
        }

        else if (applyStlTheme === 'christmas') {
            themeTitleText.textContent = 'Happy Miku Year!';
            myVibeMiku = 'http://127.0.0.1:2007/assets/My-vibe-Christmas.png?name=Vocaloid Miku!';
            kagamineRinStyle = 'http://127.0.0.1:2007/assets/Kagamine-Rin-Christmas.webp?name=Vocaloid Miku!';
            fullscreenMikuXDStyle = 'http://127.0.0.1:2007/assets/fullscreen-miku-XD-Christmas.png?name=Vocaloid Miku!';
        }

        else if (applyStlTheme === 'teto') {
            themeTitleText.textContent = 'Kasane Teto!';
            fullscreenMikuXDStyle = 'https://raw.githubusercontent.com/Diramix/Kasane-Teto/refs/heads/main/Kasane%20Teto!/assets/Fullscreen/fullscreen-miku-XD.png';
            myVibeMiku = 'https://raw.githubusercontent.com/Diramix/Kasane-Teto/refs/heads/main/Kasane%20Teto!/assets/MainPage/My-vibe.png';

            root.style.setProperty('--main-color', '#D46A83');
            root.style.setProperty('--light-main-color', '#FF9FC4');
            root.style.setProperty('--basic-color', '#854462');
            root.style.setProperty('--hatsune-light', '#0b0c0c');
            root.style.setProperty('--font-color', '#2A2433');
            root.style.setProperty('--miku-color', '#D46A83');
        }

        // Перезаписываем CSS после изменений
        let oldStyle = document.getElementById('dynamic-style');
        if (oldStyle) oldStyle.remove();

        const styleTag = document.createElement('style');
        styleTag.id = 'dynamic-style';
        styleTag.textContent = `
            :root {
                --main-color: ${getComputedStyle(root).getPropertyValue('--main-color')};
                --light-main-color: ${getComputedStyle(root).getPropertyValue('--light-main-color')};
                --basic-color: ${getComputedStyle(root).getPropertyValue('--basic-color')};
                --hatsune-light: ${getComputedStyle(root).getPropertyValue('--hatsune-light')};
                --font-color: ${getComputedStyle(root).getPropertyValue('--font-color')};
                --miku-color: ${getComputedStyle(root).getPropertyValue('--miku-color')};
            }

            .AssetsImages:before {
                content: url("${kagamineRinStyle}");
            }

            .AssetsImages:after {
                background-image: url("${fullscreenMikuXDStyle}");
            }
        `;
        document.head.appendChild(styleTag);

    } catch (err) {
        console.error('Ошибка при загрузке стилей:', err);
        // В случае ошибки всё равно ставим дефолт
        applyDefaultTheme();
    }
}

// --- Проверка, что страница загружена и элементы появились ---
function waitForThemeReady() {
    const checkInterval = setInterval(() => {
        const title = document.querySelector('.ThemeTitleText');
        if (title && document.head) {
            clearInterval(checkInterval);
            applyTheme().then(() => {
                console.log('🎨 The theme is successfully applied!');
            });
        }
    }, 300);
}

// Запуск
if (document.readyState === 'complete') {
    waitForThemeReady();
} else {
    window.addEventListener('load', waitForThemeReady);
}
/*--------------------------------------------*/

// Main setInterval
/*--------------------------------------------*/
setInterval(() => {
    updateBackgroundImage();
    updateVibeBackgroundImage();
    coverAndAssetsImagesElements();
}, 300);
/*--------------------------------------------*/

// Скрипт для смены темы
/*--------------------------------------------*/
function yandexThemeUpdate() {
    const body = document.body;
    if (!body.classList.contains('ym-dark-theme') && !body.classList.contains('ym-light-theme')) {
        body.classList.add('ym-light-theme');
    } else if (body.classList.contains('ym-dark-theme')) {
        body.classList.replace('ym-dark-theme', 'ym-light-theme');
    }
};
yandexThemeUpdate();
/*--------------------------------------------*/

// Change fullscreen player background image script
/*--------------------------------------------*/
function updateBackgroundImage() {
    const imgElements = document.querySelectorAll('[class*="FullscreenPlayerDesktopPoster_cover"]');
    let imgBackground = "";

    imgElements.forEach(img => {
        if (img.src && img.src.includes('/400x400')) {
            imgBackground = img.src.replace('/400x400', '/1000x1000');
        }
    });

    if (imgBackground) {
        const newBackgroundWithGradient = `linear-gradient(180deg, rgba(0, 0, 0, 0.30) 0%, rgba(0, 0, 0, 0.75) 100%), url(${imgBackground}) center center / cover no-repeat`;
        const normalNewBackground = `url(${imgBackground}) center center / cover no-repeat`;

        const img = new Image();
        img.src = imgBackground;

        img.onload = () => {
            const elementsWithGradient = [
                '.FullscreenPlayerDesktop_modalContent__Zs_LC'
            ];

            const elementsWithoutGradient = [
                '.Diva-Cover',
                '.CoverImage'
            ];

            elementsWithGradient.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    element.style.background = newBackgroundWithGradient;
                }
            });

            elementsWithoutGradient.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    element.style.background = normalNewBackground;
                }
            });
        };
    }
};
/*--------------------------------------------*/

// Change vibe block background image script
/*--------------------------------------------*/
function updateVibeBackgroundImage() {
    const imgElements = document.querySelectorAll('[class*="PlayerBarDesktopWithBackgroundProgressBar_cover"]');
    let imgBackground = "";

    imgElements.forEach(img => {
        if (img.src && img.src.includes('/100x100')) {
            imgBackground = img.src.replace('/100x100', '/1000x1000');
        }
    });

    const targetElement = document.querySelector('.MainPage_vibe__XEBbh');
    if (targetElement && isElementInViewport(targetElement)) {
        targetElement.style.position = 'relative';
        targetElement.style.overflow = 'hidden';

        let blurElement = targetElement.querySelector('.blur-element');
        if (!blurElement) {
            blurElement = document.createElement('div');
            blurElement.classList.add('blur-element');
            blurElement.style.position = 'absolute';
            blurElement.style.top = 0;
            blurElement.style.left = 0;
            blurElement.style.width = '100%';
            blurElement.style.height = '100%';
            blurElement.style.backgroundColor = '#26F4FE';
            blurElement.style.filter = 'blur(0px) brightness(0.5)';
            blurElement.style.zIndex = '0';
            targetElement.appendChild(blurElement);
        }

        if (blurElement.style.background !== `url(${imgBackground}) center center / cover no-repeat`) {
            blurElement.style.background = `url(${imgBackground}) center center / cover no-repeat`;
        }

        let myVibeMikuElement = targetElement.querySelector('.additional-image-element');
        if (!myVibeMikuElement) {
            myVibeMikuElement = document.createElement('div');
            myVibeMikuElement.classList.add('additional-image-element');
            myVibeMikuElement.style.position = 'absolute';
            myVibeMikuElement.style.top = 0;
            myVibeMikuElement.style.left = 0;
            myVibeMikuElement.style.width = '100%';
            myVibeMikuElement.style.height = '100%';
            myVibeMikuElement.style.background = `url("${myVibeMiku}") center center / cover no-repeat`;
            myVibeMikuElement.style.borderRadius = '10px';
            myVibeMikuElement.style.pointerEvents = 'none';
            myVibeMikuElement.style.zIndex = '2';
            myVibeMikuElement.style.imageRendering = 'crisp-edges';
            targetElement.appendChild(myVibeMikuElement);
        }

        const childElements = targetElement.querySelectorAll(':scope > *:not(.additional-image-element):not(.blur-element)');
        childElements.forEach(child => {
            if (child.style.zIndex !== '3') {
                child.style.position = 'relative';
                child.style.zIndex = '3';
            }
        });
    }
}

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
}
/*--------------------------------------------*/

// CoverImage для исправления багов с обложкой в фуллскрине
// Элемент для отображения картинок в фуллскрине
/*--------------------------------------------*/
function coverAndAssetsImagesElements() {
    let container = document.querySelector('.FullscreenPlayerDesktopContent_root__tKNGK');

    if (container) {
        if (!container.querySelector('.CoverImage')) {
            let newElement = document.createElement('div');
            newElement.classList.add('CoverImage');
            container.appendChild(newElement);
        }

        if (!container.querySelector('.AssetsImages')) {
            let newElement = document.createElement('div');
            newElement.classList.add('AssetsImages');
            container.appendChild(newElement);
        }
    }
};
/*--------------------------------------------*/

// Скрипт для добавления элемента Diva Cover
/*--------------------------------------------*/
const observer = new MutationObserver(() => {
    ['Diva-Cover', 'Diva-Perfect-Mark'].forEach(className => {
        if (document.querySelector('.PlayButtonWithCover_coverImage__DhS1R') && !document.querySelector(`.${className}`)) {
            document.querySelector('[class*="PlayQueue_root"]')?.appendChild(Object.assign(document.createElement('div'), { className }));
        }
    });
});

observer.observe(document.body, { childList: true, subtree: true });
/*--------------------------------------------*/

// Vocaloid Miku!
/*--------------------------------------------*/
if (!document.querySelector('.ThemeTitleText')) {
    const themeTitleText = document.createElement('div');
    themeTitleText.className = 'ThemeTitleText';

    Object.assign(themeTitleText.style, {
        position: 'fixed',
        visibility: 'visible',
        fontFamily: '"Vocaloid", sans-serif',
        fontSize: '16px',
        fontWeight: '1000',
        left: '50%',
        marginLeft: '-66px',
        top: '10px',
        color: 'var(--main-color)',
        zIndex: '1'
    });

    themeTitleText.textContent = 'Vocaloid Miku!';
    document.body.appendChild(themeTitleText);
}
/*--------------------------------------------*/

// Скрипт для добавления элемента Miku-Run (Отключён в vm!-v1.8.0)
/*--------------------------------------------*/
// if (!document.querySelector('.mikuRun')) {
//     const newElement = document.createElement('div');
//     newElement.className = 'mikuRun';
//     document.body.appendChild(newElement);
// }
/*--------------------------------------------*/

/*Управление handleEvents.json*/
/*--------------------------------------------*/
let settings = {};

function log(text) {
    console.log('[Customizable LOG]: ', text)
}

async function getSettings() {
    try {
        const response = await fetch("http://127.0.0.1:2007/get_handle?name=Vocaloid Miku!");
        if (!response.ok) throw new Error(`Ошибка сети: ${response.status}`);
        const data = await response.json();
        if (!data?.data?.sections) {
            console.warn("Структура данных не соответствует ожидаемой.");
            return {};
        }
        return Object.fromEntries(data.data.sections.map(({ title, items }) => [
            title,
            Object.fromEntries(items.map(item => [
                item.id,
                item.bool ?? item.input ?? Object.fromEntries(item.buttons?.map(b => [b.name, b.text]) || [])
            ]))
        ]));
    } catch (error) {
        console.error("Ошибка при получении данных:", error);
        return {};
    }
}

let baseUrl = 'http://127.0.0.1:2007/assets/fullscreen-lyrics.png?name=Vocaloid Miku!'
let baseBlur = 0;

async function setSettings(newSettings) {
    // Кастом картинка в SyncLyrics
    const syncLyricsBackground = document.querySelector('[class*="SyncLyrics_root"]');
    let style = document.getElementById('sync-lyrics-style');
    if (!style) {
        style = document.createElement('style');
        style.id = 'sync-lyrics-style';
        document.head.appendChild(style);
    }

    function updateBackground(url) {
        if (url.startsWith('http://127.0.0.1:2007')) {
            if (style.textContent !== `[class*="SyncLyrics_root"] { background-image: url("${url}"); }`) {
                style.textContent = `[class*="SyncLyrics_root"] { background-image: url("${url}"); }`;
            }
        } else {
            if (style.textContent !== `[class*="SyncLyrics_root"] { background-image: url("https://images.weserv.nl/?url=${url}"); }`) {
                style.textContent = `[class*="SyncLyrics_root"] { background-image: url("https://images.weserv.nl/?url=${url}"); }`;
            }
        }
    }

    const newUrl = newSettings?.['SyncLyrics']?.backgroundUrl?.text || baseUrl;
    applyBackground = !!newSettings['SyncLyrics'].coverImage;

    if (applyBackground) {
        const checkBackground = setInterval(() => {
            const img = [...document.querySelectorAll('[class*="FullscreenPlayerDesktopPoster_cover"]')]
                .find(img => img.src && img.src.includes('/400x400'));

            if (img) {
                updateBackground(img.src.replace('/400x400', '/1000x1000'));
                clearInterval(checkBackground);
            }
        }, settingsDelay);
    } else {
        updateBackground(newUrl);
    }

    // Blur Filter
    let blurStyle = document.getElementById("blur-style");
    if (!blurStyle) {
        blurStyle = document.createElement("style");
        blurStyle.id = "blur-style";
        document.head.appendChild(blurStyle);
    }

    const newBlur = parseInt(newSettings['SyncLyrics'].blurFilter.text, 10) || 0;
    if (baseBlur !== newBlur) {
        baseBlur = newBlur;
        blurStyle.textContent = `[class*="SyncLyrics_root"]::after { backdrop-filter: blur(${baseBlur}px); content: ''; position: absolute; inset: 0; }`;
    }

    let combinedStyle = document.getElementById('combined-style');
    if (!combinedStyle) {
        combinedStyle = document.createElement('style');
        combinedStyle.id = 'combined-style';
        document.head.appendChild(combinedStyle);
    }

    combinedStyle.textContent = `
        .Diva-Perfect-Mark {
            display: ${newSettings['Очередь'].togglePerfectMark ? 'block' : 'none'} !important;
        }
    
        [class*="PlayQueue_content"] * [aria-label="Трек скачан"],
        [class*="PlayQueue_content"] * [aria-label="Этот трек можете слушать только вы"] {
            display: ${newSettings['Очередь'].toggleDownloadAndVisibleIcon ? 'block' : 'none'} !important;
        }
    
        .AssetsImages:after {
            display: ${newSettings['Fullscreen'].toggleFullscreenMikuXD ? 'block' : 'none'} !important;
        }

        /*Normal Font*/
        @font-face {
            font-family: "Montserrat";
            src: url("http://127.0.0.1:2007/assets/Montserrat.ttf?name=Vocaloid Miku!") format("truetype");
        }
        [class*="SyncLyricsLine_root"] {
            font-family: ${newSettings['SyncLyrics'].normalFont ? '"Montserrat", sans-serif' : ''};
            font-weight: ${newSettings['SyncLyrics'].normalFont ? '700' : ''};
            font-size: ${newSettings['SyncLyrics'].normalFont ? '35px' : ''};
        }
    `;

    // Auto Play
    if (newSettings['Developer'].devAutoPlayOnStart && !window.hasRun) {
        const tryClickPlay = () => {
            const playBtn = document.querySelector(`section.PlayerBar_root__cXUnU * [data-test-id="PLAY_BUTTON"]`);
            const pauseBtn = document.querySelector(`section.PlayerBar_root__cXUnU * [data-test-id="PAUSE_BUTTON"]`);
            if (pauseBtn) {
                window.hasRun = true;
                return;
            }
            if (playBtn) {
                playBtn.click();
                setTimeout(tryClickPlay, 200);
            }
        };
        tryClickPlay();
    }
}

async function update() {
    const newSettings = await getSettings();
    await setSettings(newSettings);
    settings = newSettings;
}

function init() {
    setInterval(() => {
        update();
    }, 1000);
}

init();
/*--------------------------------------------*/

// Отключение всегда расширенного плеер
/*--------------------------------------------*/
(() => {
    const targetClass = "modSettings_alwaysWideBar";

    function removeFrom(el) {
        if (!el || el.nodeType !== 1) return;
        if (el.classList && el.classList.contains(targetClass)) {
            el.classList.remove(targetClass);
            console.log("Удалён класс у:", el);
        }
    }

    function removeFromTree(root) {
        if (!root) return;
        if (root.nodeType === 1) removeFrom(root);
        root.querySelectorAll && root.querySelectorAll("." + targetClass).forEach(removeFrom);
    }

    document.addEventListener("DOMContentLoaded", () => {
        removeFromTree(document);
    });

    removeFromTree(document);

    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            if (m.type === "childList") {
                m.addedNodes.forEach(node => {
                    if (node.nodeType === 1) removeFromTree(node);
                });
            } else if (m.type === "attributes" && m.attributeName === "class") {
                removeFrom(m.target);
            }
        }
    });

    observer.observe(document.documentElement || document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class"]
    });

    const interval = setInterval(() => removeFromTree(document), 2000);
})();
/*--------------------------------------------*/

// Snowflakes
/*--------------------------------------------*/
(function () {
    const TARGET_SELECTOR = '[class*="DefaultLayout_root"]';
    const SNOW_ID = '___snow_background___';

    function ensureSnow(parentEl) {
        if (getComputedStyle(parentEl).position === 'static') {
            parentEl.style.position = 'relative';
        }

        // Проверка — есть ли снег
        let snowContainer = parentEl.querySelector('#' + SNOW_ID);

        if (!snowContainer && applyStlTheme === 'christmas') {
            // Создаём контейнер снега
            snowContainer = document.createElement('div');
            snowContainer.id = SNOW_ID;
            snowContainer.style.position = 'absolute';
            snowContainer.style.top = '0';
            snowContainer.style.left = '0';
            snowContainer.style.width = '100%';
            snowContainer.style.height = '100%';
            snowContainer.style.pointerEvents = 'none';
            snowContainer.style.zIndex = '0';
            snowContainer.style.overflow = 'hidden';

            parentEl.prepend(snowContainer);

            // Создаём canvas
            const canvas = document.createElement('canvas');
            snowContainer.appendChild(canvas);

            const ctx = canvas.getContext('2d');

            function resizeCanvas() {
                canvas.width = parentEl.clientWidth;
                canvas.height = parentEl.clientHeight;
            }
            resizeCanvas();

            let flakes = [];
            for (let i = 0; i < 150; i++) {
                flakes.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    r: Math.random() * 4 + 1,
                    vx: Math.random() * 0.7 + 0.3,
                    vy: Math.random() * 1.5 + 0.8
                });
            }

            function drawSnow() {
                // Если контейнер удалён — прекратить анимацию
                if (!parentEl.contains(snowContainer)) return;

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "white";
                ctx.beginPath();

                for (let f of flakes) {
                    ctx.moveTo(f.x, f.y);
                    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
                }

                ctx.fill();
                updateSnow();
            }

            function updateSnow() {
                for (let f of flakes) {
                    f.x += f.vx;
                    f.y += f.vy;

                    if (f.y > canvas.height || f.x > canvas.width) {
                        f.x = Math.random() * canvas.width;
                        f.y = -10;
                    }
                }
            }

            (function animate() {
                drawSnow();
                requestAnimationFrame(animate);
            })();

            window.addEventListener('resize', resizeCanvas);
        }
    }

    const observer = new MutationObserver(() => {
        const parentEl = document.querySelector(TARGET_SELECTOR);
        if (parentEl) {
            ensureSnow(parentEl);
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    const initial = document.querySelector(TARGET_SELECTOR);
    if (initial) ensureSnow(initial);

})();
/*--------------------------------------------*/