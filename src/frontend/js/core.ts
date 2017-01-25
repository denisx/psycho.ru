document.addEventListener("DOMContentLoaded", () => {
  let btnCallMe = document.getElementById("submit-user-form");
  if(btnCallMe) {
    btnCallMe.addEventListener("click", () => {
      if(document.getElementById("callme")[0].checkValidity()) {
        alert("send email");
      }
    });
  }
});

// $(function() {
//     $('#submit-user-form').click(function () {
//         if ($('#callme')[0].checkValidity())
//         {
//             var url = '/callme?name=' + $("input[name='fosName']").val() +
//               '&phone=' + $("input[name='fosPhone']").val() +
//               '&email=' + $("input[name='fosEmail']").val() +
//               '&url=' + window.location.href;
//             $.ajax({
//                 url: url,
//                 success: function (data) {
//                 }
//             });
//         }

//     });
// });