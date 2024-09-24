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
        if (targetElement) {

            const currentBackground = targetElement.style.background;

            const newBackground = `linear-gradient(180deg, rgba(0, 0, 0, 0.30) 0%, rgba(0, 0, 0, 0.75) 100%), url(${imgBackground}) center center / cover no-repeat`;

            const img = new Image();
            img.src = imgBackground;

            img.onload = () => {

                if (currentBackground !== newBackground) {
                    targetElement.style.background = newBackground;
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
        if (img.src && img.src.includes('/1000x1000')) {
            imgBackground = img.src.replace('/1000x1000', '/1000x1000');
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
const themeTitleText = document.createElement('div');
themeTitleText.className = 'ThemeTitleText';

themeTitleText.style.position = 'fixed';
themeTitleText.style.visibility = 'visible';
themeTitleText.style.fontFamily = '"Vocaloid", sans-serif';
themeTitleText.style.fontSize = '16px';
themeTitleText.style.fontWeight = '1000';
themeTitleText.style.left = '50%';
themeTitleText.style.marginLeft = '-66px';
themeTitleText.style.marginTop = '10px';
themeTitleText.style.color = 'var(--main-color)';
themeTitleText.style.zIndex = '1';

themeTitleText.textContent = 'Vocaloid Miku!';

document.body.appendChild(themeTitleText);
/*--------------------------------------------*/

// CoverImage для исправления багов с обложкой в фуллскрине
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
        if (img.src && img.src.includes('/1000x1000')) {
            imgBackground = img.src.replace('/1000x1000', '/1000x1000');
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

// Скрипт для скачивания треков по нажатию на Miku-Run
/*--------------------------------------------*/
setInterval(() => {
    const playerBar = document.querySelector('.mikuRun');
    const settingsButton = document.querySelector('body > div > section > div > div > span.PlayerBarDesktop_settingsButton__jLkVn');

    if (playerBar) {
        if (settingsButton && settingsButton.textContent.trim()) {
            playerBar.style.cursor = 'pointer';
            playerBar.addEventListener('mouseenter', () => {
                playerBar.style.filter = 'hue-rotate(90deg)';
            });
            playerBar.addEventListener('mouseleave', () => {
                playerBar.style.filter = 'hue-rotate(0deg)';
            });
            if (!playerBar.dataset.listenerAdded) {
                playerBar.addEventListener('click', () => {
                    settingsButton.click();
                });
                playerBar.dataset.listenerAdded = true;
            }
        } else {
            playerBar.style.cursor = 'default';
            playerBar.style.transform = 'scale(1)';
            if (playerBar.dataset.listenerAdded) {
                playerBar.removeEventListener('click', () => settingsButton.click());
                playerBar.dataset.listenerAdded = false;
            }
        }
    }
}, 1000);
/*--------------------------------------------*/