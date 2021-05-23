function calc() {
    const result = document.querySelector('.calculating__result span');

    let sex, hieght, weight, age, ratio;

    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', sex);
    }

    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 1.375;
        localStorage.setItem('ratio', ratio);
    }

    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach((elem) => {
            elem.classList.remove(activeClass);
            if (elem.getAttribute('id') === localStorage.getItem('sex')) {
                elem.classList.add(activeClass);
            }
            if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                elem.classList.add(activeClass);
            }
        });
    }

    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

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

    function getStaticInformation(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach((element) => {
            element.addEventListener('click', (event) => {
                if (event.target.getAttribute('data-ratio')) {
                    ratio = +event.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', ratio);
                } else {
                    sex = event.target.getAttribute('id');
                    localStorage.setItem('sex', sex);
                }

                elements.forEach((element) => element.classList.remove(activeClass));

                event.target.classList.add(activeClass);

                calcTotal(sex, hieght, weight, age, ratio);
            });
        });
    }

    getStaticInformation('#gender div', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');

    function getDynamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', (event) => {
            if (input.value.match(/\D/g)) {
                input.style.border = '1px solid red';
            } else {
                input.style.border = 'none';
            }

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
}

export default calc;
