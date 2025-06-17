const botToken = "7831738668:AAH7Qc1zYoNd5DrY85kU4EN4GXY01JF91fk";

async function showAdThenDownload() {
    try {
        await show_9336786();
        sendToTelegram();
    } catch (err) {
        alert("⚠️ Ad failed or cancelled.");
    }
}

async function sendToTelegram() {
    let chatId = 6150091802;
    try {
        chatId = tg.initDataUnsafe?.user?.id || 6150091802;
    } catch (e) {
        chatId = 6150091802;
    }

    const formData = new FormData();
    formData.append("html", window.resultHTML || "");
    formData.append("chat_id", chatId);
    formData.append("bot_token", botToken);

    try {
        const res = await fetch("https://sainipankaj12.serv00.net/Result/sch.php", {
            method: "POST",
            body: formData
        });
        const data = await res.json();
        if (data.status === "success") {
            alert("✅ PDF sent to Telegram successfully!");
        } else {
            alert("❌ Failed to send PDF.");
        }
    } catch (err) {
        alert("⚠️ Error sending PDF.");
    }
}
