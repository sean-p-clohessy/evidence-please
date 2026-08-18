import type { ProvisionStream } from '../types'

export const settings = ['General Further Education College']
export const roles = ['Senior Leader','Curriculum Leader','Head of Department','Quality Leader','Safeguarding Lead','SEND Lead','Teacher or Lecturer','Governor or Trustee','Apprenticeship Manager','Other']
export const provisionStreams:ProvisionStream[] = ['Education programmes for young people','Adult learning programmes','Apprenticeships','Provision for learners with high needs','HE pathways and higher apprenticeships','Commercial and employer-responsive provision']
export const themes = ['Leadership and Governance','Quality of Education','Behaviour and Attitudes','Personal Development','Safeguarding','Attendance','Curriculum Intent and Sequencing','Teaching, Learning and Assessment','SEND and High Needs','Learner Voice','Staff Development','Employer Engagement','Destinations and Progression','Quality Improvement','Governance and Oversight']
export const modes = [
  { id:'quick', name:'Quick Fire', time:'2–5 min', description:'One question. Quick thinking. Perfect for a busy day.' },
  { id:'written', name:'Written Practice', time:'5–10 min', description:'A focused rehearsal with evidence and up to two follow-ups.' },
  { id:'mock', name:'Mock Inspection', time:'15–30 min', description:'A connected professional conversation across several questions.' }
] as const
