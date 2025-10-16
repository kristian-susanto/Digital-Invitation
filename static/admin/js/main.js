/**
 * Template Name: NiceAdmin
 * Template URL: https://bootstrapmade.com/nice-admin-bootstrap-admin-html-template/
 * Updated: Apr 7 2025 with Bootstrap v5.3.5
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */

(function () {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    if (all) {
      select(el, all).forEach((e) => e.addEventListener(type, listener));
    } else {
      select(el, all).addEventListener(type, listener);
    }
  };

  /**
   * Easy on scroll event listener
   */
  const onscroll = (el, listener) => {
    el.addEventListener("scroll", listener);
  };

  /**
   * Sidebar toggle
   */
  if (select(".toggle-sidebar-btn")) {
    on("click", ".toggle-sidebar-btn", function (e) {
      select("body").classList.toggle("toggle-sidebar");
    });
  }

  /**
   * Search bar toggle
   */
  if (select(".search-bar-toggle")) {
    on("click", ".search-bar-toggle", function (e) {
      select(".search-bar").classList.toggle("search-bar-show");
    });
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select("#navbar .scrollto", true);
  const navbarlinksActive = () => {
    let position = window.scrollY + 200;
    navbarlinks.forEach((navbarlink) => {
      if (!navbarlink.hash) return;
      let section = select(navbarlink.hash);
      if (!section) return;
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        navbarlink.classList.add("active");
      } else {
        navbarlink.classList.remove("active");
      }
    });
  };
  window.addEventListener("load", navbarlinksActive);
  onscroll(document, navbarlinksActive);

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select("#header");
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add("header-scrolled");
      } else {
        selectHeader.classList.remove("header-scrolled");
      }
    };
    window.addEventListener("load", headerScrolled);
    onscroll(document, headerScrolled);
  }

  /**
   * Back to top button
   */
  let backtotop = select(".back-to-top");
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add("active");
      } else {
        backtotop.classList.remove("active");
      }
    };
    window.addEventListener("load", toggleBacktotop);
    onscroll(document, toggleBacktotop);
  }

  /**
   * Initiate tooltips
   */
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  /**
   * Initiate quill editors
   */
  if (select(".quill-editor-default")) {
    new Quill(".quill-editor-default", {
      theme: "snow",
    });
  }

  if (select(".quill-editor-bubble")) {
    new Quill(".quill-editor-bubble", {
      theme: "bubble",
    });
  }

  if (select(".quill-editor-full")) {
    new Quill(".quill-editor-full", {
      modules: {
        toolbar: [
          [
            {
              font: [],
            },
            {
              size: [],
            },
          ],
          ["bold", "italic", "underline", "strike"],
          [
            {
              color: [],
            },
            {
              background: [],
            },
          ],
          [
            {
              script: "super",
            },
            {
              script: "sub",
            },
          ],
          [
            {
              list: "ordered",
            },
            {
              list: "bullet",
            },
            {
              indent: "-1",
            },
            {
              indent: "+1",
            },
          ],
          [
            "direction",
            {
              align: [],
            },
          ],
          ["link", "image", "video"],
          ["clean"],
        ],
      },
      theme: "snow",
    });
  }

  /**
   * Initiate TinyMCE Editor
   */

  const useDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isSmallScreen = window.matchMedia("(max-width: 1023.5px)").matches;

  tinymce.init({
    selector: "textarea.tinymce-editor",
    plugins:
      "preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons accordion",
    editimage_cors_hosts: ["picsum.photos"],
    menubar: "file edit view insert format tools table help",
    toolbar:
      "undo redo | accordion accordionremove | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | pagebreak anchor codesample | ltr rtl",
    autosave_ask_before_unload: true,
    autosave_interval: "30s",
    autosave_prefix: "{path}{query}-{id}-",
    autosave_restore_when_empty: false,
    autosave_retention: "2m",
    image_advtab: true,
    link_list: [
      {
        title: "My page 1",
        value: "https://www.tiny.cloud",
      },
      {
        title: "My page 2",
        value: "http://www.moxiecode.com",
      },
    ],
    image_list: [
      {
        title: "My page 1",
        value: "https://www.tiny.cloud",
      },
      {
        title: "My page 2",
        value: "http://www.moxiecode.com",
      },
    ],
    image_class_list: [
      {
        title: "None",
        value: "",
      },
      {
        title: "Some class",
        value: "class-name",
      },
    ],
    importcss_append: true,
    file_picker_callback: (callback, value, meta) => {
      /* Provide file and text for the link dialog */
      if (meta.filetype === "file") {
        callback("https://www.google.com/logos/google.jpg", {
          text: "My text",
        });
      }

      /* Provide image and alt text for the image dialog */
      if (meta.filetype === "image") {
        callback("https://www.google.com/logos/google.jpg", {
          alt: "My alt text",
        });
      }

      /* Provide alternative source and posted for the media dialog */
      if (meta.filetype === "media") {
        callback("movie.mp4", {
          source2: "alt.ogg",
          poster: "https://www.google.com/logos/google.jpg",
        });
      }
    },
    height: 600,
    image_caption: true,
    quickbars_selection_toolbar:
      "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
    noneditable_class: "mceNonEditable",
    toolbar_mode: "sliding",
    contextmenu: "link image table",
    skin: useDarkMode ? "oxide-dark" : "oxide",
    content_css: useDarkMode ? "dark" : "default",
    content_style:
      "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
  });

  /**
   * Initiate Bootstrap validation check
   */
  var needsValidation = document.querySelectorAll(".needs-validation");

  Array.prototype.slice.call(needsValidation).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });

  /**
   * Initiate Datatables
   */
  const datatables = select(".datatable", true);
  datatables.forEach((datatable) => {
    new simpleDatatables.DataTable(datatable, {
      perPageSelect: [5, 10, 15, ["All", -1]],
      columns: [
        {
          select: 2,
          sortSequence: ["desc", "asc"],
        },
        {
          select: 3,
          sortSequence: ["desc"],
        },
        {
          select: 4,
          cellClass: "green",
          headerClass: "red",
        },
      ],
    });
  });

  /**
   * Autoresize echart charts
   */
  const mainContainer = select("#main");
  if (mainContainer) {
    setTimeout(() => {
      new ResizeObserver(function () {
        select(".echart", true).forEach((getEchart) => {
          echarts.getInstanceByDom(getEchart).resize();
        });
      }).observe(mainContainer);
    }, 200);
  }
})();

