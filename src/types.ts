export type PersonaId = 'chris' | 'jenny' | 'raj' | 'sarah' | 'martin' | 'elaine'
export type ModeId = 'quick' | 'written' | 'mock'
export type AnswerMethod = 'type' | 'build'
export type AnswerSection = 'currentPosition' | 'evidence' | 'action' | 'impact' | 'remainingChallenge'
export type FrameworkArea = 'Safeguarding'|'Inclusion'|'Leadership and governance'|'Contribution to meeting skills needs'|'Curriculum, teaching and training'|'Achievement'|'Participation and development'
export type ProvisionStream = 'Education programmes for young people'|'Adult learning programmes'|'Apprenticeships'|'Provision for learners with high needs'|'HE pathways and higher apprenticeships'|'Commercial and employer-responsive provision'

export type Persona = {
  id: PersonaId; name: string; title: string; focus: string; description: string;
  challenge: string; push: string; colour: string; initials: string
}

export type AnswerOption = {
  id: string; text: string; qualitySignals: string[]; weaknesses: string[]
}

export type InspectionQuestion = {
  id: string; theme: string; subtheme?: string; settings: string[]; roles: string[];
  frameworkEdition: 'renewed-fe-toolkit-2025-current'; frameworkArea: FrameworkArea; provisionStreams: ProvisionStream[];
  question: string; contextPrompt?: string;
  personas: Record<PersonaId, { followUps: string[]; feedbackFocus: string[] }>;
  usefulEvidence: string[]; reflectionPrompts: string[];
  answerBuilder?: Partial<Record<AnswerSection, AnswerOption[]>>
}

export type ReviewAnswers = Record<string, boolean>
export type Ratings = Record<'Evidence'|'Impact'|'Consistency'|'Insight'|'Learner focus'|'Brevity'|'Honesty'|'Directness', number>
export type Debrief = { outcome: string; summary: string; strengths: string[]; opportunities: string[]; ratings: Ratings; score: number }
