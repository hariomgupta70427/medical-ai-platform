import { NextResponse } from 'next/server';
import { generateChatResponse, ChatMessage } from '@/lib/deepseek';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: messages array is required' },
        { status: 400 }
      );
    }
    
    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== 'user') {
      return NextResponse.json(
        { error: 'Invalid request: last message must be from user' },
        { status: 400 }
      );
    }
    
    // Convert message history to ChatMessage format
    const chatMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Generate response using DeepSeek chat API
    const response = await generateChatResponse(chatMessages);
    
    return NextResponse.json({
      id: Date.now().toString(),
      content: response,
      role: 'assistant',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error in chat API:', error);
    
    let errorMessage = 'Internal server error';
    if (error instanceof Error) {
      errorMessage = `Error: ${error.message}`;
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 