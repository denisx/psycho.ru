/**
 * Корневой js-файл сайта
 */
document.addEventListener("DOMContentLoaded", () => {
  // получение кнопки "отправить" для формы "перезвоните мне"
  let btnCallMe = document.getElementById("submit-user-form");
  // если кнопка на странице есть
  if(btnCallMe) {
    // повесим на неё обработчик нажатия
    btnCallMe.addEventListener("click", () => {
      let f = document.getElementById("callme");
      // костыль!!!
      // проверка валидити полей 1,2 и 3 формы
      if(f[1].checkValidity() && f[2].checkValidity() && f[3].checkValidity()) {
        // готовим аякс-запрос для отправки заявки
        let xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.open("POST", "/rpc/callme");
        // отправлять будем json
        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        var formData = JSON.stringify({
          name: (document.querySelector("[name='fosName']") as HTMLInputElement).value,
          phone: (document.querySelector("[name='fosPhone']") as HTMLInputElement).value,
          email: (document.querySelector("[name='fosEmail']") as HTMLInputElement).value,
          url: window.location.href,
        });
        // отправляем
        xhr.send(formData);
      }
    });
  }
});