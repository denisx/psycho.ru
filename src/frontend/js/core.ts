document.addEventListener("DOMContentLoaded", () => {
  let btnCallMe = document.getElementById("submit-user-form");
  if(btnCallMe) {
    btnCallMe.addEventListener("click", () => {
      let f = document.getElementById("callme");
      // костыль!!!
      // проверка валидити полей 1,2 и 3 формы
      if(f[1].checkValidity() && f[2].checkValidity() && f[3].checkValidity()) {
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
        xhr.send(formData);
      }
    });
  }
});