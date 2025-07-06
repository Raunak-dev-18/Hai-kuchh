import fetch from "node-fetch";

/*
Setup Instructions:
- Set the following environment variables in Vercel:
    WHATSAPP_TOKEN: Your WhatsApp Cloud API access token
    WHATSAPP_VERIFY_TOKEN: Your webhook verify token (set this in Meta dashboard and here)
- Replace 'YOUR_PHONE_NUMBER_ID' in the code with your WhatsApp Cloud API phone number ID
- Deploy to Vercel, and set your webhook URL in Meta as https://cogwhat.vercel.app/api/webhook
- Make sure to select 'GET' for verification and 'POST' for message delivery
*/

// Vercel serverless function for WhatsApp webhook at /api/webhook
// Handles GET (verification) and POST (message processing)

export default async function handler(req, res) {
  const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN || 'EAAR8oCd2mqQBPA6pvlnZBdxhNvHv8NXOIrq9eCGY7hcEYoWZBu6ZBbnjGHvvg6hpFhTOHCVreulQ86lEbKsE7a60SjxDqe8fhlqK0fpZBNzygAF0vDKJnTX7m44QWlRZCB4c3CAiAurjolygZCY7TQRERg6toDbgrZB4ItumKDpH6nZA46xwPpiZCdYG07N4U9PkXgYG10jlMQZC6zSvAzS79tdpzMbm93vHV7aV4ZC8yEGBZB8KYAZDZD'; // Set in Vercel env
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'lovable_webhook_2024'; // Set in Vercel env

  // --- Webhook Verification (GET) ---
  if (req.method === 'GET') {
    const { 'hub.mode': mode, 'hub.verify_token': token, 'hub.challenge': challenge } = req.query;
    if (mode && token) {
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('WEBHOOK_VERIFIED');
        return res.status(200).send(challenge);
      } else {
        return res.status(403).send('Verification failed');
      }
    }
    return res.status(400).send('Bad Request');
  }

  // --- Message Handling (POST) ---
  if (req.method === 'POST') {
    try {
      const body = req.body;
      console.log('Incoming webhook:', JSON.stringify(body, null, 2));
      // WhatsApp webhook structure
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const message = changes?.value?.messages?.[0];
      const from = message?.from;
      const msgType = message?.type;
      let userText = '';
      if (msgType === 'text') {
        userText = message.text.body;
      } else {
        // Only handle text and image gen for now
        return res.status(200).json({ status: 'ignored', reason: 'unsupported message type' });
      }

      // Detect if prompt is for image generation
      const isImageGen = /generate image|make an image/i.test(userText);
      let aiResponse;
      if (isImageGen) {
        // Mock Cognix image API call
        aiResponse = await mockCognixImageAPI(userText);
      } else {
        // Mock Cognix chat API call
        aiResponse = await mockCognixChatAPI(userText);
      }

      // Send reply to WhatsApp
      const waRes = await sendWhatsAppReply(from, aiResponse, isImageGen, WHATSAPP_TOKEN);
      console.log('WhatsApp API response:', waRes);
      return res.status(200).json({ status: 'success' });
    } catch (err) {
      console.error('Error handling webhook:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // --- Method Not Allowed ---
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

// --- Mock Cognix Chat API ---
async function mockCognixChatAPI(prompt) {
  // Simulate AI response
  return `🤖 Cognix says: ${prompt} (mocked AI reply)`;
}

// --- Mock Cognix Image API ---
async function mockCognixImageAPI(prompt) {
  // Simulate image URL
  return {
    type: 'image',
    url: 'https://placekitten.com/400/400',
    caption: `Here is your generated image for: "${prompt}" (mocked)`
  };
}

// --- Send WhatsApp Reply ---
async function sendWhatsAppReply(to, aiResponse, isImage, token) {
  // TODO: Replace 'YOUR_PHONE_NUMBER_ID' with your actual WhatsApp Cloud API phone number ID
  const url = 'https://graph.facebook.com/v22.0/717243248136731/messages';
  let payload;
  if (isImage && aiResponse?.type === 'image') {
    payload = {
      messaging_product: 'whatsapp',
      to,
      type: 'image',
      image: {
        link: aiResponse.url,
        caption: aiResponse.caption || ''
      }
    };
  } else {
    payload = {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: typeof aiResponse === 'string' ? aiResponse : JSON.stringify(aiResponse) }
    };
  }
  // Send POST request to WhatsApp API
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  return resp.json();
} 