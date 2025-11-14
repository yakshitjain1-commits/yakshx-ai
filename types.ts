
export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

export enum ChatMode {
  Text = 'text',
  Image = 'image',
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string; // For text messages or image URLs
  type: 'text' | 'image' | 'loading' | 'error';
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}