const header = document.querySelector('.b-header')
const burger = document.querySelector('.b-burger')
const menu = document.querySelector('.b-header__nav')


//MOBILE MENU
burger.addEventListener('click', () => {
    menu.classList.add('block');
    setTimeout(() => {
        header.classList.toggle('toggle');
        document.body.classList.toggle('stop-scroll')
        if (!header.classList.contains('toggle')) {
            setTimeout(() => {
                menu.classList.toggle('block');
            }, 400);
        }
    }, 50);
})

//TABS
const tabContainer = document.querySelectorAll('[data-tab]')

for (let parentEl of tabContainer) {
    const tabsBtn = parentEl.querySelectorAll('[data-tab-button]');
    const tabs = parentEl.querySelectorAll('[data-tab-content]');

    tabsBtn.forEach(btn => {
        btn.addEventListener('click', event => {
            cleanActiveBtn()
            event.currentTarget.classList.add('active')
            const target = event.currentTarget.getAttribute('data-tab-button')
            hideTabs()
            document.querySelector(`[data-tab-content="${target}"]`).classList.add('active')
        })
    })

    function cleanActiveBtn() {
        tabsBtn.forEach(btn => btn.classList.remove('active'))
    }

    function hideTabs() {
        tabs.forEach(tab => tab.classList.remove('active'))
    }
}


//LOAD VIDEO from link after click 'play'
const videos = document.querySelectorAll('.b-video');
let generateUrl = function (id) {
    let query = '?rel=0&showinfo=0&autoplay=1';
    return 'https://www.youtube.com/embed/' + id + query;
};
let createIframe = function (id) {
    let iframe = document.createElement('iframe');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('allow', 'autoplay; encrypted-media');
    iframe.setAttribute('src', generateUrl(id));
    return iframe;
};
videos.forEach((el) => {
    let videoHref = el.getAttribute('data-video');
    let deletedLength = 'https://youtu.be/'.length;
    let videoId = videoHref.substring(deletedLength, videoHref.length);
    let img = el.querySelector('img');
    let youtubeImgSrc = 'https://i.ytimg.com/vi/' + videoId + '/maxresdefault.jpg';
    img.setAttribute('src', youtubeImgSrc);
    el.addEventListener('click', (e) => {
        e.preventDefault();
        let iframe = createIframe(videoId);
        el.querySelector('img').remove();
        el.appendChild(iframe);
        el.querySelector('button').remove();
    });
});




//ACCORDEON
const accordeonBtn = document.querySelectorAll('[data-accordeon-btn]');
const accordeonContent = document.querySelectorAll('[data-accordeon-content]');

accordeonBtn.forEach(el => {
    el.addEventListener('click', event => {
        if (!el.classList.contains('active')) {
            cleanActivBtns()
            el.classList.add('active');
            const target = event.currentTarget.getAttribute('data-accordeon-btn');
            hideAccordeons()
            let currentAccordeon = document.querySelector(`[data-accordeon-content="${target}"]`);
            var accordeonChild = currentAccordeon.firstElementChild.scrollHeight;
            currentAccordeon.style.height = `calc(${accordeonChild}px + 10.6vw)`;
            currentAccordeon.classList.add('active')
        } else if (el.classList.contains('active')) {
            cleanActivBtns()
            hideAccordeons()
        }


        function hideAccordeons() {
            accordeonContent.forEach(el => {
                el.style.height = '0';
                el.classList.remove('active')
            })
        }

        function cleanActivBtns() {
            accordeonBtn.forEach(el => {
                el.classList.remove('active')
            })
        }
    })
})

//select order
const orders = document.querySelectorAll('.b-order__row:not(.b-order__row_title)')
for (let i of orders) {
    i.addEventListener('click', () => {
        ordersClear()
        i.classList.add('current-order')
    })

    function ordersClear() {
        for (let k of orders) {
            k.classList.remove('current-order')
        }
    }
}

//modals
class GraphModal {
    constructor(options) {
        let defaultOptions = {
            isOpen: () => {},
            isClose: () => {},
        }
        this.options = Object.assign(defaultOptions, options);
        this.modal = document.querySelector('.modal');
        this.speed = 300;
        this.animation = 'fade';
        this._reOpen = false;
        this._nextContainer = false;
        this.modalContainer = false;
        this.isOpen = false;
        this.previousActiveElement = false;
        this._focusElements = [
            'a[href]',
            'input',
            'select',
            'textarea',
            'button',
            'iframe',
            '[contenteditable]',
            '[tabindex]:not([tabindex^="-"])'
        ];
        this._fixBlocks = document.querySelectorAll('.fix-block');
        this.events();
    }

