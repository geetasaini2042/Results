let tg = window.Telegram.WebApp;
tg.expand();

const checkAnotherUrl = "https://geetasaini2042.github.io/Results/RAJ/2025/10th/Server3/";
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
  ad.textContent = "Loading ad...";

  const tryOpenLink = () => {
    // Create a backend that creates a temp result page and redirect there
    const redirectUrl = `https://sainipankaj12.serv00.net/Result/Server3.php?roll_no=${roll}`;

    tg.openLink(redirectUrl);
    btn.innerText = "Check Result";
    btn.disabled = false;
    ad.textContent = "";
  };

  if (typeof show_9336786 === "function") {
    show_9336786()
      .catch((err) => console.warn("Ad error:", err))
      .finally(() => {
        tryOpenLink();
      });
  } else {
    ad.textContent = "Ad not available, opening result...";
    tryOpenLink();
  }
}
