export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface OnboardingData {
  email?: string;
  password?: string;
  authMethod?: 'Email' | 'Google' | 'GitHub';
  username: string;
  avatarId: string | null;
  experienceLevel: ExperienceLevel | null;
  interests: string[];
}

export type OnboardingStepId = 
  | 'START'
  | 'AUTH'
  | 'USERNAME'
  | 'AVATAR'
  | 'PREVIEW'
  | 'EXPERIENCE'
  | 'INTERESTS'
  | 'COMPLETING';

export interface SessionUser {
  userId: string;
  username: string;
  email: string;
  avatarId: string | null;
  experienceLevel: string | null;
  interests: string[];
  xpTotal: number;
  level: number;
  role: string;
  createdAt: string;
}

