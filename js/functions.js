$(window).on("load", function () {
  let tracking = getAllUrlParams();

  if (tracking.utm_source) {
    $("#utm_source").val(decodeURI(tracking.utm_source));
    setCookie("utm_source", $("#utm_source").val(), 0);
  }
  if (tracking.utm_medium) {
    $("#utm_medium").val(decodeURI(tracking.utm_medium));
    setCookie("utm_medium", $("#utm_medium").val(), 0);
  }
  if (tracking.utm_campaign) {
    $("#utm_campaign").val(decodeURI(tracking.utm_campaign));
    setCookie("utm_campaign", $("#utm_campaign").val(), 0);
  }
  if (tracking.utm_term) {
    $("#utm_term").val(decodeURI(tracking.utm_term));
    setCookie("utm_term", $("#utm_term").val(), 0);
  }
  if (tracking.utm_content) {
    $("#utm_content").val(decodeURI(tracking.utm_content));
    setCookie("utm_content", $("#utm_content").val(), 0);
  }
});

$(document).ready(function () {
  const selectHeader = $("#sticky-header");
  if (selectHeader) {
    let headerHeight = 300;

    if ($("#home-header").height() != undefined) {
      headerHeight = $("#home-header").height();
    }

    if ($("#header-section").height() != undefined) {
      headerHeight = $("#header-section").height();
    }

    const headerFixed = () => {
      if (window.scrollY > headerHeight) {
        selectHeader.addClass("sticked");
      } else {
        selectHeader.removeClass("sticked");
      }
    };

    $(window).on("load", headerFixed);
    $(document).on("scroll", headerFixed);
  }

  const framer = $("#framer-container");
  if (framer) {
    let headerHeight = 300;

    if ($("#home-header").height() != undefined) {
      headerHeight = $("#home-header").height();
    }

    if ($("#header-section").height() != undefined) {
      headerHeight = $("#header-section").height();
    }

    const framerFixed = () => {
      if (window.scrollY > headerHeight) {
        framer.fadeIn();
      } else {
        framer.fadeOut();
      }
    };

    $(window).on("load", framerFixed);
    $(document).on("scroll", framerFixed);
  }

  $(".mobile-nav-toggle").on("click", function (event) {
    event.preventDefault();
    mobileNavToogle(this);
  });

  function mobileNavToogle(el) {
    $("body").toggleClass("mobile-nav-active");
    $("#mobile-nav-show").toggleClass("d-none");
    $(".mobile-nav-hide").toggleClass("d-none");
  }

  const navDropdowns = $(".navbar .dropdown > a");

  navDropdowns.on("click", function (event) {
    if ($(".mobile-nav-active")) {
      event.preventDefault();
      $(this).toggleClass("active");
      $(this).next().toggleClass("dropdown-active");

      let dropDownIndicator = $(this).find(".dropdown-indicator");
      dropDownIndicator.toggleClass("bi-chevron-up");
      dropDownIndicator.toggleClass("bi-chevron-down");
    }
  });

  const accordion = $(".accordion");

  accordion.on("click", function () {
    $(this).toggleClass("collapsed");
    $(this).find(".accordion-body").slideToggle("fast", "swing");
  });
});

function getAllUrlParams(url) {
  var queryString = url ? url.split("?")[1] : window.location.search.slice(1);
  var obj = {};

  if (queryString) {
    queryString = queryString.split("#")[0];
    var arr = queryString.split("&");

    for (var i = 0; i < arr.length; i++) {
      var a = arr[i].split("=");
      var paramName = a[0];
      var paramValue = typeof a[1] === "undefined" ? true : a[1];

      paramName = paramName.toLowerCase();
      if (typeof paramValue === "string") paramValue = paramValue.toLowerCase();

      if (paramName.match(/\[(\d+)?\]$/)) {
        var key = paramName.replace(/\[(\d+)?\]/, "");

        if (!obj[key]) obj[key] = [];

        if (paramName.match(/\[\d+\]$/)) {
          var index = /\[(\d+)\]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
          obj[key].push(paramValue);
        }
      } else {
        if (!obj[paramName]) {
          obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === "string") {
          obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
        } else {
          obj[paramName].push(paramValue);
        }
      }
    }
  }

  return obj;
}

function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }

  document.cookie =
    name + "=" + (value || "") + expires + "; path=/;domain=sellfast.com";
}
/* front */
var placeSearch, autocomplete;
var autocompletes = [];
var componentForm = {
  street_number: "short_name",
  route: "short_name",
  locality: "short_name",
  administrative_area_level_1: "short_name",
  country: "long_name",
  postal_code: "short_name",
};

function initAutocomplete() {
  var inputs = document.getElementsByClassName("offer_autocomplete");
  for (var i = 0; i < inputs.length; i++) {
    var autocomplete = new google.maps.places.Autocomplete(inputs[i], {
      types: ["geocode"],
    });
    autocomplete.inputId = inputs[i].id;
    autocomplete.setComponentRestrictions({ country: ["us"] });
    autocomplete.addListener("place_changed", fillInAddress);
    autocompletes.push(autocomplete);
  }
}

function fillInAddress() {
  var place = this.getPlace();
  for (var component in componentForm) {
    localStorage.setItem(component, "");
    document.getElementById(component).value = "";
    document.getElementById(component).disabled = false;
  }

  for (var i = 0; i < place.address_components.length; i++) {
    var addressType = place.address_components[i].types[0];
    if (componentForm[addressType]) {
      var val = place.address_components[i][componentForm[addressType]];
      document.getElementById(addressType).value = val;
      localStorage.setItem(addressType, val);
    }
    var timestamp = new Date().getTime();
    localStorage.setItem("lifetime_address", timestamp);
  }
}
$(".offer_autocomplete").on("focus", function () {
  var index = $(this).index();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy,
      });
      autocompletes[index].setBounds(circle.getBounds());
    });
  }
});

$(".trigger--offer-autocomplete").on("click", function (e) {
  e.preventDefault();
  setTimeout(function () {
    $("#address_placeholder").submit();
  }, 500);
});
// cookies consent
$(document).ready(function () {
  if (getCookie("cookieConsentSellFast") == null) {
    $.ajax({
      headers: {
        "X-CSRF-TOKEN": $("meta[name*='csrf-token']").attr("content"),
      },
      url: "/load/cookie-consent",
      type: "POST",
      context: this,
      dataType: "JSON",
      success: function (response) {
        if (response?.content) {
          $("body").append(response.content);
        }
      },
    });
  }
  $(document).on("click", ".learn-all-cookies", function () {
    setCookie("cookieConsentSellFast", "learn-more", 365);
    window.location.href = "/learn-more";
  });
  $(document).on("click", ".accept-all-cookies", function () {
    setCookie("cookieConsentSellFast", "accept", 365);
    $(".cookies-consent").fadeOut(500);
  });
  $(document).on("click", ".x-close", function () {
    setCookie("cookieConsentSellFast", "close", 365);
    $(".cookies-consent").fadeOut(500);
  });
});
function setCookie(name, value, days) {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + days);

  const cookieValue =
    encodeURIComponent(name) +
    "=" +
    encodeURIComponent(value) +
    "; expires=" +
    expirationDate.toUTCString() +
    "; path=/";
  document.cookie = cookieValue;
}
function getCookie(cookieName) {
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(cookieName + "=")) {
      return cookie.substring(cookieName.length + 1);
    }
  }
  return null;
}
