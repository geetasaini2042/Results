let tg = window.Telegram.WebApp;
tg.expand();

const botToken = "7831738668:AAH7Qc1zYoNd5DrY85kU4EN4GXY01JF91fk";  // इसे backend में रखना चाहिए
const checkAnotherUrl = "https://geetasaini2042.github.io/Results/RAJ/2022/10th/";
const user = tg.initDataUnsafe.user;

document.addEventListener("DOMContentLoaded", () => {
  if (user && user.first_name) {
    document.getElementById("welcome").textContent = `Welcome, ${user.first_name}`;
  }

  document.querySelector("button").addEventListener("click", submitResult);
});

let resultSent = false;

function submitResult() {
  resultSent = false; // <-- FIXED: reset every time user submits

  const roll = document.getElementById("roll").value.trim();
  const btn = document.querySelector("button");
  const ad = document.getElementById("adMsg");

  if (roll === "") {
    alert("Please enter your roll number.");
    return;
  }

  btn.innerText = "Please wait...";
  btn.disabled = true;
  ad.textContent = "This result service is supported by SingodiyaTech - bringing digital education closer.";

  const trySendResult = () => {
    if (!resultSent) {
      resultSent = true;
      sendResultToTelegram(roll, btn, ad);
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

function sendResultToTelegram(roll, btn, ad) {
  const pdfUrl = `https://sainipankaj12.serv00.net/Result/boardresult.php?tag=raj_10th_result&roll_no=${roll}&year=2022&wb_id=88&source=3&download`;

  fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
    method: 'POST',
    body: JSON.stringify({
      chat_id: user.id,
      document: pdfUrl,
      caption: "Your result is here!",
      reply_markup: {
        inline_keyboard: [[
          { text: "Check another result", web_app: { url: checkAnotherUrl } }
        ]]
      }
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(res => res.json())
  .then(response => {
    if (!response || response.ok !== true) {
      // Telegram fail hua — HTML show karo
      fetch(`https://sainipankaj12.serv00.net/Result/boardresult.php?tag=raj_10th_result&roll_no=${roll}&year=2022&wb_id=88&source=3&see`)
        .then(res => res.text())
        .then(html => {
          ad.innerHTML = `<div style="color: red; font-weight: bold;">${html}</div>`;
        })
        .catch(() => {
          ad.innerHTML = `<span style="color: red; font-weight: bold;">Server Error: Unable to load result. Please Try again</span>`;
        })
        .finally(() => resetButton(btn));
    } else {
      alert(`Result Sent to Telegram`);
      ad.innerHTML = `<span style="color: green;">Result Sent to Telegram!</span>`;
      resetButton(btn, true);
    }
  })
  .catch((error) => {
  

    ad.innerHTML = `<span style="color: red; font-weight: bold;">Failed to send result. Error: ${error.message || error}</span>`;

  resetButton(btn);
});
}
function resetButton(button, again = false) {
  button.disabled = false;
  button.innerText = again ? "Check Result Again" : "Check Result";
}