// cek kata sandi regex
function is_password(asValue) {
  var regExp = /^[a-zA-Z0-9]{4,20}$/;
  return regExp.test(asValue);
}

/* register.html */
// kode untuk register
function registerMember() {
  let password = $("#password").val();

  // kata sandi
  $("#passwordFeedback").removeClass("text-warning");
  if (password.length === 0 || password === " ") {
    $("#passwordFeedback")
      .removeClass("valid-feedback")
      .addClass("invalid-feedback")
      .text("Kata sandi Anda kosong");
    $("#password").removeClass("is-valid").addClass("is-invalid").focus();
    return;
  } else if (!is_password(password)) {
    $("#passwordFeedback")
      .removeClass("valid-feedback")
      .addClass("invalid-feedback")
      .text("Kata sandi Anda tidak memenuhi syarat diantara 4-20 alfabet");
    $("#password").removeClass("is-valid").addClass("is-invalid").focus();
    return;
  } else {
    $("#passwordFeedback")
      .removeClass("invalid-feedback")
      .addClass("valid-feedback")
      .text("Kata sandi Anda sudah terisi di formulir ini");
    $("#password").removeClass("is-invalid").addClass("is-valid").focus();
  }

  $.ajax({
    type: "POST",
    url: "/check-password",
    data: {
      password_give: password,
    },
    success: function (response) {
      if (response["exists_password"]) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "warning",
          title: "Silahkan ulangi lagi",
        });
      } else {
        $.ajax({
          type: "POST",
          url: "/api-register-member",
          data: {
            password_give: password,
          },
          success: function (response) {
            if (response["result"] === "success") {
              const Toast = Swal.mixin({
                toast: true,
                position: "top",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                },
              });
              Toast.fire({
                icon: "success",
                title: "Berhasil mendaftar",
              });
              setTimeout(function () {
                window.location.href = "../";
              }, 3000);
            }
          },
        });
      }
    },
    error: function (xhr, status, error) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "error",
        title: "Gagal mendaftar",
      });
    },
  });
}

