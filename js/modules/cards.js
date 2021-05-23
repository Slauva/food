import { getResources } from '../services/services';

function cards() {
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

    getResources('http://localhost:3000/menu').then((data) => {
        data.forEach(({ img, altimg, title, descr, price }) => {
            new MenuCard(img, altimg, title, descr, price, '.menu .container', 'menu__item').render();
        });
    });
}

export default cards;
