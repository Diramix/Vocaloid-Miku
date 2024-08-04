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
let previousImgBackground = "";

setInterval(() => {
    const imgElements = document.querySelectorAll('[class*="PlayerBarDesktop_cover"]');
    let imgBackground = "";
    const additionalImage = "http://127.0.0.1:19582/assets/My-vibe.png";

    imgElements.forEach(img => {
        if (img.src && img.src.includes('/1000x1000')) {
            imgBackground = img.src.replace('/1000x1000', '/1000x1000');
        }
    });

    const targetElement = document.querySelector('.MainPage_vibe__XEBbh');
    if (targetElement) {
        targetElement.style.background = `url(${additionalImage}) center center / cover no-repeat`;
        targetElement.style.position = 'relative';
        targetElement.style.overflow = 'hidden';

        const blurElement = targetElement.querySelector('.blur-element') || document.createElement('div');

        if (!blurElement.classList.contains('blur-element')) {
            blurElement.classList.add('blur-element');
            blurElement.style.position = 'absolute';
            blurElement.style.top = 0;
            blurElement.style.left = 0;
            blurElement.style.width = 'calc(100% + 20px)';
            blurElement.style.height = 'calc(100% + 20px)';
            blurElement.style.filter = 'blur(0px) brightness(0.5)';
            blurElement.style.borderRadius = '10px';
            blurElement.style.zIndex = '-1';
            blurElement.style.imageRendering = 'crisp-edges';
            targetElement.appendChild(blurElement);
        }

        blurElement.style.backgroundColor = '#26F4FE';

        if (imgBackground && imgBackground !== previousImgBackground) {
            const img = new Image();
            img.src = imgBackground;

            img.onload = () => {
                blurElement.style.background = `url(${imgBackground}) center center / cover no-repeat`;
                previousImgBackground = imgBackground;
            };

            img.onerror = () => {
                console.error(`Ошибка загрузки изображения: ${imgBackground}`);
            };
        }
    }
}, 0);
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