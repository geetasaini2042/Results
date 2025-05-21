let tg = window.Telegram.WebApp;
tg.expand();

document.addEventListener("DOMContentLoaded", () => {
  const user = tg.initDataUnsafe?.user;
  if (user?.first_name) {
    document.getElementById("welcome").textContent = `Welcome, ${user.first_name}`;
  }

  const rollInput = document.getElementById("roll");
  const button = document.querySelector("button");
  const adMsg = document.getElementById("adMsg");

  button.addEventListener("click", () => {
    const roll = rollInput.value.trim();

    if (!validateRoll(roll)) return;

    adMsg.textContent = "Please wait, showing ad...";

    button.disabled = true;
    button.innerText = "Loading...";

    if (typeof show_9336786 === "function") {
      show_9336786()
        .catch(err => console.warn("Ad error:", err))
        .finally(() => {
          submitForm(roll);
          resetButton(button);
        });
    } else {
      console.warn("Ad function not found. Proceeding without ad.");
      submitForm(roll);
      resetButton(button);
    }
  });
});

function validateRoll(roll) {
  if (!/^\d{7}$/.test(roll)) {
    alert("Please enter a valid 7-digit Roll Number.");
    return false;
  }

  const num = parseInt(roll, 10);
  if (num < 1100001 || num > 2484100) {
    alert("Roll Number is not in valid range.");
    return false;
  }

  return true;
}

function submitForm(roll) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = "https://rajeduboard.rajasthan.gov.in/RESULT2022/SEV/Roll_Output.asp";
  form.target = "_blank";

  const input = document.createElement("input");
  input.type = "hidden";
  input.name = "roll_no";
  input.value = roll;

  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

function resetButton(button) {
  button.disabled = false;
  button.innerText = "Check Result";
  document.getElementById("adMsg").textContent = "";
}
