export interface ChatMessage {
  sender: string;
  text: string;
  time: string;
}

export interface ChatHistories {
  alyssa: ChatMessage[];
  astro: ChatMessage[];
}

export const INITIAL_CHAT_HISTORIES: ChatHistories = {
  alyssa: [
    {
      sender: 'alyssa',
      text: 'Hello Alex! I am currently channeling your past life energies. The connection is quite strong.',
      time: 'Yesterday',
    },
    {
      sender: 'user',
      text: 'Thank you Alyssa, I can feel a transition happening too.',
      time: 'Yesterday',
    },
    {
      sender: 'alyssa',
      text: 'Excellent. Have you been noticing repetitive symbols like numbers or animals?',
      time: '3:05 PM',
    },
    {
      sender: 'user',
      text: 'Thank you so much, this really resonated',
      time: '3:10 PM',
    },
  ],
  astro: [
    {
      sender: 'astro',
      text: 'Greetings! I am Astro, your cosmic assistant. Ask me anything about your astrological birth chart or reading statuses.',
      time: '10:00 AM',
    },
  ],
};

export interface LockedReadingItem {
  title: string;
  icon: string;
  type: string;
}

export const LOCKED_READINGS: LockedReadingItem[] = [
  { title: 'What you were before this life', icon: '🧭', type: 'Life Purpose' },
  { title: 'How your love story really unfolds', icon: '💞', type: 'Soulmate Connection' },
  { title: 'What the universe is pulling you toward', icon: '🌌', type: 'Cosmic Destiny' },
];

export interface FAQItem {
  title: string;
  content: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    title: 'Questions about your reading',
    content: 'All readings are channeled individually by Alyssa. If you have expedited your reading, it will be complete within 12 hours. Normal readings take between 24 and 48 hours depending on reader alignment.',
  },
  {
    title: 'Help with your account or order',
    content: 'Transactions are secured. If you did not receive a confirmation email or need to restore a previous purchase, click the Email support link above and include your order reference number.',
  },
  {
    title: 'Fast, friendly support from our team',
    content: 'Our small, dedicated support team works directly with our artists and astrologers to resolve issues quickly. We guarantee a resolution to all questions within 24 hours.',
  },
];
