let tg = window.Telegram.WebApp;
tg.expand();

const user = tg.initDataUnsafe.user;
const sourceUrl = `https://rajasthan-10th-result.indiaresults.com/rj/bser/class-10-result-2024/mname-results.aspx`;

document.addEventListener("DOMContentLoaded", () => {
  if (user && user.first_name) {
    document.getElementById("welcome").textContent = `Welcome, ${user.first_name}`;
  }

  document.querySelector("button").addEventListener("click", submitResult);
});

let resultSent = false;

function submitResult() {
  resultSent = false;

  const name = document.getElementById("name").value.trim();
  const btn = document.querySelector("button");
  const ad = document.getElementById("adMsg");

  if (name === "") {
    alert("Please enter your name");
    return;
  }

  btn.innerText = "Please wait...";
  btn.disabled = true;
  ad.textContent = "I am working...";

  const trySendResult = () => {
    if (!resultSent) {
      resultSent = true;

      const now = new Date();
      const releaseTime = new Date("2025-05-28T16:00:00+05:30"); // 4:30 PM IST

      if (now < releaseTime) {
        ad.innerHTML = `<div style="color: red; font-weight: bold;">Result Not Declared yet!</div>`;
        resetButton(btn);
      } else {
        const encodedName = encodeURIComponent(name);
        //const targetUrl = `https://ai-bot-mr-singodiya.onrender.com/result-1?name=${name}&page=1&url=${sourceUrl}`//https://rajasthan-10th-result.indiaresults.com/rj/bser/class-10-result-2024/mname-results.aspx
        const targetUrl = `https://sainipankaj12.serv00.net/Result/Namewise/result.php?name=${encodedName}&page=1&url=${encodeURIComponent(sourceUrl)}`;
        window.location.href = targetUrl;
      }
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

function resetButton(button) {
  button.disabled = false;
  button.innerText = "Check Result";
}
