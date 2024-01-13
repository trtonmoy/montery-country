/* formValidate */

$(document).on("keydown paste", "#phone", function (e) {
  var key = e.which || e.charCode || e.keyCode || 0;
  if (key != 17 && key != 86 && key != 118 && key != 0) {
    $phone = $(this);

    if ($phone.val().length === 1 && (key === 8 || key === 46)) {
      $phone.val("(");
      return false;
    } else if ($phone.val().charAt(0) !== "(") {
      $phone.val("(");
    }

    if (key !== 8 && key !== 9) {
      if ($phone.val().length === 4) {
        $phone.val($phone.val() + ")");
      }
      if ($phone.val().length === 5) {
        $phone.val($phone.val() + " ");
      }
      if ($phone.val().length === 9) {
        $phone.val($phone.val() + "-");
      }
    }

    return (
      key == 8 ||
      key == 9 ||
      key == 46 ||
      (key >= 48 && key <= 57) ||
      (key >= 96 && key <= 105)
    );
  }
});

$(document).on("focus click", "#phone", function () {
  $phone = $(this);

  if ($phone.val().length === 0) {
    $phone.val("(");
  } else {
    var val = $phone.val();
    $phone.val("").val(val);
  }
});
$(document).on("change", "#phone", function () {
  var arr = [];
  var sd = $("#phone").val();
  var phone = sd.replace(/[^0-9]/gi, "");
  if (phone.length > 10) {
    phone = phone.slice(-10);
  }
  if (phone.length == 10) {
    arr[0] = phone.slice(0, 3);
    arr[1] = phone.slice(3, 6);
    arr[2] = phone.slice(6, 10);
    var formattedDate = "(" + arr[0] + ") " + arr[1] + "-" + arr[2];
    $("#phone").val(formattedDate);
  }
});
$(document).on("blur", "#phone", function () {
  $phone = $(this);

  if ($phone.val() === "(") {
    $phone.val("");
  }
});
$(document).on("keypress paste", "#phone", function (e) {
  var key = e.which || e.charCode || e.keyCode || 0;
  if (key != 0) {
    if (e.which == 40 || e.which == 41) e.preventDefault();
    if (e.which < 48 || e.which > 57) e.preventDefault();
  } else {
  }
});
$(document).on("blur input", "#phone", function () {
  var arr = [];
  var sd = $("#phone").val();
  var phone = sd.replace(/[^0-9]/gi, "");

  if (phone.length == 10) {
    arr[0] = phone.slice(0, 3);
    arr[1] = phone.slice(3, 6);
    arr[2] = phone.slice(6, 10);
    var formattedDate = "(" + arr[0] + ") " + arr[1] + "-" + arr[2];
    $("#phone").val(formattedDate);
  }
});

