let tg = window.Telegram.WebApp;
const params = new URLSearchParams(location.search);
const short = params.get("short") || "Board";
const board = params.get("board") || "Education Board";
const className = params.get("class") || "Class";
const sourceUrl = params.get("sourceUrl") || "";
const year = params.get("year"); // या ज़रूरत अनुसार सेट करो
tg.expand();

const user = tg.initDataUnsafe.user;

document.addEventListener("DOMContentLoaded", () => {
  if (user && user.first_name) {
    document.getElementById("welcome").textContent = `Welcome, ${user.first_name}`;
    document.title = `${short} Result`;
    document.getElementById("subtitle").textContent = `${board} ${className} Result - ${year}`;
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
  ad.textContent = "Processing...";

  const trySendResult = () => {
    if (!resultSent) {
      resultSent = true;

      if (typeof sourceUrl === "undefined") {
        alert("Source URL not found in . Please define variable.");
        resetButton(btn);
        return;
      }

      const encodedName = encodeURIComponent(name);
      const targetUrl = `https://sainipankaj12.serv00.net/Result/Namewise/result.php?name=${encodedName}&page=1&url=${encodeURIComponent(sourceUrl)}`;
      window.location.href = targetUrl;
    }
  };

  // Show ad if available before proceeding
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
    ad.textContent = "Ad not available, proceeding...";
    trySendResult();
  }
}

function resetButton(button) {
  button.disabled = false;
  button.innerText = "Check Result";
}
