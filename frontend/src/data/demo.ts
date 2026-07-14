import type { NotificationItem } from '../components/NotificationCard';

export type DemoSpace = {
  id: string;
  title: string;
  description: string;
  online: number;
  emotion: string;
};

export type DemoChatMessage = {
  id: string;
  text: string;
  outgoing: boolean;
  username?: string;
  initials?: string;
  time: string;
  image?: boolean;
};

export type CapsuleStatus = 'locked' | 'ready' | 'opened';

export type DemoCapsule = {
  id: string;
  title: string;
  emotionLabel: string;
  emotionTone: 'hopeful' | 'inspiring' | 'melancholy' | 'grateful';
  body: string;
  status: CapsuleStatus;
  footer: string;
};

export const DEMO_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    kind: 'match',
    title: 'New SoulMatch',
    body: "Someone's heart resonated with your latest post. Visit your matches to connect.",
    time: '2m ago',
    unread: true,
  },
  {
    id: 'n2',
    kind: 'message',
    title: 'New Message',
    body: "AvaBloom: 'That reflection you shared really helped me today. Thank...'",
    time: '15m ago',
    unread: true,
  },
  {
    id: 'n3',
    kind: 'capsule',
    title: 'Capsule Arrived',
    body: "Your message from 3 months ago has finally surfaced. Ready to see how you've grown?",
    time: '1h ago',
    unread: false,
  },
  {
    id: 'n4',
    kind: 'insight',
    title: 'Weekly Insight',
    body: "Your emotional landscape was predominantly 'Calm' this week. View your summary.",
    time: 'Yesterday',
    unread: false,
  },
];

export const DEMO_SPACES: DemoSpace[] = [
  {
    id: 'collective-healing',
    title: 'Collective Healing',
    description: 'A soft place to share heaviness and hold each other anonymously.',
    online: 12,
    emotion: 'sad',
  },
  {
    id: 'quiet-minds',
    title: 'Quiet Minds',
    description: 'For anxious thoughts that need gentle company.',
    online: 8,
    emotion: 'anxious',
  },
  {
    id: 'grateful-circle',
    title: 'Grateful Circle',
    description: 'Tiny joys, warm thanks, shared light.',
    online: 15,
    emotion: 'grateful',
  },
  {
    id: 'still-waters',
    title: 'Still Waters',
    description: 'Calm check-ins and grounding prompts.',
    online: 6,
    emotion: 'calm',
  },
];

export const DEMO_SPACE_MESSAGES: Record<string, DemoChatMessage[]> = {
  'collective-healing': [
    {
      id: 's1',
      username: 'MindfulKnight',
      initials: 'MK',
      text: 'Checking in. Today feels softer than yesterday. Grateful for this space.',
      outgoing: false,
      time: '10:24 AM',
    },
    {
      id: 's2',
      username: 'MountainSoul',
      initials: 'MS',
      text: 'Same here. Naming the heaviness helped me breathe a little.',
      outgoing: false,
      time: '10:26 AM',
    },
    {
      id: 's3',
      username: 'QuietForce',
      initials: 'QF',
      text: 'Sending light through the trees for anyone who needs it today.',
      outgoing: false,
      time: '10:28 AM',
      image: true,
    },
    {
      id: 's4',
      text: 'Thank you. Feeling less alone already.',
      outgoing: true,
      time: '10:32 AM',
    },
  ],
};

export const DEMO_MATCH_MESSAGES: DemoChatMessage[] = [
  {
    id: 'm1',
    initials: 'AB',
    text: 'Honestly, today was just one of those days where everything felt heavy. I saw your status and felt the same way.',
    outgoing: false,
    time: '10:20 AM',
  },
  {
    id: 'm2',
    text: "I completely understand. It's like the world is moving too fast and I'm just standing still. I'm glad we matched.",
    outgoing: true,
    time: '10:27 AM',
  },
  {
    id: 'm3',
    initials: 'AB',
    text: "'Standing still' is the perfect way to describe it. Do you ever feel like the silence is too loud sometimes?",
    outgoing: false,
    time: '10:29 AM',
  },
  {
    id: 'm4',
    text: "Every single day. That's why I come here. It's the only place where the silence feels... shared.",
    outgoing: true,
    time: '10:31 AM',
  },
];

export const DEMO_CAPSULES: DemoCapsule[] = [
  {
    id: 'c1',
    title: 'Letter to My Future Self',
    emotionLabel: 'HOPEFUL',
    emotionTone: 'hopeful',
    body: "Today was a breakthrough day. I finally understood that progress isn't linear and that's okay. I want to remember this feeling of peace when things get loud again.",
    status: 'locked',
    footer: 'UNLOCKS ON Dec 24, 2026',
  },
  {
    id: 'c2',
    title: 'Message from Jan 2023',
    emotionLabel: 'INSPIRING',
    emotionTone: 'inspiring',
    body: 'Remember why you started this journey. The small steps lead to big horizons. You are stronger than you think...',
    status: 'ready',
    footer: 'DELIVERED ON Today',
  },
  {
    id: 'c3',
    title: 'Reflection on Growth',
    emotionLabel: 'MELANCHOLY',
    emotionTone: 'melancholy',
    body: "I'm writing this while sitting in the park. Everything feels uncertain right now, but the wind is cool and the birds don't seem to mind. I hope future me has found the answers...",
    status: 'opened',
    footer: 'OPENED ON May 12, 2024',
  },
];

export const DEMO_PROFILE_STATS = {
  connections: 124,
  days: 48,
  emotions: 12,
};

/** 3 weeks x 7 days intensity 0–4 for heatmap */
export const DEMO_HEATMAP: number[][] = [
  [0, 1, 2, 1, 3, 2, 1],
  [1, 2, 3, 4, 2, 1, 0],
  [2, 1, 2, 3, 4, 3, 2],
];

export const DEMO_HEATMAP_LABELS = ['Oct', 'Nov', 'Dec'];

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}
