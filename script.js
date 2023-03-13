//получаем информацию из базы данных
async function getItems() { //создаем ассинхронную функцию
    return fetch("https://63ef5c39c59531ccf16d9ea8.mockapi.io/items").then((res) => { //отправляем fetch запрос и ждем пока он выполнится, потом с помощью then выполняем след действия
        return res.json() //распарсить страницу из json в объект js
    })
        .then((data) => {
            return data;
        })
}



getItems().then((result) => {
    generateApp(result)
})

//функция, которая генерирует приложение
function generateApp(data) {//data - это объекты
    //проверяем, есть ли в контейнере какие-то товары, если нет, то показываем корзину
    if (data.length == 0) {
        showBasket()
    }

    const itemsConteiner = document.querySelector('.items.container'); //контейер, в котором хранятся все объекты
    const htmlElements = data.map((obj) => { //создаем массив с разметкой для каждого объекта
        return ` <div class="container">
        <div class="card" data-price=${obj.price} data-checked = "false" data-id=${obj.id}>
            <div class="card__img-wrap">
                <img src="${obj.img}">
            </div>
            <div class="card__info">
                <label class="check-wrap">
                    <span class="name">${obj.title}</span>
                    <input class="visually-hidden checkbox" type="checkbox" onClick="handleClick(event)">
                    <span class="visible-check card__visible-check"></span>
                </label>
                <span class="price">${obj.price.toLocaleString()} &#8381</span> 
                <button class="btn"></button> 
            </div>
        </div>
    </div>`
        //toLocaleString-метод, который позволяет разделить число пробелом
        //data-price="${obj.price}" - дата-атрибут, нужен для разработки, чтобы хранить скрытые от пользователя данные в виде html. В нашем случае мы не можем вынуть сумму, т.к. там используется метод разделяющий пробелом цифры
        //onClick - типо как повестить событие клик с помощью AddEventListeners
    })
    itemsConteiner.insertAdjacentHTML("beforeend", htmlElements.join("")) // insertAdjacentHTML-метод, который позволяется вставить html в виде строки в определенную позицию

    //удаление элемента
    document.querySelectorAll(".card").forEach((elem) => {
        const idItem = elem.dataset.id;
        elem.querySelector(".btn").addEventListener("click", (event) => {
            deleteItem(idItem, data)
        })
    })


    //вызываем функцию, которая считает сумму и кол-во
    calcPriceAndCount()
    calcReports()

}

//функция, которая считает кол-во товаров и суммирует
function calcPriceAndCount() {
    const countHtml = document.querySelector(".sum-request")
    const priceHtml = document.querySelector(".sum-all")
    const items = document.querySelectorAll(".card")// это не массив, а nodeList -псевдо массив, но у него нет методов

    let count = 0;
    let sum = 0;
    //метод для перебора nodeList
    items.forEach((elem) => { //для forEach return не нужен
        //добавляем условие, чтобы сумма считалась не на веь товар в корзине, а только на выбранный
        if (elem.dataset.checked == "true") { //dataset-позволяет перейти в data-атрибут элемента (а имеенно checked)
            //считаем сумму
            sum += +elem.dataset.price //dataset-переходит в data-атрибут элемента (а имеенно price)
            //"+" перед elem.dataset.price быстро переводит строку к числу
            //считаем кол-во товаров
            count++
        }

    })
    //innerHTML-свойство, которое позволяет заменить содержимое
    priceHtml.innerHTML = sum.toLocaleString()
    countHtml.innerHTML = count

    changeBtnState()
}

//функция, которая будет срабатывать на checkbox. Т.е. когда выбираем галочкой товар
//вызываю эту функцию в input onClick="handleClick(event)" в разметке html выше при генерации карточки
function handleClick(event) {
    let isChecked = event.target.checked //тут значение- true
    //ищем div с классом card (те родительский) и присваем ему в data коллекцию значение переменной isChecked
    //event.target- это сам чекбокс,те инпут, методом closest ищу ближ родителя с указанным классом
    event.target.closest(".card").dataset.checked = isChecked

    //тут же срабатывает функция подсчета суммы и кол-ва товаров при клике на чекбокс
    calcPriceAndCount()
}

//функция, которая отображает общее кол-во товаров
function calcReports() {
    const items = document.querySelectorAll(".card")
    const calcHtml = document.querySelector(".sum-reports")

    calcHtml.innerHTML = items.length;
}

