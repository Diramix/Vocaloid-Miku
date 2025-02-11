// Change fullscreen player background image script
/*--------------------------------------------*/
setInterval(() => {
    const imgElements = document.querySelectorAll('[class*="FullscreenPlayerDesktopPoster_cover"]');
    let imgBackground = "";

    imgElements.forEach(img => {
        if (img.src && img.src.includes('/400x400')) {
            imgBackground = img.src.replace('/400x400', '/1000x1000');
        }
    });

    if (imgBackground) {
        const targetElement = document.querySelector('.FullscreenPlayerDesktop_modalContent__Zs_LC');
        const divaCoverElement = document.querySelector('.Diva-Cover')
        if (targetElement) {

            const currentBackground = targetElement.style.background;

            const newBackground = `linear-gradient(180deg, rgba(0, 0, 0, 0.30) 0%, rgba(0, 0, 0, 0.75) 100%), url(${imgBackground}) center center / cover no-repeat`;
            const divaNewBackground = `url(${imgBackground}) center center / cover no-repeat`;

            const img = new Image();
            img.src = imgBackground;

            img.onload = () => {

                if (currentBackground !== newBackground) {
                    targetElement.style.background = newBackground;
                    divaCoverElement.style.background = divaNewBackground
                }
            };

            img.onerror = () => {
                console.error(`Ошибка загрузки изображения: ${imgBackground}`);
            };
        }
    }
}, 0);
/*--------------------------------------------*/

// Change vibe block background image script
/*--------------------------------------------*/
setInterval(() => {
    const imgElements = document.querySelectorAll('[class*="PlayerBarDesktop_cover"]');
    let imgBackground = "";
    const additionalImage = "http://127.0.0.1:2007/assets/My-vibe.png";

    imgElements.forEach(img => {
        if (img.src && img.src.includes('/100x100')) {
            imgBackground = img.src.replace('/100x100', '/1000x1000');
        }
    });

    const targetElement = document.querySelector('.MainPage_vibe__XEBbh');
    if (targetElement) {
        targetElement.style.position = 'relative';
        targetElement.style.overflow = 'hidden';

        let blurElement = targetElement.querySelector('.blur-element');
        if (blurElement) {
            targetElement.removeChild(blurElement);
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
            additionalImageElement.style.background = `url(${additionalImage}) center center / cover no-repeat`;
            additionalImageElement.style.borderRadius = '10px';
            additionalImageElement.style.zIndex = '2';
            additionalImageElement.style.imageRendering = 'crisp-edges';
            targetElement.appendChild(additionalImageElement);
        }

        const newBlurElement = document.createElement('div');
        newBlurElement.classList.add('blur-element');
        newBlurElement.style.position = 'absolute';
        newBlurElement.style.top = 0;
        newBlurElement.style.left = 0;
        newBlurElement.style.width = '100%';
        newBlurElement.style.height = '100%';
        newBlurElement.style.background = `url(${imgBackground}) center center / cover no-repeat`;
        newBlurElement.style.backgroundColor = '#26F4FE';
        newBlurElement.style.filter = 'blur(0px) brightness(0.5)';
        newBlurElement.style.zIndex = '1';
        targetElement.appendChild(newBlurElement);

        const childElements = targetElement.querySelectorAll(':scope > *:not(.additional-image-element):not(.blur-element)');
        childElements.forEach(child => {
            child.style.position = 'relative';
            child.style.zIndex = '3';
        });
    }
}, 500);
/*--------------------------------------------*/

// Vocaloid Miku!
/*--------------------------------------------*/
const isThemeTitleText = document.querySelector('.themeTitleText')
if (!isThemeTitleText) {
    const themeTitleText = document.createElement('div');
    themeTitleText.className = 'ThemeTitleText';

    themeTitleText.style.position = 'fixed';
    themeTitleText.style.visibility = 'visible';
    themeTitleText.style.fontFamily = '"Vocaloid", sans-serif';
    themeTitleText.style.fontSize = '16px';
    themeTitleText.style.fontWeight = '1000';
    themeTitleText.style.left = '50%';
    themeTitleText.style.marginLeft = '-66px';
    themeTitleText.style.top = '10px';
    themeTitleText.style.color = 'var(--main-color)';
    themeTitleText.style.zIndex = '1';

    themeTitleText.textContent = 'Vocaloid Miku!';

    document.body.appendChild(themeTitleText);
}
/*--------------------------------------------*/

