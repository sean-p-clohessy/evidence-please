export type PersonaId = 'chris' | 'jenny' | 'raj' | 'sarah' | 'martin' | 'elaine'
export type ModeId = 'quick' | 'written' | 'mock'
export type AnswerMethod = 'type' | 'build'
export type AnswerSection = 'currentPosition' | 'evidence' | 'action' | 'impact' | 'remainingChallenge'

export type Persona = {
  id: PersonaId; name: string; title: string; focus: string; description: string;
  challenge: string; push: string; colour: string; initials: string
}

export type AnswerOption = {
  id: string; text: string; qualitySignals: string[]; weaknesses: string[]
}

export type InspectionQuestion = {
  id: string; theme: string; subtheme?: string; settings: string[]; roles: string[];
  question: string; contextPrompt?: string;
  personas: Record<PersonaId, { followUps: string[]; feedbackFocus: string[] }>;
  usefulEvidence: string[]; reflectionPrompts: string[];
  answerBuilder?: Partial<Record<AnswerSection, AnswerOption[]>>
}

export type ReviewAnswers = Record<string, boolean>
export type Ratings = Record<'Evidence'|'Impact'|'Consistency'|'Insight'|'Learner focus'|'Brevity'|'Honesty'|'Directness', number>
export type Debrief = { outcome: string; summary: string; strengths: string[]; opportunities: string[]; ratings: Ratings }
