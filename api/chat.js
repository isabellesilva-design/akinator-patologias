export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, system } = req.body;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.OPENROUTER_API_KEY,
        'HTTP-Referer': 'https://akinator-patologias.vercel.app',
        'X-Title': 'Akinator das Patologias'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct:free',
        messages: [
          { role: 'system', content: system },
          ...messages
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message || JSON.stringify(data.error) });
    }

    const text = data.choices?.[0]?.message?.content || '';
    return res.status(200).json({
      content: [{ type: 'text', text: text }]
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
