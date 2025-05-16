let tg = window.Telegram.WebApp;
tg.expand();

const botToken = "7831738668:AAH7Qc1zYoNd5DrY85kU4EN4GXY01JF91fk";  // इसे backend में रखना चाहिए
const checkAnotherUrl = "https://geetasaini2042.github.io/Results/RAJ/2025/10th/";
const user = tg.initDataUnsafe.user;

document.addEventListener("DOMContentLoaded", () => {
  if (user && user.first_name) {
    document.getElementById("welcome").textContent = `Welcome, ${user.first_name}`;
  }

  document.querySelector("button").addEventListener("click", submitResult);
});

function submitResult() {
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

  if (typeof show_9336786 === "function") {
    show_9336786().then(() => {
      sendResultToTelegram(roll, btn, ad);
    }).catch(() => {
      ad.textContent = "Ad skipped or failed. Please try again.";
      resetButton(btn);
    });
  } else {
    console.error("show_9336786 function not found");
    ad.textContent = "Unable to show ad. Try again.";
    resetButton(btn);
  }
}

function sendResultToTelegram(roll, btn, ad) {
  const pdfUrl = `https://sainipankaj12.serv00.net/Result/boardresult.php?tag=raj_10th_result&roll_no=${roll}&year=2024&wb_id=88&source=3&download`;

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
    if (!response.ok) {
      // Agar Telegram par document fail ho gaya, to PHP result ko raw HTML me show karein
      fetch(`https://sainipankaj12.serv00.net/Result/boardresult.php?tag=raj_10th_result&roll_no=${roll}&year=2024&wb_id=88&source=3&see`)
        .then(res => res.text())
        .then(html => {
          ad.innerHTML = `<div style="color: red; font-weight: bold;">${html}</div>`;
        })
        .catch(() => {
          ad.innerHTML = `<span style="color: red; font-weight: bold;">Server Error: Unable to load result.</span>`;
        })
        .finally(() => resetButton(btn));
    } else {
      tg.showAlert(`Result Sent to Telegram`);
      ad.innerHTML = `<span style="color: green;">Result Sent to Telegram!</span>`;
      window.location.href = `https://sainipankaj12.serv00.net/Result/boardresult.php?tag=raj_10th_result&roll_no=${roll}&year=2024&wb_id=88&source=3&see`;
      resetButton(btn, true);
    }
  })
  .catch(() => {
    ad.innerHTML = `<span style="color: red; font-weight: bold;">Failed to send result. Try again later.</span>`;
    resetButton(btn);
  });
}

function resetButton(button, again = false) {
  button.disabled = false;
  button.innerText = again ? "Check Result Again" : "Check Result";
}
