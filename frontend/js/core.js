/**
 * Корневой js-файл сайта
 */
document.addEventListener('DOMContentLoaded', function() {
  // получение кнопки "отправить" для формы "перезвоните мне"
  var btnCallMe = document.getElementById('submit-user-form');
  // если кнопка на странице есть
  if(btnCallMe) {
    // повесим на неё обработчик нажатия
    btnCallMe.addEventListener('click', function() {
      var f = document.getElementById('callme'),
        xhr = new XMLHttpRequest();
      // костыль!!!
      // проверка валидити полей 1,2 и 3 формы
      if(f[1].checkValidity() && f[2].checkValidity() && f[3].checkValidity()) {
        // готовим аякс-запрос для отправки заявки
        xhr.open('POST', '/rpc/callme');
        // отправлять будем json
        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        // отправляем
        xhr.send(JSON.stringify({
          email: document.querySelector('[name="fosEmail"]').value,
          name: document.querySelector('[name="fosName"]').value,
          phone: document.querySelector('[name="fosPhone"]').value,
          url: window.location.href,
        }));
      }
    });
  }
});
