import {getResource} from "../services/services";

function cards() {
    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 35;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price * this.transfer;
        }

        render() {
            const element = document.createElement('div');

            if (this.classes.length === 0) {
                this.classes = "menu__item";
                element.classList.add(this.classes);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }
            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
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

    getResource('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        })
        .catch(error => {
            console.error('Ошибка загрузки меню:', error); 

            new MenuCard(
                'img/tabs/vegy.jpg',
                'vegy',
                'Меню "Фитнес"',
                'Меню "Фитнес" - это новый подход к приготовлению блюд...',
                9,
                '.menu .container',
            ).render();

            new MenuCard(
                "img/tabs/post.jpg",
                "post",
                'Меню "Постное"',
                'Меню “Постное” - это тщательный подбор ингредиентов...',
                14,
                ".menu .container"
            ).render();

            new MenuCard(
                "img/tabs/elite.jpg",
                "elite",
                'Меню “Премиум”',
                'В меню “Премиум” мы используем не только красивый дизайн упаковки...',
                21,
                ".menu .container"
            ).render();
        });
}

export default cards;