//функция, которая меняет состояние кнопки
function changeBtnState() {
    const btnActive = document.querySelector(".btn-request.active")
    const btnUnactive = document.querySelector(".btn-request.unactive-second")
    const items = document.querySelectorAll(".card")
    let count = 0;

    items.forEach((elem) => { //для forEach return не нужен
        //добавляем условие, чтобы сумма считалась не на веь товар в корзине, а только на выбранный
        if (elem.dataset.checked == "true") { //dataset-позволяет перейти в data-атрибут элемента (а имеенно checked)
            //считаем кол-во товаров
            count++
        }
    })

    if (!count) { //т.е. count равен 0
        btnUnactive.style.display = 'block' //показываю 
        btnActive.style.display = 'none' //скрываю
    } else {
        btnActive.style.display = 'block' //показываю
        btnUnactive.style.display = 'none' //скрываю 
    }
}

//функция удаление элементов
function deleteItem(id, arr) {
    const newArr = arr.filter((elem) => {
        return elem.id !== id //id не равен id елемента, который нужно удалить
    })
    const itemsConteiner = document.querySelector('.items.container'); //контейер, в котором хранятся все объекты
    itemsConteiner.innerHTML = null; //очищаю контейнер от старых элементов
    generateApp(newArr) //генерирую приложение с учетом удаленных элементов
}

//функция "Выбрать всё"
function selectAll(event) {
    console.log(event.target.checked)
    const items = document.querySelectorAll(".card")// все элементы

    if (event.target.checked) {
        items.forEach((card) => {
            card.dataset.checked = "true"
            card.querySelector('.visually-hidden').checked = true
        })
    } else {
        items.forEach((card) => {
            card.dataset.checked = "false"
            card.querySelector('.visually-hidden').checked = false
        })
    }

    calcPriceAndCount()
}

//функция, которая показывает пустую корзину
function showBasket() {
    const itemsConteiner = document.querySelector('.items.container')

    itemsConteiner.innerHTML = `<div class="basket-null" id="cart">
<img src="data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='64' height='64' rx='32' fill='%23EDEDED'/%3E%3Cpath d='M25.3334 45.3332C24.6 45.3332 23.9725 45.0723 23.4507 44.5505C22.928 44.0278 22.6667 43.3998 22.6667 42.6665C22.6667 41.9332 22.928 41.3052 23.4507 40.7825C23.9725 40.2607 24.6 39.9998 25.3334 39.9998C26.0667 39.9998 26.6943 40.2607 27.216 40.7825C27.7387 41.3052 28 41.9332 28 42.6665C28 43.3998 27.7387 44.0278 27.216 44.5505C26.6943 45.0723 26.0667 45.3332 25.3334 45.3332ZM38.6667 45.3332C37.9334 45.3332 37.3058 45.0723 36.784 44.5505C36.2614 44.0278 36 43.3998 36 42.6665C36 41.9332 36.2614 41.3052 36.784 40.7825C37.3058 40.2607 37.9334 39.9998 38.6667 39.9998C39.4 39.9998 40.028 40.2607 40.5507 40.7825C41.0725 41.3052 41.3334 41.9332 41.3334 42.6665C41.3334 43.3998 41.0725 44.0278 40.5507 44.5505C40.028 45.0723 39.4 45.3332 38.6667 45.3332ZM24.2 23.9998L27.4 30.6665H36.7334L40.4 23.9998H24.2ZM25.3334 38.6665C24.3334 38.6665 23.5778 38.2274 23.0667 37.3492C22.5556 36.4718 22.5334 35.5998 23 34.7332L24.8 31.4665L20 21.3332H18.6334C18.2556 21.3332 17.9445 21.2052 17.7 20.9492C17.4556 20.6941 17.3334 20.3776 17.3334 19.9998C17.3334 19.6221 17.4614 19.3052 17.7174 19.0492C17.9725 18.7941 18.2889 18.6665 18.6667 18.6665H20.8334C21.0778 18.6665 21.3112 18.7332 21.5334 18.8665C21.7556 18.9998 21.9223 19.1887 22.0334 19.4332L22.9334 21.3332H42.6C43.2 21.3332 43.6112 21.5554 43.8334 21.9998C44.0556 22.4443 44.0445 22.9109 43.8 23.3998L39.0667 31.9332C38.8223 32.3776 38.5 32.7221 38.1 32.9665C37.7 33.2109 37.2445 33.3332 36.7334 33.3332H26.8L25.3334 35.9998H40.0334C40.4111 35.9998 40.7223 36.1274 40.9667 36.3825C41.2112 36.6385 41.3334 36.9554 41.3334 37.3332C41.3334 37.7109 41.2054 38.0274 40.9494 38.2825C40.6943 38.5385 40.3778 38.6665 40 38.6665H25.3334Z' fill='%23777777'/%3E%3C/svg%3E">
<p style="color: #777777">Корзина пуста</p>
</div>`
}


