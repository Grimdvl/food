import {closeModal, openModal} from './modal';
import {postData} from '../services/services';

function forms(formSelector, modalTimerId) {
    //forms

    const forms = document.querySelectorAll(formSelector);

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    //для каждой формы подвязываем написаный нами метод
    forms.forEach(item => {
        bindPostData(item);
    });

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            //submit срабатывает при отправке формы
            e.preventDefault();

            //Создаем динамический блок в который мы будем записывать оповещение клиента о успешной отправке формы на сервер
            //что бы подставить картинку вместо тега див создаём img
            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            // form.append(statusMessage); старый код
            form.insertAdjacentElement('afterend', statusMessage);

            //метод POST предназначен для того что бы принимать сервером данный при помощи open мы его открываем через XMLHttpRequest вторым аргументом прописываем путь к серверному файлу
            // const request = new XMLHttpRequest();
            // request.open('POST', 'server.php');

            //создаем форму и формируем её очень важно что бы у инпутов был указан атрибут name для корректной работы
            // request.setRequestHeader('Content-type', 'multipart/form-data'); Устанавливать не нужно так как форм дата в связке с XMLHttpRequest() сама устанавливает заголовок
            //в то же время для json нам нужно указать заголовок дальше мы превращаем форм дату в формат json
            // request.setRequestHeader('Content-type', 'application/json');
            const formData = new FormData(form);

            // //создаем новый пустой обьект перебираем при помощи фор ич всё что есть внутри и помещаем в этот пустой обьект
            // const object = {};
            // formData.forEach(function(value, key) {
            //     object[key] = value;
            // });
            const json = JSON.stringify(Object.fromEntries(formData.entries()));
            
            //пример
            // const obj = {a: 23, b: 50};
            // console.log(Object.entries(obj));

            // //создаем новую переменную (необязательно) для того что бы при помощи JSON.stringify перезаписать обычный формат в JSON
            // const json = JSON.stringify(object);

            //отправляем форму
            // request.send(json);

            //новая запись вместо XMLHttpRequest() через метод fetch
            // fetch('server.php', {
            //     method: 'POST',
            //     headers: {
            //         'Content-type': 'application/json'
            //     },
            //     body: JSON.stringify(object)
            // })
            postData('http://localhost:3000/requests', json)
            // .then(data => data.text())
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                form.reset();
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failure);
            }).finally(() => {
                form.reset();
            });

            //отслеживаем конечную загрузку запроса который мы отправили 200 означает успех загрузки в JS
            // request.addEventListener('load', () => {
            //     if (request.status === 200) {
            //         console.log(request.response);
            //         showThanksModal(message.success);
            //         //очищаем форму
            //         form.reset();
            //         //очищаем описание формы через время (раньше был сет тайм аут) так как загрузка будет показана анимацией спинера
            //         statusMessage.remove();
            //     } else {
            //         showThanksModal(message.failure);
            //         // старый код statusMessage.textContent = message.failure;
            //     }
            // });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        //Скрываем предыдущий контент для того что бы показать анимацию загрузки
        prevModalDialog.classList.add('hide');
        openModal('.modal', modalTimerId);

        //Создаем новый элемент див для того что бы динамически сформировать форму для отправки после того как она будет скрыта и сфоромировать её заново 
        //Для этого мы так же обязательно должны будем перезаписать наш Х и делегировать ему событие что бы при формировании нового окна он имел тот же функционал что и наш предыдущий Х
        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class='modal__content'>
                <div class='modal__close' data-close>×</div>
                <div class='modal__title'>${message}</div>
            </div>
        `;

        //Добавляем элемент на странице что бы он отображался не создавая промежуточных переменных
        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            //очищаем предыдущий блок див для того что бы в будущем они не накапливались при формировании новых блоков див
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            // prevModalDialog.classList.toggle('show');
            closeModal('.modal');
        }, 4000);
    }

    // fetch('http://localhost:3000/menu')
    //     .then(data => data.json())
    //     .then(res => console.log(res));
}

export default forms;