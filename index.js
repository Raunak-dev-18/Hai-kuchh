import { useState } from 'react';

export default function Home() {
  const [verifyToken, setVerifyToken] = useState('lovable_webhook_2024');
  const [webhookUrl, setWebhookUrl] = useState('https://cogwhat.vercel.app/api/webhook');

  const generateNewToken = () => {
    const newToken = 'lovable_' + Math.random().toString(36).substring(2, 15);
    setVerifyToken(newToken);
  };

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333', textAlign: 'center' }}>🤖 WhatsApp AI Bot Setup</h1>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '10px', 
        marginBottom: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2>📋 Webhook Configuration</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
            Webhook URL:
          </label>
          <input 
            type="text" 
            value={webhookUrl} 
            onChange={(e) => setWebhookUrl(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ddd', 
              borderRadius: '5px',
              fontFamily: 'monospace'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
            Verify Token:
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              value={verifyToken} 
              onChange={(e) => setVerifyToken(e.target.value)}
              style={{ 
                flex: 1,
                padding: '10px', 
                border: '1px solid #ddd', 
                borderRadius: '5px',
                fontFamily: 'monospace'
              }}
            />
            <button 
              onClick={generateNewToken}
              style={{
                padding: '10px 15px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Generate New
            </button>
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#e8f4fd', 
          padding: '15px', 
          borderRadius: '5px',
          border: '1px solid #bee5eb'
        }}>
          <h3>🔧 Setup Instructions:</h3>
          <ol>
            <li>Copy the Webhook URL and Verify Token above</li>
            <li>Go to <a href="https://developers.facebook.com/apps" target="_blank">Meta Developer Console</a></li>
            <li>Select your WhatsApp app</li>
            <li>Go to "WhatsApp" → "Configuration" → "Webhooks"</li>
            <li>Click "Configure" and enter:</li>
            <ul>
              <li><strong>Callback URL:</strong> {webhookUrl}</li>
              <li><strong>Verify Token:</strong> {verifyToken}</li>
            </ul>
            <li>Subscribe to <code>messages</code> events</li>
            <li>Save the configuration</li>
          </ol>
        </div>
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2>🔑 Environment Variables</h2>
        <p>Set these in your Vercel project settings:</p>
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '15px', 
          borderRadius: '5px',
          fontFamily: 'monospace',
          fontSize: '14px'
        }}>
          <div><strong>WHATSAPP_TOKEN:</strong> EAAR8oCd2mqQBPA6pvlnZBdxhNvHv8NXOIrq9eCGY7hcEYoWZBu6ZBbnjGHvvg6hpFhTOHCVreulQ86lEbKsE7a60SjxDqe8fhlqK0fpZBNzygAF0vDKJnTX7m44QWlRZCB4c3CAiAurjolygZCY7TQRERg6toDbgrZB4ItumKDpH6nZA46xwPpiZCdYG07N4U9PkXgYG10jlMQZC6zSvAzS79tdpzMbm93vHV7aV4ZC8yEGBZB8KYAZDZD</div>
          <div><strong>WHATSAPP_VERIFY_TOKEN:</strong> {verifyToken}</div>
        </div>
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2>🧪 Test Your Webhook</h2>
        <p>After setup, you can test the webhook verification:</p>
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '15px', 
          borderRadius: '5px',
          fontFamily: 'monospace',
          fontSize: '14px'
        }}>
          GET {webhookUrl}?hub.mode=subscribe&hub.verify_token={verifyToken}&hub.challenge=test123
        </div>
        <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
          This should return "test123" if verification is working correctly.
        </p>
      </div>
    </div>
  );
} 