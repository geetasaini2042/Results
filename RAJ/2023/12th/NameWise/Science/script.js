let tg = window.Telegram.WebApp;
tg.expand();

const checkAnotherUrl = "https://geetasaini2042.github.io/Results/RAJ/2023/12th/NameWise/Science";

// Fallback to URL params if Telegram user not available
const urlParams = new URLSearchParams(window.location.search);
const fallbackUser = {
  first_name: urlParams.get("first_name") || "Student",
  id: urlParams.get("user_id") || "unknown"
};

const user = tg.initDataUnsafe?.user || fallbackUser;

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
  const sourceUrl = `https://rj-12-science-result.indiaresults.com/rj/bser/class-12-science-result-2023/mname-results.aspx`;
  const getUrl = `https://sainipankaj12.serv00.net/Result/Namewise/result-1.php?name=${encodeURIComponent(name)}&page=1&url=${encodeURIComponent(sourceUrl)}`;
  const targetUrl = `https://sainipankaj12.serv00.net/Result/Namewise/result-1.php?name=${encodeURIComponent(name)}&page=1&user_id=${user.id}&url=${encodeURIComponent(sourceUrl)}`;

  fetch(getUrl)
    .then(response => {
      if (response.status === 200) {
        window.location.href = targetUrl;
      } else if (response.status === 400) {
        return response.text().then(text => {
          alert("Result Not Declared! Please try again later!");
          ad.innerHTML = `<div style="color: red; font-weight: bold;">Result Not Declared! Please try again later!</div>`;
          resetButton(btn);
          throw new Error("Handled 400 error");
        });
      } else {
        throw new Error(`Unexpected status: ${response.status}`);
      }
    })
    .catch((error) => {
      if (error.message !== "Handled 400 error") {
        ad.innerHTML = `<span style="color: red; font-weight: bold;">Failed to get result => Please check your Internet connection</span>`;
        resetButton(btn);
      }
    });
}

function resetButton(button) {
  button.disabled = false;
  button.innerText = "Check Result";
}
