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
    const additionalImage = "http://127.0.0.1:2007/assets/My-vibe.png?name=Vocaloid Miku!";

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

        let additionalImageElement = targetElement.querySelector('.additional-image-element');
        if (!additionalImageElement) {
            additionalImageElement = document.createElement('div');
            additionalImageElement.classList.add('additional-image-element');
            additionalImageElement.style.position = 'absolute';
            additionalImageElement.style.top = 0;
            additionalImageElement.style.left = 0;
            additionalImageElement.style.width = '100%';
            additionalImageElement.style.height = '100%';
            additionalImageElement.style.background = `url("${additionalImage}") center center / cover no-repeat`;
            additionalImageElement.style.borderRadius = '10px';
            additionalImageElement.style.pointerEvents = 'none';
            additionalImageElement.style.zIndex = '2';
            additionalImageElement.style.imageRendering = 'crisp-edges';
            targetElement.appendChild(additionalImageElement);
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
            document.querySelector('.PlayQueue_root__ponhw')?.appendChild(Object.assign(document.createElement('div'), { className }));
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

// Возвращение иконки настроек качества трека
/*--------------------------------------------*/
const target = document.querySelector('[data-test-id="SOUND_QUALITY_BUTTON"] > span');

if (target) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "J9wTKytjOWG73QMoN5WP UwnL5AJBMMAp6NwMDdZk");
    svg.setAttribute("focusable", "false");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("style", "padding: var(--ym-icon-padding, 2px);");

    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#settings");

    svg.appendChild(use);
    target.appendChild(svg);
}

const qualityBack = new MutationObserver(() => {
    const target = document.querySelector('[data-test-id="SOUND_QUALITY_BUTTON"] > span');
    if (target && !target.querySelector('svg')) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("class", "J9wTKytjOWG73QMoN5WP UwnL5AJBMMAp6NwMDdZk");
        svg.setAttribute("focusable", "false");
        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("style", "padding: var(--ym-icon-padding, 2px);");

        const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
        use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#settings");

        svg.appendChild(use);
        target.appendChild(svg);
    }
});

qualityBack.observe(document.body, { childList: true, subtree: true });
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

let settingsDelay = 1000;
let baseUrl = 'http://127.0.0.1:2007/assets/fullscreen-lyrics.jpg?name=Vocaloid Miku!'
let baseBlur = 0;
let updateInterval;

async function setSettings(newSettings) {
    // Кастом картинка в SyncLyrics
    const syncLyricsBackground = document.querySelector('.SyncLyrics_root__6KZg4');
    let style = document.getElementById('sync-lyrics-style');
    if (!style) {
        style = document.createElement('style');
        style.id = 'sync-lyrics-style';
        document.head.appendChild(style);
    }

    function updateBackground(url) {
        if (url.startsWith('http://127.0.0.1:2007')) {
            if (style.textContent !== `.SyncLyrics_root__6KZg4 { background-image: url("${url}"); }`) {
                style.textContent = `.SyncLyrics_root__6KZg4 { background-image: url("${url}"); }`;
            }
        } else {
            if (style.textContent !== `.SyncLyrics_root__6KZg4 { background-image: url("https://images.weserv.nl/?url=${url}"); }`) {
                style.textContent = `.SyncLyrics_root__6KZg4 { background-image: url("https://images.weserv.nl/?url=${url}"); }`;
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
        blurStyle.textContent = `.SyncLyrics_root__6KZg4::after { backdrop-filter: blur(${baseBlur}px); content: ''; position: absolute; inset: 0; }`;
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
    
        .PlayQueue_content__zIUvd * [aria-label="Трек скачан"],
        .PlayQueue_content__zIUvd * [aria-label="Этот трек можете слушать только вы"] {
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
        .SyncLyricsLine_root__r62BN {
            font-family: ${newSettings['SyncLyrics'].normalFont ? '"Montserrat", sans-serif' : ''};
            font-weight: ${newSettings['SyncLyrics'].normalFont ? '700' : ''};
            font-size: ${newSettings['SyncLyrics'].normalFont ? '35px' : ''};
        }
    `;

    // Auto Play
    if (newSettings['Developer'].devAutoPlayOnStart && !window.hasRun) {
        document.querySelector(`section.PlayerBar_root__cXUnU * [data-test-id="PLAY_BUTTON"]`)
            ?.click();
        window.hasRun = true;
    }

    // Update theme settings delay
    if (Object.keys(settings).length === 0 || settings['Особое'].setInterval.text !== newSettings['Особое'].setInterval.text) {
        const newDelay = parseInt(newSettings['Особое'].setInterval.text, 10) || 1000;
        if (settingsDelay !== newDelay) {
            settingsDelay = newDelay;

            // Обновление интервала
            clearInterval(updateInterval);
            updateInterval = setInterval(update, settingsDelay);
        }
    }
}

async function update() {
    const newSettings = await getSettings();
    await setSettings(newSettings);
    settings = newSettings;
}

function init() {
    update();
    updateInterval = setInterval(update, settingsDelay);
}

init();
/*--------------------------------------------*/