let tg = window.Telegram.WebApp;
tg.expand();

const botToken = "7831738668:AAH7Qc1zYoNd5DrY85kU4EN4GXY01JF91fk";  // इसे backend में रखना चाहिए

// Automatically get checkAnotherUrl from current path
const currentDir = window.location.href.replace(/\/[^/]*$/, '/');
const checkAnotherUrl = currentDir + 'index.html';
const sourceUrl = document.querySelector('meta[name="source-url"]').getAttribute("content");

const user = tg.initDataUnsafe.user;

document.addEventListener("DOMContentLoaded", () => {
  if (user && user.first_name) {
    document.getElementById("welcome").textContent = `Welcome, ${user.first_name}`;
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
  const getUrl = `https://sainipankaj12.serv00.net/Result/get.php?roll_no=${roll}&url=${encodeURIComponent(sourceUrl)}`;

  fetch(getUrl)
    .then(response => {
      if (response.status === 200) {
        const savePdfUrl = `https://sainipankaj12.serv00.net/savepdf.php?url=${encodeURIComponent(getUrl)}`;
        
        return fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
          method: 'POST',
          body: JSON.stringify({
            chat_id: user.id,
            document: savePdfUrl,
            caption: `*Board:* UPMSP\n*Class:* 10th\n*Roll No:* \`${roll}\``,
            parse_mode: "Markdown",
            reply_markup: {
              inline_keyboard: [[
                { text: "Check another result", web_app: { url: checkAnotherUrl } }
              ]]
            }
          }),
          headers: {
            "Content-Type": "application/json"
          }
        });
      } else if (response.status === 400) {
        return response.text().then(text => {
          ad.innerHTML = `<div style="color: red; font-weight: bold;">Result Not Declared</div>`;
          resetButton(btn);
          throw new Error("Handled 400 error");
        });
      } else {
        throw new Error(`Unexpected status: ${response.status}`);
      }
    })
    .then(res => res.json())
    .then(response => {
      if (!response || response.ok !== true) {
        ad.innerHTML = `<span style="color: red; font-weight: bold;">Telegram Error: Could not send result.</span>`;
        resetButton(btn);
      } else {
        alert(`Result Sent to Telegram`);
        ad.innerHTML = `<span style="color: green;">Result Sent on your Telegram Account!</span>`;
        resetButton(btn, true);
      }
    })
    .catch((error) => {
      if (error.message !== "Handled 400 error") {
        ad.innerHTML = `<span style="color: red; font-weight: bold;">Failed to send result. Error: ${error.message || error}</span>`;
        resetButton(btn);
      }
    });
}

function resetButton(button, again = false) {
  button.disabled = false;
  button.innerText = again ? "Check Result" : "Check Result";
}
