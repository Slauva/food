'use strict';

window.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach((item) => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach((item) => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    // Timer

    const deadline = '2021-05-21';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60)) % 24),
            minutes = Math.floor((t / (1000 * 60)) % 60),
            seconds = Math.floor((t / 1000) % 60);

        return {
            total: t,
            days: days,
            hours: hours,
            minutes: minutes,
            seconds: seconds,
        };
    }

    function getZero(item) {
        return item <= 0 ? '00' : item < 10 ? '0' + item : item;
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);

    // modal

    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    modalTrigger.forEach((btn) => {
        btn.addEventListener('click', openModal);
    });

    modal.addEventListener('click', (event) => {
        if (event.target === modal || event.target.getAttribute('data-close') == '') {
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.code === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 50000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight + 1 >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    // Class for Cards

    class MenuCard {
        constructor(srcImage, altImage, title, text, cost, parentSelector, ...classes) {
            this.src = srcImage;
            this.alt = altImage;
            this.title = title;
            this.descr = text;
            this.price = cost;
            this.classes = classes;
            this.transfer = 27;
            this.parent = document.querySelector(parentSelector);
            this.changeToUAH();
        }

        changeToUAH() {
            this.price *= this.transfer;
        }

        render() {
            const element = document.createElement('div');
            this.classes.forEach((cls) => element.classList.add(cls));
            element.innerHTML = `
                <img src=${this.src} alt=${this.alt} />
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;
            this.parent.append(element);
        }
    }

    const getResources = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    };

    // getResources('http://localhost:3000/menu').then((data) => {
    //     data.forEach(({ img, altimg, title, descr, price }) => {
    //         new MenuCard(img, altimg, title, descr, price, '.menu .container', 'menu__item').render();
    //     });
    // });

    axios.get('http://localhost:3000/menu').then((data) => {
        data.data.forEach(({ img, altimg, title, descr, price }) => {
            new MenuCard(img, altimg, title, descr, price, '.menu .container', 'menu__item').render();
        });
    });

    // Form

    const forms = document.querySelectorAll('form');

    forms.forEach((item) => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: data,
        });

        return await res.json();
    };

    const message = {
        loading: 'img/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...',
    };

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>&times;</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);

        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }

    function bindPostData(form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);
            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
                .then((data) => {
                    console.log(data);
                    showThanksModal(message.success);
                    statusMessage.remove();
                })
                .catch(() => {
                    showThanksModal(message.failure);
                })
                .finally(() => {
                    form.reset();
                });
        });
    }

    // to start server print the command in terminal: npx json-server --watch db.json
    // fetch('http://localhost:3000/menu')
    //     .then((data) => data.json())
    //     .then((res) => console.log(res));

    // Slider

    const prev = document.querySelector('.offer__slider-prev'),
        slides = document.querySelectorAll('.offer__slide'),
        next = document.querySelector('.offer__slider-next'),
        total = document.querySelector('#total'),
        current = document.querySelector('#current'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        slidesField = document.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(slidesWrapper).width,
        slider = document.querySelector('.offer__slider');

    let slideIndex = 1;
    let offset = 0;

    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';

    slidesWrapper.style.overflow = 'hidden';

    slides.forEach((slide) => {
        slide.style.width = width;
    });

    slider.style.position = 'relative';

    const indicators = document.createElement('ol'),
        dots = [];
    indicators.classList.add('carousel-indicators');

    slider.append(indicators);

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.classList.add('dot');
        if (i == 0) {
            dot.style.opacity = 1;
        }
        indicators.append(dot);
        dots.push(dot);
    }

    total.textContent = slides.length < 10 ? '0' + slides.length : slides.length;
    current.textContent = slideIndex < 10 ? '0' + slideIndex : slideIndex;

    function activeDot(i) {
        dots.forEach((dot) => (dot.style.opacity = '.5'));
        dots[i - 1].style.opacity = 1;
    }

    next.addEventListener('click', () => {
        if (offset == +width.replace(/\D/g, '') * (slides.length - 1)) {
            offset = 0;
        } else {
            offset += +width.replace(/\D/g, '');
        }
        slidesField.style.transform = `translateX(-${offset}px)`;

        slideIndex = slideIndex == slides.length ? 1 : slideIndex + 1;
        current.textContent = slideIndex < 10 ? '0' + slideIndex : slideIndex;

        activeDot(slideIndex);
    });

    prev.addEventListener('click', () => {
        if (offset == 0) {
            offset = +width.replace(/\D/g, '') * (slides.length - 1);
        } else {
            offset -= +width.replace(/\D/g, '');
        }
        slidesField.style.transform = `translateX(-${offset}px)`;

        slideIndex = slideIndex == 1 ? slides.length : slideIndex - 1;
        current.textContent = slideIndex < 10 ? '0' + slideIndex : slideIndex;

        activeDot(slideIndex);
    });

    dots.forEach((dot) => {
        dot.addEventListener('click', (event) => {
            const slideTo = event.target.getAttribute('data-slide-to');

            slideIndex = slideTo;
            offset = +width.replace(/\D/g, '') * (slideTo - 1);

            slidesField.style.transform = `translateX(-${offset}px)`;

            current.textContent = slideIndex < 10 ? '0' + slideIndex : slideIndex;

            activeDot(slideIndex);
        });
    });

    // Calculator

    const result = document.querySelector('.calculating__result span');

    let sex = 'female',
        hieght,
        weight,
        age,
        ratio = '1.375';

    calcTotal(sex, hieght, weight, age, ratio);

    function calcTotal(sex, hieght, weight, age, ratio) {
        let bmr;

        if (!sex || !hieght || !weight || !age || !ratio) {
            result.textContent = '____';
            return;
        }

        if (sex === 'male') {
            bmr = 88.36 + weight * 13.4 + hieght * 4.8 - age * 5.7;
        } else {
            bmr = 447.6 + weight * 9.2 + hieght * 3.1 - age * 4.3;
        }

        result.textContent = (bmr * ratio).toFixed(0);
    }

    function getStaticInformation(parentSelector, activeClass) {
        const elements = document.querySelectorAll(`${parentSelector} div`);

        elements.forEach((element) => {
            element.addEventListener('click', (event) => {
                if (event.target.getAttribute('data-ratio')) {
                    ratio = +event.target.getAttribute('data-ratio');
                } else {
                    sex = event.target.getAttribute('id');
                }

                elements.forEach((element) => element.classList.remove(activeClass));

                event.target.classList.add(activeClass);

                calcTotal(sex, hieght, weight, age, ratio);
            });
        });
    }

    getStaticInformation('#gender', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big', 'calculating__choose-item_active');

    function getDynamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', (event) => {
            switch (event.target.getAttribute('id')) {
                case 'height':
                    hieght = +event.target.value;
                    break;
                case 'weight':
                    weight = +event.target.value;
                    break;
                case 'age':
                    age = +event.target.value;
                    break;
            }
            calcTotal(sex, hieght, weight, age, ratio);
        });
    }

    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');
});