    events() {
        if (this.modal) {
            document.addEventListener('click', function (e) {
                const clickedElement = e.target.closest(`[data-graph-path]`);
                if (clickedElement) {
                    let target = clickedElement.dataset.graphPath;
                    let animation = clickedElement.dataset.graphAnimation;
                    let speed = clickedElement.dataset.graphSpeed;
                    this.animation = animation ? animation : 'fade';
                    this.speed = speed ? parseInt(speed) : 300;
                    this._nextContainer = document.querySelector(`[data-graph-target="${target}"]`);
                    this.open();
                    return;
                }

                if (e.target.closest('.modal__close')) {
                    this.close();
                    return;
                }
            }.bind(this));

            window.addEventListener('keydown', function (e) {
                if (e.keyCode == 27 && this.isOpen) {
                    this.close();
                }

                if (e.which == 9 && this.isOpen) {
                    this.focusCatch(e);
                    return;
                }
            }.bind(this));

            document.addEventListener('click', function (e) {
                if (e.target.classList.contains('modal') && e.target.classList.contains("is-open")) {
                    this.close();
                }
            }.bind(this));
        }

    }

    open(selector) {
        this.previousActiveElement = document.activeElement;

        if (this.isOpen) {
            this.reOpen = true;
            this.close();
            return;
        }

        this.modalContainer = this._nextContainer;

        if (selector) {
            this.modalContainer = document.querySelector(`[data-graph-target="${selector}"]`);
        }

        this.modal.style.setProperty('--transition-time', `${this.speed / 1000}s`);
        this.modal.classList.add('is-open');

        document.body.style.scrollBehavior = 'auto';
        document.documentElement.style.scrollBehavior = 'auto';

        this.disableScroll();

        this.modalContainer.classList.add('modal-open');
        this.modalContainer.classList.add(this.animation);

        setTimeout(() => {
            this.options.isOpen(this);
            this.modalContainer.classList.add('animate-open');
            this.isOpen = true;
            this.focusTrap();
        }, this.speed);
    }

    close() {
        if (this.modalContainer) {
            this.modalContainer.classList.remove('animate-open');
            this.modalContainer.classList.remove(this.animation);
            this.modal.classList.remove('is-open');
            this.modalContainer.classList.remove('modal-open');

            this.enableScroll();

            document.body.style.scrollBehavior = 'auto';
            document.documentElement.style.scrollBehavior = 'auto';

            this.options.isClose(this);
            this.isOpen = false;
            this.focusTrap();

            if (this.reOpen) {
                this.reOpen = false;
                this.open();
            }
        }
    }

    focusCatch(e) {
        const nodes = this.modalContainer.querySelectorAll(this._focusElements);
        const nodesArray = Array.prototype.slice.call(nodes);
        const focusedItemIndex = nodesArray.indexOf(document.activeElement)
        if (e.shiftKey && focusedItemIndex === 0) {
            nodesArray[nodesArray.length - 1].focus();
            e.preventDefault();
        }
        if (!e.shiftKey && focusedItemIndex === nodesArray.length - 1) {
            nodesArray[0].focus();
            e.preventDefault();
        }
    }

    focusTrap() {
        const nodes = this.modalContainer.querySelectorAll(this._focusElements);
        if (this.isOpen) {
            if (nodes.length) nodes[0].focus();
        } else {
            this.previousActiveElement.focus();
        }
    }

    disableScroll() {
        let pagePosition = window.scrollY;
        this.lockPadding();
        document.body.classList.add('disable-scroll');
        document.body.dataset.position = pagePosition;
        document.body.style.top = -pagePosition + 'px';
    }

    enableScroll() {
        let pagePosition = parseInt(document.body.dataset.position, 10);
        this.unlockPadding();
        document.body.style.top = 'auto';
        document.body.classList.remove('disable-scroll');
        window.scroll({
            top: pagePosition,
            left: 0
        });
        document.body.removeAttribute('data-position');
    }

    lockPadding() {
        let paddingOffset = window.innerWidth - document.body.offsetWidth + 'px';
        this._fixBlocks.forEach((el) => {
            el.style.paddingRight = paddingOffset;
        });
        document.body.style.paddingRight = paddingOffset;
    }

    unlockPadding() {
        this._fixBlocks.forEach((el) => {
            el.style.paddingRight = '0px';
        });
        document.body.style.paddingRight = '0px';
    }
}
const modal = new GraphModal();


//slider
var swiper = new Swiper(".b-slider__wrapper", {
    slidesPerView: 1.1,
    spaceBetween: 20,
    breakpoints: {
        420: {
            slidesPerView: 1.3,
        },
        520: {
            slidesPerView: 2,
        },
        760: {
            spaceBetween: 40,
        }
    },
    navigation: {
        nextEl: ".b-btns-slider__btn_next",
        prevEl: ".b-btns-slider__btn_prev",
    },
});