let tg = window.Telegram.WebApp;
tg.expand();

const redirectBase = "https://script.google.com/macros/s/AKfycbyJUxl2c5-CSKCHlsBQjg-2dup8-MABakrO2YFwswmet2tLC0dSwMwy5i-iyMFBpLnSlw/exec?roll_no=";
const board = "https://rajeduboard.rajasthan.gov.in/RESULT2025/SCIENCE/Roll_Output.asp";
const user = tg.initDataUnsafe.user;

document.addEventListener("DOMContentLoaded", () => {
  if (user && user.first_name) {
    document.getElementById("welcome").textContent = `Welcome, ${user.first_name}`;
  }

  document.querySelector("button").addEventListener("click", handleSubmit);
});

function handleSubmit() {
  const roll = document.getElementById("roll").value.trim();
  const btn = document.querySelector("button");
  const ad = document.getElementById("adMsg");

  if (roll === "") {
    alert("Please enter your roll number.");
    return;
  }

  if (!/^\d{7}$/.test(roll)) {
    alert("Roll number must be exactly 7 digits.");
    return;
  }

  btn.innerText = "Please wait...";
  btn.disabled = true;
  ad.textContent = "Loading ad...";

  const redirectNow = () => {
    window.location.href = `${redirectBase}${roll}&url=${board}`;
  };

  if (typeof show_9336786 === "function") {
    show_9336786()
      .catch(err => {
        console.warn("Ad failed:", err);
      })
      .finally(() => {
        ad.textContent = "Redirecting to your result...";
        setTimeout(redirectNow, 800); // small delay after ad
      });
  } else {
    console.warn("Ad function not found.");
    ad.textContent = "Ad not available. Redirecting...";
    setTimeout(redirectNow, 800);
  }
}
