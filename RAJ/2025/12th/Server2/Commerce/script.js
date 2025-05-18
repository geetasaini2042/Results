let tg = window.Telegram.WebApp;
tg.expand();

// Bot token should NOT be exposed in frontend!
const botToken = "7831738668:AAH7Qc1zYoNd5DrY85kU4EN4GXY01JF91fk";
const checkAnotherUrl = "https://geetasaini2042.github.io/Results/RAJ/2025/12th/";

// Fallback for redirected URL
const urlParams = new URLSearchParams(window.location.search);
const fallbackUser = {
  first_name: urlParams.get("first_name") || "Student",
  id: urlParams.get("user_id") || null
};

// Get user from Telegram WebApp or fallback
const user = tg.initDataUnsafe?.user || fallbackUser;

document.addEventListener("DOMContentLoaded", () => {
  if (user?.first_name) {
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

  if (!user?.id) {
    alert("Telegram user ID missing.");
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
    show_9336786().catch(console.warn).finally(trySendResult);
  } else {
    console.warn("Ad not available");
    ad.textContent = "Ad not available, proceeding without ad.";
    trySendResult();
  }
}

function sendResultToTelegram(roll, btn, ad) {
  const sourceUrl = `https://rj-12-commerce-result.indiaresults.com/rj/bser/class-12-commerce-result-2024/mrollresult.asp`;
  const getUrl = `https://sainipankaj12.serv00.net/Result/get.php?roll_no=${roll}&url=${encodeURIComponent(sourceUrl)}`;
  const savePdfUrl = `https://sainipankaj12.serv00.net/savepdf.php?url=${encodeURIComponent(getUrl)}`;

  fetch(getUrl)
    .then(response => {
      if (response.status === 200) {
        return fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: user.id,
            document: savePdfUrl,
            caption: `*Board:* Rajasthan\n*Class:* 10th\n*Roll No:* \`${roll}\``,
            parse_mode: "Markdown",
            reply_markup: {
              inline_keyboard: [[
                { text: "Check another result", web_app: { url: checkAnotherUrl } }
              ]]
            }
          })
        });
      } else if (response.status === 400) {
        return response.text().then(text => {
          ad.innerHTML = `<div style="color: red; font-weight: bold;">${text}</div>`;
          resetButton(btn);
          throw new Error("Handled 400 error");
        });
      } else {
        throw new Error(`Unexpected status: ${response.status}`);
      }
    })
    .then(res => res.json())
    .then(response => {
      if (!response?.ok) {
        ad.innerHTML = `<span style="color: red; font-weight: bold;">Telegram Error: Could not send result.</span>`;
        resetButton(btn);
      } else {
        alert("Result Sent to Telegram");
        ad.innerHTML = `<span style="color: green;">Result Sent on your Telegram Account!</span>`;
        resetButton(btn, true);
      }
    })
    .catch(error => {
      if (error.message !== "Handled 400 error") {
        ad.innerHTML = `<span style="color: red; font-weight: bold;">Failed to send result. Error: ${error.message || error}</span>`;
        resetButton(btn);
      }
    });
}

function resetButton(button, again = false) {
  button.disabled = false;
  button.innerText = "Check Result";
}
