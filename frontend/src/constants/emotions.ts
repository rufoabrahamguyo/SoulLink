export type EmotionId =
  | 'happy'
  | 'sad'
  | 'anxious'
  | 'calm'
  | 'excited'
  | 'lonely'
  | 'grateful'
  | 'overwhelmed';

export interface Emotion {
  id: EmotionId;
  label: string;
  icon: string;
  color: string;
}

export const EMOTIONS: Emotion[] = [
  { id: 'happy', label: 'Happy', icon: 'emoticon-happy-outline', color: '#FFD93D' },
  { id: 'sad', label: 'Sad', icon: 'emoticon-sad-outline', color: '#6B9BD1' },
  { id: 'anxious', label: 'Anxious', icon: 'emoticon-confused-outline', color: '#FF9F43' },
  { id: 'calm', label: 'Calm', icon: 'meditation', color: '#7B61FF' },
  { id: 'excited', label: 'Excited', icon: 'lightning-bolt-outline', color: '#FF6B9D' },
  { id: 'lonely', label: 'Lonely', icon: 'weather-night', color: '#5C6BC0' },
  { id: 'grateful', label: 'Grateful', icon: 'heart-outline', color: '#E57373' },
  { id: 'overwhelmed', label: 'Overwhelmed', icon: 'head-flash-outline', color: '#9575CD' },
];

export function getEmotionById(id: string): Emotion | undefined {
  return EMOTIONS.find((e) => e.id === id);
}