/* register-user.html */
// kode untuk register user
function registerUser() {
  let password = $("#password").val();

  // kata sandi
  $("#passwordFeedback").removeClass("text-warning");
  if (password.length === 0 || password === " ") {
    $("#passwordFeedback")
      .removeClass("valid-feedback")
      .addClass("invalid-feedback")
      .text("Kata sandi Anda kosong");
    $("#password").removeClass("is-valid").addClass("is-invalid").focus();
    return;
  } else if (!is_password(password)) {
    $("#passwordFeedback")
      .removeClass("valid-feedback")
      .addClass("invalid-feedback")
      .text("Kata sandi Anda tidak memenuhi syarat diantara 4-20 alfabet");
    $("#password").removeClass("is-valid").addClass("is-invalid").focus();
    return;
  } else {
    $("#passwordFeedback")
      .removeClass("invalid-feedback")
      .addClass("valid-feedback")
      .text("Kata sandi Anda sudah terisi di formulir ini");
    $("#password").removeClass("is-invalid").addClass("is-valid").focus();
  }

  $.ajax({
    type: "POST",
    url: "/check-password",
    data: {
      password_give: password,
    },
    success: function (response) {
      if (response["exists_password"]) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "warning",
          title: "Silahkan ulangi lagi",
        });
      } else {
        $.ajax({
          type: "POST",
          url: "/api-register-user",
          data: {
            password_give: password,
          },
          success: function (response) {
            if (response["result"] === "success") {
              const Toast = Swal.mixin({
                toast: true,
                position: "top",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                },
              });
              Toast.fire({
                icon: "success",
                title: "Berhasil mendaftar",
              });
              setTimeout(function () {
                window.location.href = "../";
              }, 3000);
            }
          },
        });
      }
    },
    error: function (xhr, status, error) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "error",
        title: "Gagal mendaftar",
      });
    },
  });
}

/* register-admin.html */
// kode untuk register admin
function registerAdmin() {
  let password = $("#password").val();

  // kata sandi
  $("#passwordFeedback").removeClass("text-warning");
  if (password.length === 0 || password === " ") {
    $("#passwordFeedback")
      .removeClass("valid-feedback")
      .addClass("invalid-feedback")
      .text("Kata sandi Anda kosong");
    $("#password").removeClass("is-valid").addClass("is-invalid").focus();
    return;
  } else if (!is_password(password)) {
    $("#passwordFeedback")
      .removeClass("valid-feedback")
      .addClass("invalid-feedback")
      .text("Kata sandi Anda tidak memenuhi syarat diantara 4-20 alfabet");
    $("#password").removeClass("is-valid").addClass("is-invalid").focus();
    return;
  } else {
    $("#passwordFeedback")
      .removeClass("invalid-feedback")
      .addClass("valid-feedback")
      .text("Kata sandi Anda sudah terisi di formulir ini");
    $("#password").removeClass("is-invalid").addClass("is-valid").focus();
  }

  $.ajax({
    type: "POST",
    url: "/check-password",
    data: {
      password_give: password,
    },
    success: function (response) {
      if (response["exists_password"]) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "warning",
          title: "Silahkan ulangi lagi",
        });
      } else {
        $.ajax({
          type: "POST",
          url: "/api-register-admin",
          data: {
            password_give: password,
          },
          success: function (response) {
            if (response["result"] === "success") {
              const Toast = Swal.mixin({
                toast: true,
                position: "top",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                },
              });
              Toast.fire({
                icon: "success",
                title: "Berhasil mendaftar",
              });
              setTimeout(function () {
                window.location.href = "../";
              }, 3000);
            }
          },
        });
      }
    },
    error: function (xhr, status, error) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "error",
        title: "Gagal mendaftar",
      });
    },
  });
}

/* login.html */
// kode untuk login
function loginGeneral() {
  let password = $("#password").val();

  // kata sandi
  if (password.length === 0 || password === " ") {
    $("#passwordFeedback")
      .removeClass("valid-feedback")
      .addClass("invalid-feedback")
      .text("Kata sandi Anda Kosong");
    $("#password").removeClass("is-valid").addClass("is-invalid").focus();
    return;
  } else {
    $("#passwordFeedback")
      .removeClass("invalid-feedback")
      .addClass("valid-feedback")
      .text("Kata sandi Anda sudah terisi di formulir ini");
    $("#password").removeClass("is-invalid").addClass("is-valid").focus();
  }

  $.ajax({
    type: "POST",
    url: "/api-login",
    data: {
      password_give: password,
    },
    success: function (response) {
      if (response["result"] == "success") {
        $.cookie("your_token_key", response["token"], {
          path: "/",
        });
        const Toast = Swal.mixin({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "success",
          title: "Berhasil masuk",
        });
        setTimeout(function () {
          window.location.href = "../";
        }, 3000);
      } else {
        const Toast = Swal.mixin({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "warning",
          title: "Silahkan ulangi lagi",
        });
      }
    },
    error: function (xhr, status, error) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "error",
        title: "Gagal masuk",
      });
    },
  });
}

