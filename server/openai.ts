import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function performMedicalSearch(query: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a helpful medical AI assistant for doctors. Provide accurate, evidence-based information in response to medical queries. 
          Format your responses in HTML with appropriate headers, paragraphs, and lists. 
          Include relevant citations to medical literature when possible.
          Always clarify that your responses are informational and not a substitute for clinical judgment.
          Organize your response with clear sections and avoid excessive detail.`
        },
        {
          role: "user",
          content: query
        }
      ],
      max_tokens: 800,
    });

    return response.choices[0].message.content || "Sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to get AI response. Please try again later.");
  }
}