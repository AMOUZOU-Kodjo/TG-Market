export async function sendSms(phone, message) {
  const apiUrl = process.env.SMS_API_URL;
  const apiKey = process.env.SMS_API_KEY;
  const sender = process.env.SMS_SENDER;

  if (!apiUrl || !apiKey) {
    console.log(`[SMS] To: ${phone} — ${message}`);
    return { success: true, simulated: true };
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        sender,
        to: phone,
        text: message,
      }),
    });

    if (!response.ok) throw new Error(`SMS API error: ${response.status}`);
    return { success: true };
  } catch (err) {
    console.error('[SMS] Error:', err.message);
    return { success: false, error: err.message };
  }
}
