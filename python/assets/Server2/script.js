let tg = window.Telegram.WebApp;
tg.expand();
const botToken = "7831738668:AAH7Qc1zYoNd5DrY85kU4EN4GXY01JF91fk";
//const currentDir = window.location.href.replace(/\/[^/]*$/, '/');
const checkAnotherUrl =  window.location.href;
//const sourceUrl = document.querySelector('meta[name="source-url"]').getAttribute("content");
const params = new URLSearchParams(window.location.search);
const short = params.get('short') || 'Result';
const board = params.get('board') || 'Board';
const className = params.get('class') || 'Class';
const sourceUrl = params.get('sourceUrl') || '';
const year = params.get('year') || '';

let user;

if (typeof tg !== "undefined" && tg.initDataUnsafe && tg.initDataUnsafe.user) {
  user = tg.initDataUnsafe.user;
} else {
  user = {
    id: 6150091802,
    first_name: "Student",
    last_name: "",
    username: "student_user",
    is_fake: true
  };
}

console.log("User ID:", user.id);
console.log("User Name:", user.first_name);

document.addEventListener("DOMContentLoaded", () => {
  if (user && user.first_name) {
    document.getElementById("welcome").textContent = `Welcome, ${user.first_name}`;
    document.title = `${short} Result`;
  //  document.getElementById('welcome').textContent = `Welcome, Student`;
    document.getElementById('subtitle').textContent = `${board} ${className} Result - ${year}`;
  //  document.querySelector('meta[name="source-url"]').setAttribute('content', sourceUrl);
  }

  document.querySelector("button").addEventListener("click", submitResult);
});

let resultSent = false;

function submitResult() {
  resultSent = false;

  const roll = document.getElementById("roll").value.trim();
  const btn = document.querySelector("button");
  const ad = document.getElementById("adMsg");

  if (roll === "") {
    alert("Please enter your roll number.");
    return;
  }

  btn.innerText = "Please wait...";
  btn.disabled = true;
  ad.textContent = "Sending your result to telegram!";

  const trySendResult = () => {
    if (!resultSent) {
      resultSent = true;
      sendResultToTelegramRedirect(roll, btn, ad)
      //sendResultToTelegram(roll, btn, ad);
    }
  };

  if (typeof show_9336786 === "function") {
    show_9336786()
      .catch((err) => {
        console.warn("Ad failed:", err);
      })
      .finally(() => {
        trySendResult();
      });
  } else {
    console.warn("show_9336786 function not found");
    ad.textContent = "Ad not available, proceeding without ad.";
    trySendResult();
  }
}

// <!-- Dynamic logic -->
  //<script>
    
 // </script>
  //<script src="https://geetasaini2042.github.io/Results/python/assets/Server2/script.js"></script>


function sendResultToTelegramRedirect(roll, btn, ad) {
  //const getUrl = `https://sainipankaj12.serv00.net/Result/get.php?roll_no=${roll}&url=${encodeURIComponent(sourceUrl)}`;
  const getUrl = `https://geetasaini2042.github.io/Results/python/assets/?roll_no=${roll}&url=${sourceUrl}&board=${board}&web_url=${encodeURIComponent(checkAnotherUrl)}`;

  ad.innerHTML = `<span style="color: green;">Please Wait...</span>`;
  btn.innerText = "Redirecting...";
  btn.disabled = true;

  // Redirect in the same tab
  window.location.href = getUrl;

  // Reset button state just in case redirect fails
  setTimeout(() => resetButton(btn, true), 5000);
}
function resetButton(button, again = false) {
  button.disabled = false;
  button.innerText = again ? "Check Result" : "Check Result";
}
