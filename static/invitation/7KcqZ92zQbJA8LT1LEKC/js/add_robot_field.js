var messageInput = document.createElement("input");
messageInput.setAttribute("type", "text");
messageInput.setAttribute("name", "robot_field");
messageInput.setAttribute("placeholder", "Enter your message");
messageInput.setAttribute("class", "d-none");

// Create the form start time input
var formStartTimeInput = document.createElement("input");
formStartTimeInput.setAttribute("type", "text");
formStartTimeInput.setAttribute("name", "form_start_time");
formStartTimeInput.setAttribute("value", Math.floor(Date.now() / 1000)); // Current time in seconds
formStartTimeInput.setAttribute("class", "d-none");

// Create the bot check input
var botCheckInput = document.createElement("input");
botCheckInput.setAttribute("type", "hidden");
botCheckInput.setAttribute("name", "bot_check");
botCheckInput.setAttribute("id", "bot_check");
botCheckInput.setAttribute("value", 232321 + 3202322); // Example bot check value (you can adjust this logic)
botCheckInput.setAttribute("class", "d-none");

var guestbookForm = document.querySelector(".guestbook_form_wrapper form");
if (guestbookForm) {
  guestbookForm.insertBefore(
    messageInput,
    guestbookForm.lastElementChild.previousElementSibling
  );
  guestbookForm.insertBefore(
    formStartTimeInput,
    guestbookForm.lastElementChild.previousElementSibling
  );
  guestbookForm.insertBefore(
    botCheckInput,
    guestbookForm.lastElementChild.previousElementSibling
  );
}

//guest type
var guestTypeInput = document.createElement("input");
guestTypeInput.setAttribute("type", "text");
guestTypeInput.setAttribute("name", "guest_type");
guestTypeInput.setAttribute("class", "d-none");
guestTypeInput.setAttribute("value", guest_type);

var guestbookForm = document.querySelector(".guestbook_form_wrapper form");
if (guestbookForm)
  guestbookForm.insertBefore(
    guestTypeInput,
    guestbookForm.lastElementChild.previousElementSibling
  );

//rsvp
var guestTypeRsvpInput = document.createElement("input");
guestTypeRsvpInput.setAttribute("type", "text");
guestTypeRsvpInput.setAttribute("name", "guest_type");
guestTypeRsvpInput.setAttribute("class", "d-none");
guestTypeRsvpInput.setAttribute("value", guest_type);

var rsvpForm = document.querySelector("#cardRSVP form");
if (rsvpForm)
  rsvpForm.insertBefore(
    guestTypeRsvpInput,
    rsvpForm.lastElementChild?.previousElementSibling
  );

//gift angpo
var guestTypeAngpaoInput = document.createElement("input");
guestTypeAngpaoInput.setAttribute("type", "text");
guestTypeAngpaoInput.setAttribute("name", "guest_type");
guestTypeAngpaoInput.setAttribute("class", "d-none");
guestTypeAngpaoInput.setAttribute("value", guest_type);

var angpaoForm = document.querySelector(".angpao form");
if (angpaoForm)
  angpaoForm.insertBefore(
    guestTypeAngpaoInput,
    angpaoForm.lastElementChild.previousElementSibling
  );

// function addMaxLengthInput() {
var countCharInput = document.createElement("input");
countCharInput.setAttribute("type", "number");
countCharInput.setAttribute("id", "comment_length");
countCharInput.setAttribute("name", "comment_length");
countCharInput.setAttribute("class", "d-none");
countCharInput.setAttribute("value", 0);
countCharInput.setAttribute(
  "data-stepper_id",
  "{{$stepper->stepper_domain->id}}"
);
var guestbookForm = document.querySelector(".guestbook_form_wrapper form");
if (guestbookForm)
  guestbookForm.insertBefore(
    countCharInput,
    guestbookForm.lastElementChild.previousElementSibling
  );
// }

// addMaxLengthInput();

function setMaxCharacters(textareaName, maxCharacters) {
  var charCountContainer = document.createElement("div");
  charCountContainer.id = "charCountContainer";
  // charCountContainer.style.marginTop = 0;
  charCountContainer.style.marginBottom = "3px";

  var textarea = document.getElementsByName(textareaName)[0];
  textarea.maxLength = maxCharacters;
  var inputGroupDiv = textarea.closest(".mb-3");
  if (inputGroupDiv) {
    inputGroupDiv.classList.add("textarea-wrapper");
    inputGroupDiv.classList.remove("mb-3");
    inputGroupDiv.insertAdjacentElement("afterend", charCountContainer);
  } else {
    textarea.parentNode.insertBefore(charCountContainer, textarea.nextSibling);
  }
  var bodyColor = getComputedStyle(document.body).color;

  var charCount = document.createElement("div");
  charCount.id = "charCount";
  charCount.textContent = `${
    invitation_lang == "en" ? "Characters left" : "Huruf yang Tersisa"
  }: ${maxCharacters}`;
  charCount.style.textAlign = "left";
  // charCount.style.color = bodyColor;
  // charCount.style.marginTop = 0;
  charCountContainer.appendChild(charCount);

  var currentCharacters = 0;
  textarea.addEventListener("input", function () {
    currentCharacters = this.value.length;
    countCharInput.setAttribute("value", parseInt(currentCharacters));
    charCount.textContent = `${
      invitation_lang == "en" ? "Characters left" : "Huruf yang Tersisa"
    }: ${maxCharacters - currentCharacters}`;
  });

  textarea.addEventListener("keyup", function () {
    countCharInput.setAttribute("value", parseInt(textarea.value.length));
  });

  var btnForm = document.getElementById("guestbook_form");
  btnForm.addEventListener("click", function (event) {
    if (countCharInput.value != currentCharacters) {
      alert("Kamu telah melakukan pengeditan Form! ");
      event.preventDefault();
    }
  });
}

