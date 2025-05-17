let tg = window.Telegram.WebApp;
tg.expand();

const checkAnotherUrl = "https://geetasaini2042.github.io/Results/RAJ/2025/10th/index2.html";
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
      sendResult(name, btn, ad);
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

function sendResult(name, btn, ad) {
  const sourceUrl = `https://rajasthan-10th-result.indiaresults.com/rj/bser/class-10-result-2024/mname-results.aspx`;
  const getUrl = `https://sainipankaj12.serv00.net/Result/Namewise/result-1.php?name=${encodeURIComponent(name)}&page=1&url=${encodeURIComponent(sourceUrl)}`;
  const targetUrl = `https://sainipankaj12.serv00.net/Result/Namewise/result-1.php?name=${encodeURIComponent(name)}&page=1&user_id=${user.id}&url=${encodeURIComponent(sourceUrl)}`;

  fetch(getUrl)
    .then(response => {
      if (response.status === 200) {
        window.location.href = targetUrl;
      } else if (response.status === 400) {
        return response.text().then(text => {
          ad.innerHTML = `<div style="color: red; font-weight: bold;">No Data Available!</div>`;
          resetButton(btn);
          throw new Error("Handled 400 error");
        });
      } else {
        throw new Error(`Unexpected status: ${response.status}`);
      }
    })
    .catch((error) => {
      if (error.message !== "Handled 400 error") {
        ad.innerHTML = `<span style="color: red; font-weight: bold;">Failed to get result => Please chack your Internet connection</span>`;
        resetButton(btn);
      }
    });
}

function resetButton(button) {
  button.disabled = false;
  button.innerText = "Check Result";
}