/* guests.html */
// kode untuk tambah tamu
function addGuest() {
  let name = $("#addName").val();
  let domicileInput = $("#addDomicile"); // ambil DOM elemen (bukan hanya value)
  let domicile = domicileInput.length > 0 ? domicileInput.val() : "";
  let phoneNumberInput = $("#addPhoneNumber"); // ambil DOM elemen (bukan hanya value)
  let phoneNumber = phoneNumberInput.length > 0 ? phoneNumberInput.val() : "";

  // nama
  $("#addNameFeedback").removeClass("text-warning");
  if (name.length === 0 || name === " ") {
    $("#addNameFeedback")
      .removeClass("valid-feedback")
      .addClass("invalid-feedback")
      .text("Nama masih kosong, silahkan isi kembali");
    $("#addName").removeClass("is-valid").addClass("is-invalid").focus();
    return;
  } else {
    $("#addNameFeedback")
      .removeClass("invalid-feedback")
      .addClass("valid-feedback")
      .text("Nama sudah terisi di formulir ini");
    $("#addName").removeClass("is-invalid").addClass("is-valid").focus();
  }

  // domisili
  $("#addDomicileFeedback").removeClass("text-warning");
  if (domicileInput.length > 0) {
    if (domicile.trim().length === 0) {
      $("#addDomicileFeedback")
        .removeClass("valid-feedback")
        .addClass("invalid-feedback")
        .text("Domisili masih kosong, silahkan isi kembali");
      $("#addDomicile").removeClass("is-valid").addClass("is-invalid").focus();
      return;
    } else {
      $("#addDomicileFeedback")
        .removeClass("invalid-feedback")
        .addClass("valid-feedback")
        .text("Domisili sudah terisi di formulir ini");
      $("#addDomicile").removeClass("is-invalid").addClass("is-valid").focus();
    }
  }

  // nomor telepon
  if (phoneNumberInput.length > 0) {
    const phoneRegex = /^[1-9][0-9]{7,14}$/;

    if (phoneNumber.trim().length === 0) {
      $("#addPhoneNumberFeedback")
        .removeClass("valid-feedback")
        .addClass("invalid-feedback")
        .text("Nomor telepon masih kosong, silahkan isi kembali");
      $("#addPhoneNumber")
        .removeClass("is-valid")
        .addClass("is-invalid")
        .focus();
      return;
    } else if (phoneNumber.startsWith("0")) {
      $("#addPhoneNumberFeedback")
        .removeClass("valid-feedback")
        .addClass("invalid-feedback")
        .text(
          "Format nomor salah. Gunakan format internasional: 6281234567890 tanpa simbol/spasi"
        );
      $("#addPhoneNumber")
        .removeClass("is-valid")
        .addClass("is-invalid")
        .focus();
      return;
    } else if (!phoneRegex.test(phoneNumber)) {
      $("#addPhoneNumberFeedback")
        .removeClass("valid-feedback")
        .addClass("invalid-feedback")
        .text(
          "Format nomor salah. Gunakan format internasional: 6281234567890 tanpa simbol/spasi"
        );
      $("#addPhoneNumber")
        .removeClass("is-valid")
        .addClass("is-invalid")
        .focus();
      return;
    } else {
      $("#addPhoneNumberFeedback")
        .removeClass("invalid-feedback")
        .addClass("valid-feedback")
        .text("Nomor telepon sudah terisi di formulir ini");
      $("#addPhoneNumber")
        .removeClass("is-invalid")
        .addClass("is-valid")
        .focus();
    }
  }

  // Siapkan data POST
  let postData = { name_give: name };
  if (domicileInput.length > 0) {
    postData["domicile_give"] = domicile;
    if (phoneNumberInput.length > 0) {
      postData["phone_number_give"] = phoneNumber;
    }
  }

  $.ajax({
    type: "POST",
    url: "/add-guest",
    data: {
      name_give: name,
      domicile_give: domicile,
      phone_number_give: phoneNumber,
    },
    success: function (response) {
      if (response["result"] === "success") {
        const Toast = Swal.mixin({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "success",
          title: "Tamu berhasil dicatat",
        });
        setTimeout(() => window.location.reload(), 3000);
      } else if (response["result"] === "fail") {
        Swal.fire({
          icon: "warning",
          title: response["msg"],
          toast: true,
          position: "top",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    },
    error: function (xhr, status, error) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "error",
        title: "Gagal menambah tamu",
      });
    },
  });
}

