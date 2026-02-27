import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Simple retry helper
async function withRetry<T>(
  operation: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: any;
  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (i < retries - 1) {
        await new Promise(res => setTimeout(res, delay * (i + 1)));
      }
    }
  }
  throw lastError;
}

export async function POST(req: Request) {
  try {
    const { messages, userContext, email: providedEmail } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_NEWSLETTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing NEXT_PUBLIC_NEWSLETTER_API_KEY' }, { status: 500 });
    }

    // Try to extract user info from the chat using Gemini
    const geminiApiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    let extractedData = {
      email: providedEmail || '',
      name: userContext?.name || 'Chatbot User',
      bio: '',
      language: 'en'
    };

    if (geminiApiKey) {
      try {
        const ai = new GoogleGenerativeAI(geminiApiKey);
        const model = ai.getGenerativeModel({ model: "gemini-flash-latest" });
        
        const prompt = `
          Extract user information from the following chat conversation and context.
          Return ONLY valid JSON wrapped in ---...--- like this:
          ---{"email": "...", "name": "...", "bio": "...", "language": "en"}---
          
          If an email is provided in the chat, use it. Otherwise, return null or empty string for email.
          For the 'bio', provide a short summary of the user's business, goals, or needs based on the chat (max 100 words).
          For the 'name', extract the user's name if they provided it, otherwise use a sensible default.
          For the 'language', guess their language (ISO-639-1 code, e.g. "en", "es"). Default to "en".
          
          User Context provided: ${JSON.stringify(userContext || {})}
          
          Chat History:
          ${messages.map((m: any) => `${m.role}: ${m.text}`).join('\n')}
        `;

        const result = await withRetry(() => model.generateContent(prompt));
        const responseText = result.response.text();
        
        // Extract JSON between ---...---
        const match = responseText.match(/---([\s\S]*?)---/);
        if (match && match[1]) {
          try {
            const parsed = JSON.parse(match[1].trim());
            extractedData = {
              email: parsed.email || extractedData.email,
              name: parsed.name || extractedData.name,
              bio: parsed.bio || extractedData.bio,
              language: parsed.language || extractedData.language
            };
          } catch (e) {
            console.warn("Failed to parse extracted JSON from Gemini", e);
          }
        }
      } catch (e) {
        console.warn("Failed to call Gemini API for extraction", e);
      }
    }

    // If no bio was generated, fallback to chat summary
    if (!extractedData.bio) {
      extractedData.bio = messages.map((m: any) => `${m.role}: ${m.text}`).join("\n").substring(0, 500);
    }
    
    // Fallback if no email at all
    if (!extractedData.email) {
      return NextResponse.json({ error: 'Email could not be determined from chat or input' }, { status: 400 });
    }

    const APIURI = "https://ai-newsletter-translated.onrender.com";
    const configId = "oriens@aiexecutions.com";
    const newsSourceId = "ae321dcbb25391451815e2de82b8599259e6e879fa78cb535013a60083c42910";
    const url = `${APIURI}/users/${configId}/${newsSourceId}`;

    const user = {
      email: extractedData.email,
      name: extractedData.name,
      bio: extractedData.bio,
      language: extractedData.language
    };

    const response = await withRetry(() => fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(user),
    }));

    const result = await response.json();

    if (response.ok) {
      return NextResponse.json({ success: true, message: result.message, extractedInfo: user });
    } else {
      return NextResponse.json({ error: result.message || 'Failed to add user' }, { status: response.status });
    }
  } catch (error) {
    console.error('Newsletter API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}