// CoverImage для исправления багов с обложкой в SyncLyricsе
/*--------------------------------------------*/
setInterval(function() {
    let container = document.querySelector('.FullscreenPlayerDesktopContent_root__tKNGK');
    
    if (container && !container.querySelector('.CoverImage')) {
        let newElement = document.createElement('div');
        newElement.classList.add('CoverImage');
        container.appendChild(newElement);
    }
}, 1000);

setInterval(() => {
    const imgElements = document.querySelectorAll('[class*="PlayerBarDesktop_cover__IYLwR"]');
    let imgBackground = "";

    imgElements.forEach(img => {
        if (img.src && img.src.includes('/100x100')) {
            imgBackground = img.src.replace('/100x100', '/1000x1000');
        }
    });

    if (imgBackground) {
        const targetElement = document.querySelector('.CoverImage');
        if (targetElement) {
            targetElement.style.background = `url(${imgBackground}) center center / cover no-repeat`;
        }
    }
}, 1000);
/*--------------------------------------------*/

// Элемент для отображения картинок в фуллскрине
/*--------------------------------------------*/
setInterval(function() {
    let container = document.querySelector('.FullscreenPlayerDesktopContent_root__tKNGK');
    
    if (container && !container.querySelector('.AssetsImages')) {
        let newElement = document.createElement('div');
        newElement.classList.add('AssetsImages');
        container.appendChild(newElement);
    }
}, 1000);
/*--------------------------------------------*/

// Скрипт для смены темы
/*--------------------------------------------*/
setInterval(() => {
  const body = document.body;
  if (!body.classList.contains('ym-dark-theme') && !body.classList.contains('ym-light-theme')) {
    body.classList.add('ym-light-theme');
  } else if (body.classList.contains('ym-dark-theme')) {
    body.classList.replace('ym-dark-theme', 'ym-light-theme');
  }
}, 0);
/*--------------------------------------------*/

// Скрипт для добавления элемента Miku-Run
/*--------------------------------------------*/
const newElement = document.createElement('div');
newElement.className = 'mikuRun';
document.body.appendChild(newElement);
/*--------------------------------------------*/

/*Diva Cover*/
/*--------------------------------------------*/
const observer = new MutationObserver(() => {
  ['Diva-Cover', 'Diva-Standard-Mark'].forEach(className => {
    if (document.querySelector('.PlayButtonWithCover_coverImage__DhS1R') && !document.querySelector(`.${className}`)) {
      document.querySelector('.PlayQueue_root__ponhw')?.appendChild(Object.assign(document.createElement('div'), { className }));
    }
  });
});

observer.observe(document.body, { childList: true, subtree: true });
/*--------------------------------------------*/

/*Управление handleEvents.json*/
/*--------------------------------------------*/
let settings = {};

function log(text) {
    console.log('[Customizable LOG]: ', text)
}

async function getSettings() {
    try {
        const response = await fetch("http://127.0.0.1:2007/get_handle");
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
let baseUrl = 'http://127.0.0.1:2007/assets/fullscreen-lyrics.jpg'
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
        if (style.textContent !== `.SyncLyrics_root__6KZg4 { background-image: url("${url}"); }`) {
            style.textContent = `.SyncLyrics_root__6KZg4 { background-image: url("${url}"); }`;
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
        }, 1000);
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

    // Standard Mark
    let standardMarkStyle = document.getElementById('standard-mark-style');
    if (!standardMarkStyle) {
        standardMarkStyle = document.createElement('style');
        standardMarkStyle.id = 'standard-mark-style';
        document.head.appendChild(standardMarkStyle);
    }

    standardMarkStyle.textContent = `
        .Diva-Standard-Mark {
            display: ${newSettings['Очередь'].toggleStandardMark ? 'block' : 'none'} !important;
        }
    `;

    // Download & Visible Icon
    let downloadStyle = document.getElementById('download-style');
    if (!downloadStyle) {
        downloadStyle = document.createElement('style');
        downloadStyle.id = 'download-style';
        document.head.appendChild(downloadStyle);
    }

    downloadStyle.textContent = `
        [aria-label="Трек скачан"],
        [aria-label="Этот трек можете слушать только вы"] {
            display: ${newSettings['Очередь'].toggleDownloadAndVisibleIcon ? 'block' : 'none'} !important;
        }
    `;

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