// kode untuk ubah tamu
function editGuest(id) {
  let guestId = $(`#editGuestId_${id}`).val();
  let name = $(`#editName_${id}`).val();
  let domicile = $(`#editDomicile_${id}`).val();
  let phoneNumber = $(`#editPhoneNumber_${id}`).val();

  // id tamu
  const guestIdRegex = /^[0-9]{6}$/; // hanya angka 6 digit

  $(`#editGuestIdFeedback_${id}`).removeClass("text-warning");
  if (guestId.trim().length === 0 || guestId === " ") {
    $(`#editGuestIdFeedback_${id}`)
      .removeClass("valid-feedback")
      .addClass("invalid-feedback")
      .text("ID tamu masih kosong, silahkan isi kembali");
    $(`#editGuestId_${id}`)
      .removeClass("is-valid")
      .addClass("is-invalid")
      .focus();
    return;
  } else if (!guestIdRegex.test(guestId)) {
    $(`#editGuestIdFeedback_${id}`)
      .removeClass("valid-feedback")
      .addClass("invalid-feedback")
      .text("ID tamu harus berupa 6 digit angka (111111–999999)");
    $(`#editGuestId_${id}`)
      .removeClass("is-valid")
      .addClass("is-invalid")
      .focus();
    return;
  } else {
    $(`#editGuestIdFeedback_${id}`)
      .removeClass("invalid-feedback")
      .addClass("valid-feedback")
      .text("ID tamu sudah terisi di formulir ini");
    $(`#editGuestId_${id}`)
      .removeClass("is-invalid")
      .addClass("is-valid")
      .focus();
  }

  // nama
  $(`#editNameFeedback_${id}`).removeClass("text-warning");
  if (name.length === 0 || name === " ") {
    $(`#editNameFeedback_${id}`)
      .removeClass("valid-feedback")
      .addClass("invalid-feedback")
      .text("Nama masih kosong, silahkan isi kembali");
    $(`#editName_${id}`).removeClass("is-valid").addClass("is-invalid").focus();
    return;
  } else {
    $(`#editNameFeedback_${id}`)
      .removeClass("invalid-feedback")
      .addClass("valid-feedback")
      .text("Nama sudah terisi di formulir ini");
    $(`#editName_${id}`).removeClass("is-invalid").addClass("is-valid").focus();
  }

  // domisili
  $(`#editDomicileFeedback_${id}`).removeClass("text-warning");
  if (domicile.length === 0 || domicile === " ") {
    $(`#editDomicileFeedback_${id}`)
      .removeClass("valid-feedback")
      .addClass("invalid-feedback")
      .text("Domisili masih kosong, silahkan isi kembali");
    $(`#editDomicile_${id}`)
      .removeClass("is-valid")
      .addClass("is-invalid")
      .focus();
    return;
  } else {
    $(`#editDomicileFeedback_${id}`)
      .removeClass("invalid-feedback")
      .addClass("valid-feedback")
      .text("Domisili sudah terisi di formulir ini");
    $(`#editDomicile_${id}`)
      .removeClass("is-invalid")
      .addClass("is-valid")
      .focus();
  }

  // nomor telepon
  const phoneRegex = /^[1-9][0-9]{7,14}$/;

  if (phoneNumber.trim().length === 0) {
    $(`#editPhoneNumberFeedback_${id}`)
      .removeClass("valid-feedback")
      .addClass("invalid-feedback")
      .text("Nomor telepon masih kosong, silahkan isi kembali");
    $(`#editPhoneNumber_${id}`)
      .removeClass("is-valid")
      .addClass("is-invalid")
      .focus();
    return;
  } else if (phoneNumber.startsWith("0")) {
    $(`#editPhoneNumberFeedback_${id}`)
      .removeClass("valid-feedback")
      .addClass("invalid-feedback")
      .text(
        "Format nomor salah. Gunakan format internasional: 6281234567890 tanpa simbol/spasi"
      );
    $(`#editPhoneNumber_${id}`)
      .removeClass("is-valid")
      .addClass("is-invalid")
      .focus();
    return;
  } else if (!phoneRegex.test(phoneNumber)) {
    $(`#editPhoneNumberFeedback_${id}`)
      .removeClass("valid-feedback")
      .addClass("invalid-feedback")
      .text(
        "Format nomor salah. Gunakan format internasional: 6281234567890 tanpa simbol/spasi"
      );
    $(`#editPhoneNumber_${id}`)
      .removeClass("is-valid")
      .addClass("is-invalid")
      .focus();
    return;
  } else {
    $(`#editPhoneNumberFeedback_${id}`)
      .removeClass("invalid-feedback")
      .addClass("valid-feedback")
      .text("Nomor telepon sudah terisi di formulir ini");
    $(`#editPhoneNumber_${id}`)
      .removeClass("is-invalid")
      .addClass("is-valid")
      .focus();
  }

  $.ajax({
    type: "POST",
    url: "/edit-guest",
    data: {
      id_give: id,
      guest_id_give: guestId,
      name_give: name,
      domicile_give: domicile,
      phone_number_give: phoneNumber,
    },
    success: function (response) {
      if (response["result"] === "success") {
        Swal.fire({
          icon: "success",
          title: "Tamu berhasil diubah",
          toast: true,
          position: "top",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        setTimeout(() => window.location.reload(), 3000);
      } else if (response["result"] === "fail") {
        Swal.fire({
          icon: "warning",
          title: response["msg"],
          toast: true,
          position: "top",
          timer: 4000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    },
    error: function (xhr, status, error) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "error",
        title: "Gagal mengubah tamu",
      });
    },
  });
}

// kode untuk hapus tamu
function deleteGuest(id) {
  $.ajax({
    type: "POST",
    url: "/delete-guest",
    data: {
      id_give: id,
    },
    success: function (response) {
      if (response["result"] === "success") {
        const Toast = Swal.mixin({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "success",
          title: "Tamu berhasil dihapus",
        });
        setTimeout(() => window.location.reload(), 3000);
      }
    },
    error: function (xhr, status, error) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "error",
        title: "Gagal menghapus tamu",
      });
    },
  });
}

