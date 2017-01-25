$(function() {
    $('#submit-user-form').click(function () {
        if ($('#callme')[0].checkValidity())
        {
            var url = '/callme?name=' + $("input[name='fosName']").val() +
              '&phone=' + $("input[name='fosPhone']").val() +
              '&email=' + $("input[name='fosEmail']").val() +
              '&url=' + window.location.href;
            $.ajax({
                url: url,
                success: function (data) {
                }
            });
        }

    });
});