var button = $('button[type="submit"]');
function validate(element) {
  button.prop("disabled", true);
  var curInputs = $(element).find("input");
  var isValid = true;
  for (var i = 0; i < curInputs.length; i++) {
    if (!curInputs[i].validity.valid) {
      isValid = false;
      var msg = "Invalid format.";

      if (curInputs[i].validity.valueMissing) {
        msg = "This field is required.";
      } else if (curInputs[i].validity.typeMismatch) {
        msg = "Invalid format.";
      } else if (curInputs[i].validity.tooShort) {
        msg = `This field should be at least ${curInputs[i].minLength} characters; you entered ${curInputs[i].value.length}.`;
      } else if (
        curInputs[i].validity.rangeOverflow ||
        curInputs[i].validity.rangeUnderflow
      ) {
        msg = `This field should be at least ${curInputs[i].min} characters; you entered ${curInputs[i].max}.`;
      }

      $(curInputs[i]).addClass("is-invalid");
      $(curInputs[i])
        .parent()
        .append('<div class="invalid-feedback">' + msg + "</span>");
    }
  }
  return isValid;
}
$(document).on("submit", ".contact-form-2", function (e) {
  e.preventDefault();
  $(this).find(":submit").prop("disabled", true);
  $(".is-invalid").removeClass("is-invalid");
  $(".invalid-feedback").remove();
  $(".submitted").remove();
  $(".validation-error").remove();
  var valid = validate($(this));
  if (valid == false) {
    $("html, body").animate(
      {
        scrollTop: $("div.invalid-feedback:first").offset().top - 230,
      },
      1000
    );
  } else {
    $.ajax({
      headers: {
        "X-CSRF-TOKEN": $("meta[name*='csrf-token']").attr("content"),
      },
      url: $(this).attr("action"),
      data: $(".contact-form-2").serialize(),
      type: "POST",
      dataType: "JSON",
      success: function (response) {
        if (response.result) {
          swal({
            title: "Successfull registered",
            icon: "success",
            button: "Ok",
            closeOnClickOutside: false,
            closeOnEsc: false,
          }).then((close) => {
            window.location.reload();
          });
        }
      },
      error: function (response) {
        $.each(response.responseJSON.errors, function (key, val) {
          $('[name="' + key + '"]')
            .parent()
            .after(
              '<span class="invalid-feedback d-block text-center" role="alert"><strong>' +
                val +
                "</strong></span>"
            );
        });
        $(".contact-form-2").find(":submit").prop("disabled", false);
      },
    });
  }
});
$(".send-message").on("click", function () {
  $(".question-form").addClass("d-none");
  $(".form-contact").removeClass("d-none");
});
$(document).on("submit", ".contact-form", function (e) {
  e.preventDefault();
  $(this).find(":submit").prop("disabled", true);
  $(".is-invalid").removeClass("is-invalid");
  $(".invalid-feedback").remove();
  $(".submitted").remove();
  $(".validation-error").remove();
  var valid = validate($(this));
  if (valid == false) {
    $("html, body").animate(
      {
        scrollTop: $("div.invalid-feedback:first").offset().top - 230,
      },
      1000
    );
  } else {
    $.ajax({
      type: "POST",
      url: $(this).attr("action"),
      data: $(this).serialize(),
      dataType: "JSON",
      context: this,
      success: function (response) {
        if (response.result == "success") {
          $(this).prepend(
            '<label class="submitted btn-green w-100 mb-4 text-center py-2 rounded">Submitted successfully</label>'
          );
          $(this).find(":submit").addClass("btn-success").text("Sent");
          $(this).find(":submit").prop("disabled", true);
          $(".contact-form")[0].reset();
        } else {
          turnstile.ready(function () {
            turnstile.render("#recaptcha", {
              sitekey: $("#key_turnstile").val(),
              callback: function (token) {},
            });
          });
          $(".validation_error").remove();
          $.each(response.errors, function (key, val) {
            $('[name="' + key + '"]').after(
              '<div class="validation-error">' + val + "</div>"
            );
          });
          $(this).find(":submit").prop("disabled", false);
          $(this).find(":submit").addClass("btn-danger").text("Try Again");
        }
      },
      error: function (response) {
        turnstile.ready(function () {
          turnstile.render("#recaptcha", {
            sitekey: $("#key_turnstile").val(),
            callback: function (token) {},
          });
        });
        $.each(response.responseJSON.errors, function (key, val) {
          $('[name="' + key + '"]').after(
            '<span class="invalid-feedback d-block" role="alert"><strong>' +
              val +
              "</strong></span>"
          );
        });
        $(".contact-form").find(":submit").prop("disabled", false);
      },
    });
  }
});
$("form").on("keyup change paste", ":input", function () {
  $(":input").removeClass("invalid_input");
  $(":input").next(".invalid-feedback").remove();
  $(":input").siblings("span:not('.custom-switch-indicator')").remove();
  button.prop("disabled", false);
  button.html(button.data("value"));
});
/* end formValidate */
function generatePass(elementHTML) {
  var pass = "";
  var str =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
    "abcdefghijklmnopqrstuvwxyz0123456789@#$" +
    "...,,,.{}.[]+-,;:_";
  for (i = 1; i <= 12; i++) {
    var char = Math.floor(Math.random() * str.length + 1);
    pass += str.charAt(char);
  }

  $(elementHTML).val(pass);
}
$("#password").on("keyup", function () {
  $.strength($("#progress-bar"), $("#password").val());
});
$(function () {
  $.strength = function (element, password) {
    var desc = [
      { width: "0%" },
      { width: "20%" },
      { width: "40%" },
      { width: "60%" },
      { width: "80%" },
      { width: "100%" },
    ];
    var descClass = [
      "",
      "bg-danger",
      "bg-danger",
      "bg-warning",
      "bg-success",
      "bg-success",
    ];
    var score = 0;

    if (password.length > 0) {
      score++;
    }

    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) {
      score++;
    }

    if (password.match(/\d+/)) {
      score++;
    }

    if (password.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)) {
      score++;
    }

    if (password.length > 10) {
      score++;
    }
    for (let i = 0; i < descClass.length; i++) {
      element.removeClass(descClass[i]);
    }
    element.addClass(descClass[score]).css(desc[score]);
  };
});