// fungsi untuk menyalin link ke clipboard
function copyLink(link) {
  var input = document.createElement("input");
  input.setAttribute("value", link);
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);

  // notifikasi SweetAlert
  const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  Toast.fire({
    icon: "success",
    title: "Link telah disalin",
  });
}

/* users.html */
// kode untuk tambah pengguna
function addUser() {
  let password = $("#addPassword").val();
  let role = $("#addRole").val();

  // kata sandi
  $("#addPasswordFeedback").removeClass("text-warning");
  if (password.length === 0 || password === " ") {
    $("#addPasswordFeedback")
      .removeClass("valid-feedback")
      .addClass("invalid-feedback")
      .text("Kata sandi Anda kosong");
    $("#addPassword").removeClass("is-valid").addClass("is-invalid").focus();
    return;
  } else if (!is_password(password)) {
    $("#addPasswordFeedback")
      .removeClass("valid-feedback")
      .addClass("invalid-feedback")
      .text("Kata sandi Anda tidak memenuhi syarat diantara 4-20 alfabet");
    $("#addPassword").removeClass("is-valid").addClass("is-invalid").focus();
    return;
  } else {
    $("#addPasswordFeedback")
      .removeClass("invalid-feedback")
      .addClass("valid-feedback")
      .text("Kata sandi Anda sudah terisi di formulir ini");
    $("#addPassword").removeClass("is-invalid").addClass("is-valid").focus();
  }

  // role
  if (role.length === 0 || role === " ") {
    $("#addRoleFeedback")
      .removeClass("valid-feedback")
      .addClass("invalid-feedback")
      .text("Role masih kosong, silahkan isi kembali");
    $("#addRole").removeClass("is-valid").addClass("is-invalid").focus();
    return;
  } else {
    $("#addRoleFeedback")
      .removeClass("invalid-feedback")
      .addClass("valid-feedback")
      .text("Role sudah terisi di formulir ini");
    $("#addRole").removeClass("is-invalid").addClass("is-valid").focus();
  }

  $.ajax({
    type: "POST",
    url: "/check-password",
    data: {
      password_give: password,
    },
    success: function (response) {
      if (response["exists_password"]) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "warning",
          title: "Silahkan ulangi lagi",
        });
      } else {
        $.ajax({
          type: "POST",
          url: "/add-user",
          data: {
            password_give: password,
            role_give: role,
          },
          success: function (response) {
            if (response["result"] === "success") {
              const Toast = Swal.mixin({
                toast: true,
                position: "top",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                },
              });
              Toast.fire({
                icon: "success",
                title: "Berhasil menambah pengguna",
              });
              setTimeout(() => window.location.reload(), 3000);
            }
          },
        });
      }
    },
    error: function (xhr, status, error) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "error",
        title: "Gagal menambah pengguna",
      });
    },
  });
}

