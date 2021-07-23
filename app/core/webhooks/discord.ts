export function sendMessageToDiscord(text: string) {
  fetch("/api/discord-webhook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(text),
  })
}
