export async function POST(req) {
  try {
    const body = await req.json();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        // Removed optional headers
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1:free",
        messages: body.messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter error:", data);
      return Response.json({ error: data.error || "API Error" }, { status: response.status });
    }

    return Response.json(data);
  } catch (error) {
    console.error("Server error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