// kode untuk ubah pengguna
function editUser(id) {
  let role = $(`#editRole_${id}`).val();

  $.ajax({
    type: "POST",
    url: "/edit-user",
    data: {
      id_give: id,
      role_give: role,
    },
    success: function (response) {
      if (response["result"] === "success") {
        Swal.fire({
          icon: "success",
          title: "Pengguna berhasil diubah",
          toast: true,
          position: "top",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        setTimeout(() => window.location.reload(), 3000);
      } else if (response["result"] === "fail") {
        Swal.fire({
          icon: "warning",
          title: response["msg"],
          toast: true,
          position: "top",
          timer: 4000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    },
    error: function (xhr, status, error) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "error",
        title: "Gagal mengubah pengguna",
      });
    },
  });
}

// reset kata sandi pengguna
function resetUser(id) {
  $.ajax({
    type: "POST",
    url: "/reset-user",
    data: {
      id_give: id,
    },
    success: function (response) {
      if (response["result"] === "success") {
        const newPassword = response["new_password"];

        navigator.clipboard.writeText(newPassword).catch(() => {}); // salin otomatis

        Swal.fire({
          icon: "success",
          title: "Password berhasil di-reset!",
          html: `
            <div style="margin-bottom: 10px;">
              <label><b>Password Baru:</b></label><br/>
              <div style="position: relative; display: inline-block; width: 100%;">
                <input type="password" id="passwordField" class="form-control" value="${newPassword}" readonly style="padding-right: 40px;" />
                <button type="button" id="togglePassword" style="
                  position: absolute;
                  top: 50%;
                  right: 10px;
                  transform: translateY(-50%);
                  background: none;
                  border: none;
                  font-size: 1.2em;
                  color: #555;
                  cursor: pointer;">
                  <i class="bi bi-eye" id="eyeIcon"></i>
                </button>
              </div>
            </div>
            <div style="text-align: left;">
              <p><small style="color:gray;">Password telah disalin otomatis ke clipboard</small></p>
              <button id="copyBtn" class="swal2-confirm swal2-styled" style="background-color: #3085d6; margin-bottom: 10px;">
                <i class="bi bi-clipboard"></i> Salin Ulang
              </button>
            </div>
          `,
          showConfirmButton: true,
          confirmButtonText: "Tutup",
          didOpen: () => {
            const copyBtn = Swal.getPopup().querySelector("#copyBtn");
            const passwordField =
              Swal.getPopup().querySelector("#passwordField");
            const toggleBtn = Swal.getPopup().querySelector("#togglePassword");
            const eyeIcon = Swal.getPopup().querySelector("#eyeIcon");

            copyBtn.addEventListener("click", () => {
              navigator.clipboard.writeText(passwordField.value).then(() => {
                copyBtn.innerHTML =
                  '<i class="bi bi-check-circle"></i> Disalin!';
                setTimeout(() => {
                  copyBtn.innerHTML =
                    '<i class="bi bi-clipboard"></i> Salin Ulang';
                }, 1500);
              });
            });

            toggleBtn.addEventListener("click", () => {
              if (passwordField.type === "password") {
                passwordField.type = "text";
                eyeIcon.classList.remove("bi-eye");
                eyeIcon.classList.add("bi-eye-slash");
              } else {
                passwordField.type = "password";
                eyeIcon.classList.remove("bi-eye-slash");
                eyeIcon.classList.add("bi-eye");
              }
            });
          },
        }).then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: response["msg"],
        });
      }
    },
    error: function () {
      Swal.fire({
        icon: "error",
        title: "Terjadi kesalahan",
        text: "Tidak dapat mereset password saat ini.",
      });
    },
  });
}

// kode untuk hapus pengguna
function deleteUser(id) {
  $.ajax({
    type: "POST",
    url: "/delete-user",
    data: {
      id_give: id,
    },
    success: function (response) {
      if (response["result"] === "success") {
        const Toast = Swal.mixin({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "success",
          title: "Pengguna berhasil dihapus",
        });
        setTimeout(() => window.location.reload(), 3000);
      }
    },
    error: function (xhr, status, error) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "error",
        title: "Gagal menghapus pengguna",
      });
    },
  });
}

// unduh file Excel
function downloadExcel() {
  $("#confirmExcelDownload").modal("hide");
  window.open(`/download-report/${currentCollection}/excel`, "_blank");
}

// unduh file PDF
function downloadPDF() {
  $("#confirmPDFDownload").modal("hide");
  window.open(`/download-report/${currentCollection}/pdf`, "_blank");
}

