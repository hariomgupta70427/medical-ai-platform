/**
 * Chat and Message Types for the MediAI platform
 */

/**
 * Message role (assistant or user)
 */
export type MessageRole = 'assistant' | 'user';

/**
 * Message structure
 */
export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp?: Date;
}

/**
 * Chat structure
 */
export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Chat API Response
 */
export interface ChatResponse {
  role: MessageRole;
  content: string;
  id: string;
  timestamp: Date;
} 