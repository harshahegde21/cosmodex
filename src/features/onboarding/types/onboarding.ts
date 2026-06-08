export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface OnboardingData {
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
