let tg = window.Telegram.WebApp;
tg.expand();

const resultUrlBase = "https://rajeduboard.rajasthan.gov.in/RESULT2022/SEV/Roll_Output.asp";
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
  const adMsg = document.getElementById("adMsg");

  if (!/^\d{7}$/.test(roll)) {
    alert("Please enter a valid 7-digit roll number.");
    return;
  }

  btn.disabled = true;
  btn.innerText = "Please wait...";
  adMsg.textContent = "Loading ad...";

  const showIframe = () => {
    adMsg.textContent = "";
    document.querySelector(".instructions").style.display = "none";
    document.querySelector("label").style.display = "none";
    document.querySelector("input").style.display = "none";
    document.querySelector("button").style.display = "none";

    const iframe = document.createElement("iframe");
    iframe.src = resultUrlBase;
    iframe.style.width = "100%";
    iframe.style.height = "600px";
    iframe.style.border = "none";
    iframe.style.marginTop = "20px";

    document.querySelector(".card").appendChild(iframe);

    // Auto-fill roll number (only works if site allows JS injection, which likely it won't)
    setTimeout(() => {
      const form = iframe.contentWindow?.document?.forms?.[0];
      if (form) {
        form.roll_no.value = roll;
        form.submit();
      }
    }, 1000);
  };

  if (typeof show_9336786 === "function") {
    show_9336786()
      .catch((e) => {
        console.warn("Ad error:", e);
      })
      .finally(showIframe);
  } else {
    console.warn("Ad function not found");
    showIframe();
  }
}