if (stepper_id !== 9787) {
  if (guestbookForm) setMaxCharacters("comment", 300);
}

// Define mapping
const paymentMap = {
  13736: 50000,
  23301: 50000,
  23760: 99000,
  23761: 179000,
};

// Look up value based on stepper_id
const amount = paymentMap[stepper_id];

if (amount) {
  const paymentInput = document.querySelector('input[name="payment"]');
  if (paymentInput) {
    paymentInput.value = amount;
    paymentInput.disabled = true;
  }

  const form = document.getElementById("formGift");
  if (form) {
    // Ensure hidden input exists or add one
    let hiddenInput = form.querySelector(
      'input[type="hidden"][name="payment"]'
    );
    if (!hiddenInput) {
      hiddenInput = document.createElement("input");
      hiddenInput.type = "hidden";
      hiddenInput.name = "payment";
      form.appendChild(hiddenInput);
    }
    hiddenInput.value = amount;

    // Update button text
    const button = form.querySelector(".btn-custom");
    if (button) {
      button.textContent = "Purchase";
    } else {
      console.warn('No button with class "btn-custom" found inside #formGift.');
    }
  } else {
    console.warn('Form with id "formGift" not found.');
  }
}

const guestName = document.querySelector("h6.greeting-name-text");
const leftContent = document.querySelector("h6.left");
const svg = document.querySelector("h6 span.ml-2");
if (svg) {
  if (guestName) {
    guestName.style.display = "flex";
    guestName.style.flexWrap = "wrap";
    guestName.style.alignItems = "center";
    // guestName.style.lineHeight = '45px';
    svg.style.marginLeft = "0.5rem";
    if (!leftContent) guestName.style.justifyContent = "center";
  }
}
const input_name_angpao = document.getElementById("name_angpao");

if (input_name_angpao && !input_name_angpao.hasAttribute("name")) {
  input_name_angpao.setAttribute("name", "name");
}
const selectStatus = document.querySelector('select[name="status"]');

if (selectStatus && !selectStatus.hasAttribute("required")) {
  selectStatus.setAttribute("required", "");
}

const giftTextMap = {
  13736: "Picnic Story Vol.1", // testing account
  23760: "Picnic Story Vol.1",
  23761: "Picnic Story Vol.1",
};

const textGiftCouple = document.getElementById("text_gift_couple");

if (textGiftCouple && giftTextMap[stepper_id]) {
  textGiftCouple.textContent = giftTextMap[stepper_id];
}

const amountGiftTextMap = {
  13736: "Amount of Purchase", // testing account
  23760: "Amount of Purchase",
  23761: "Amount of Purchase",
};

const amountGiftText = document.getElementById("text_gift_total");

if (amountGiftTextMap && amountGiftTextMap[stepper_id]) {
  amountGiftText.textContent = amountGiftTextMap[stepper_id];
}

const totalGiftTextMap = {
  13736: "Total", // testing account
  23760: "Total",
  23761: "Total",
};

const totalGiftText = document.getElementById("text_gift_total_send");

if (totalGiftTextMap && totalGiftTextMap[stepper_id]) {
  totalGiftText.textContent = totalGiftTextMap[stepper_id];
}

var form = document.getElementById("guestbook_form");
if (form) {
  var nameInput = form.querySelector('input[name="name"]');
  if (stepper_id == 23432) {
    if (nameInput && nameInput.value) {
      nameInput.value = "";
      nameInput.removeAttribute("readonly");
    }
  }
}

if (stepper_id == 22649) {
  const newTitle = document.createElement("h3");
  newTitle.textContent = couple; // Change this text to your desired title
  newTitle.className = "text-center text-dark mb-4"; // Add your desired classes here

  // Get the reference elements
  const rsvpCard = document.getElementById("rsvp_card");
  const rowElement = rsvpCard.querySelector(".row");

  // Insert the new title between rsvp_card and the row
  rsvpCard.insertBefore(newTitle, rowElement);
}
const form_rsvp = document.querySelector("#tambahdata");
if (form_rsvp && stepper_id == 23635) {
  const jumlahInput = form_rsvp.querySelector("input[name='jumlah']");
  if (jumlahInput) {
    jumlahInput.value = 2;
    jumlahInput.readOnly = true;
    jumlahInput.type = "hidden";
  }
  const jumlahSelect = form_rsvp.querySelector("select[name='jumlah']");
  if (jumlahSelect) {
    jumlahSelect.innerHTML = '<option value="2" selected hidden>2</option>';
    jumlahSelect.value = 2;
    jumlahSelect.style.display = "none";
  }
}

// change theme
// function changeTheme() {
//     fetch('/test-theme')
//         .then(response => response.json())
//         .then(data => {
//             console.log('API response:', data);
//             location.reload()
//         })
//         .catch(error => {
//             console.error('Error calling the API:', error);
//             location.reload()
//         });

// }
// setInterval(changeTheme, 10000)
