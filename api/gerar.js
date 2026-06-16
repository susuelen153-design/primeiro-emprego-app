export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const { messages, systemPrompt } = req.body;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.REACT_APP_GROQ_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        max_tokens: 1500,
      }),
    });

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || "Erro ao gerar resposta.";
    res.status(200).json({ text });
  } catch (err) {
    res.status(500).json({ text: "Erro de conexão com a IA." });
  }
}