/* cards.html */
// kode untuk memperbarui kartu undangan
function updateCard(id) {
  const data = {
    id_give: id,
    groom_nicknames: $("#groomNicknames").val(),
    bride_nicknames: $("#brideNicknames").val(),
    full_name_groom: $("#fullNameGroom").val(),
    full_name_bride: $("#fullNameBride").val(),
    full_name_mother_groom: $("#fullNameMotherGroom").val(),
    full_name_mother_bride: $("#fullNameMotherBride").val(),
    full_name_father_groom: $("#fullNameFatherGroom").val(),
    full_name_father_bride: $("#fullNameFatherBride").val(),
    opening_sentence: $("#openingSentence").val(),
    countdown_date: $("#countdownDate").val(),
    beginning_location_sentence: $("#beginningLocationSentence").val(),
    end_location_sentence: $("#endLocationSentence").val(),
    wedding_day: $("#weddingDay").val(),
    wedding_date: $("#weddingDate").val(),
    wedding_month_year: $("#weddingMonthYear").val(),
    wedding_time: $("#weddingTime").val(),
    wedding_venue: $("#weddingVenue").val(),
    wedding_address: $("#weddingAddress").val(),
    pin_wedding_location_map: $("#pinWeddingLocationMap").val(),
    wedding_map: $("#weddingMap").val(),
    reception_day: $("#receptionDay").val(),
    reception_date: $("#receptionDate").val(),
    reception_month_year: $("#receptionMonthYear").val(),
    reception_time: $("#receptionTime").val(),
    reception_venue: $("#receptionVenue").val(),
    reception_address: $("#receptionAddress").val(),
    pin_reception_location_map: $("#pinReceptionLocationMap").val(),
    reception_map: $("#receptionMap").val(),
    invitation_sentence: $("#invitationSentence").val(),
    closing_sentence: $("#closingSentence").val(),
  };

  $.ajax({
    type: "POST",
    url: "/update-card",
    data: data,
    success: function (response) {
      if (response.result === "success") {
        Swal.fire({
          icon: "success",
          title: "Kartu berhasil diperbarui",
          toast: true,
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          position: "top",
        });
        setTimeout(() => window.location.reload(), 3000);
      } else {
        Swal.fire({
          icon: "warning",
          title: response.msg || "Gagal memperbarui kartu",
          toast: true,
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          position: "top",
        });
      }
    },
    error: function () {
      Swal.fire({
        icon: "error",
        title: "Terjadi kesalahan saat mengirim data",
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        position: "top",
      });
    },
  });
}

/* guestbook.html */
let guestData = []; // untuk autocomplete

// Panggil data tamu saat halaman dimuat
$(document).ready(function () {
  $.ajax({
    type: "GET",
    url: "/get-guest-list",
    success: function (response) {
      guestData = response.guests.map(function (guest) {
        return {
          label: guest.name,
          value: guest.name,
          id: guest._id,
          domicile: guest.domicile,
        };
      });

      // Inisialisasi autocomplete
      $("#guestNameInput").autocomplete({
        source: guestData,
        select: function (event, ui) {
          $("#guestIdHidden").val(ui.item.id);
          $("#guestDomicile").val(ui.item.domicile);
        },
      });
    },
    error: function () {
      console.error("Gagal mengambil data tamu");
    },
  });
});

// Submit kehadiran
function noteGuestFromGuestbook() {
  const guestId = document.getElementById("guestIdHidden").value;
  if (!guestId) {
    Swal.fire(
      "Peringatan",
      "Silakan pilih nama tamu terlebih dahulu.",
      "warning"
    );
    return;
  }

  $.ajax({
    type: "POST",
    url: "/note-guest-from-guestbook",
    data: { id_give: guestId },
    success: function (response) {
      if (response.result === "success") {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Tamu berhasil dicatat hadir.",
          timer: 3000,
          showConfirmButton: false,
        }).then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire(
          "Gagal",
          response.msg || "Tamu tidak dapat dicatat.",
          "error"
        );
      }
    },
    error: function () {
      Swal.fire("Error", "Terjadi kesalahan saat mencatat kehadiran.", "error");
    },
  });
}

/* logout */
// kode untuk logout
function logout() {
  $.removeCookie("your_token_key", { path: "../" });
  const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
    showClass: {
      popup: `
        animate__animated
        animate__zoomIn
      `,
    },
  });
  Toast.fire({
    icon: "success",
    title: "Berhasil keluar",
  });
  setTimeout(function () {
    window.location.href = "../";
  }, 3000);
}
