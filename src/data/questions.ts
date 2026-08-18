import type { AnswerOption, FrameworkArea, InspectionQuestion, PersonaId, ProvisionStream } from '../types'
import { activeFramework, findReportPattern } from './ofstedCorpus'

const allSettings = ['General Further Education College']
const allRoles = ['Senior Leader','Curriculum Leader','Head of Department','Quality Leader','Safeguarding Lead','SEND Lead','Teacher or Lecturer','Governor or Trustee','Apprenticeship Manager','Other']
const allStreams:ProvisionStream[]=['Education programmes for young people','Adult learning programmes','Apprenticeships','Provision for learners with high needs','HE pathways and higher apprenticeships','Commercial and employer-responsive provision']

const followUps: Record<PersonaId, string[]> = {
  chris:['What evidence supports that judgement?','How have you triangulated that evidence?','What evidence suggests a different conclusion?'],
  jenny:['What has improved as a result?','Which learners benefited?','Where has your action had limited impact?'],
  raj:['Is this consistent across every area?','Where is practice weakest?','What happens when expectations are not met?'],
  sarah:['What would learners say?','How is the experience different for learners with SEND?','How did learner views influence your action?'],
  martin:['What assurance do governors receive?','How have governors challenged leaders?','How do they know the information is reliable?'],
  elaine:['Why was that decision made?','How does assessment demonstrate secure learning?','How does this fit the wider curriculum?']
}

const option = (id:string, text:string, good:string[]=[], weak:string[]=[]): AnswerOption => ({id,text,qualitySignals:good,weaknesses:weak})
const builder = (stem:string,theme:string,index:number) => {
  const pattern=findReportPattern(theme,index)
  return ({
  currentPosition:[
    option('cp1',`Our current position is mixed: ${stem.toLowerCase()} is secure in most areas, with two known exceptions.`,['specificity','honesty']),
    option('cp4',pattern.fragments.currentPosition,['specificity','honesty','consistency']),
    option('cp2',`${stem} is outstanding across the board.`,[],['unsupported confidence']),
    option('cp3',`We have a robust process for ${stem.toLowerCase()}.`,[],['process only'])
  ],
  evidence:[
    option('ev1','Three sources show the same pattern, including trend data, learner feedback and direct review.',['evidence','triangulation']),
    option('ev4',pattern.fragments.evidence,['evidence','triangulation','specificity']),
    option('ev2','Our dashboard is reviewed regularly.',[],['document named, finding unexplained']),
    option('ev3','A recent case study was very positive.',[],['isolated anecdote'])
  ],
  action:[
    option('ac1','Leaders targeted the weaker areas, set named responsibilities and reviewed progress at six-week intervals.',['action','specificity']),
    option('ac4',pattern.fragments.action,['action','specificity']),
    option('ac2','We held meetings and delivered training.',[],['activity only']),
    option('ac3','Staff were reminded of expectations.',[],['vague action'])
  ],
  impact:[
    option('im1','The gap narrowed over two terms, although one area remains below the organisation’s expectation.',['impact','honesty']),
    option('im4',pattern.fragments.impact,['impact','honesty']),
    option('im2','The action was well received by staff.',[],['impact not demonstrated']),
    option('im3','This has had a significant impact.',[],['unsupported claim'])
  ],
  remainingChallenge:[
    option('rc1','We have not yet secured consistency in the weakest area; the next review will test whether recent gains endure.',['honesty','consistency']),
    option('rc4',pattern.fragments.remainingChallenge,['honesty','consistency','insight']),
    option('rc2','There are no remaining challenges.',[],['unsupported confidence']),
    option('rc3','We continue to monitor the situation.',[],['vague'])
  ]
})}

const frameworkAreaForTheme = (theme:string):FrameworkArea => ({
  'Safeguarding':'Safeguarding','SEND and High Needs':'Inclusion','Leadership and Governance':'Leadership and governance',
  'Governance and Oversight':'Leadership and governance','Staff Development':'Leadership and governance','Employer Engagement':'Contribution to meeting skills needs',
  'Curriculum Intent and Sequencing':'Curriculum, teaching and training','Teaching, Learning and Assessment':'Curriculum, teaching and training',
  'Quality of Education':'Curriculum, teaching and training','Achievement':'Achievement','Destinations and Progression':'Achievement',
  'Attendance':'Participation and development','Behaviour and Attitudes':'Participation and development','Personal Development':'Participation and development',
  'Learner Voice':'Participation and development','Quality Improvement':'Leadership and governance'
}[theme]??'Leadership and governance') as FrameworkArea

const streamsForTheme = (theme:string):ProvisionStream[] => {
  if(theme==='SEND and High Needs') return ['Provision for learners with high needs']
  if(theme==='Employer Engagement') return ['Apprenticeships','Commercial and employer-responsive provision','Adult learning programmes','Education programmes for young people']
  if(theme==='Destinations and Progression') return allStreams
  return allStreams
}

type Seed = [string,string,string,string]
const seeds: Seed[] = [
  ['Leadership and Governance','assure themselves that teaching is consistently effective across the provision','Teaching consistency','Learning Walk Summary'],
  ['Leadership and Governance','know that improvement priorities address the most important weaknesses','Improvement priorities','Quality Improvement Plan'],
  ['Leadership and Governance','ensure middle leaders are effective in improving their areas','Middle leadership','Staff Development Records'],
  ['Leadership and Governance','evaluate whether their strategy is improving learner outcomes','Leadership strategy','Achievement Data'],
  ['Leadership and Governance','make sure decisions are informed by reliable information','Decision quality','Self-Assessment Report'],
  ['Leadership and Governance','identify and respond to underperformance quickly','Underperformance','Quality Improvement Plan'],
  ['Leadership and Governance','create a culture in which staff raise concerns safely','Speaking-up culture','Staff Survey'],
  ['Leadership and Governance','assure governors that statutory responsibilities are met','Statutory assurance','Governor or Trustee Minutes'],
  ['Quality of Education','know learners remember and apply important knowledge over time','Secure learning','Assessment Records'],
  ['Quality of Education','evaluate the quality of teaching without relying on isolated observations','Teaching evaluation','Learning Walk Summary'],
  ['Quality of Education','ensure assessment informs what teachers do next','Responsive assessment','Assessment Records'],
  ['Quality of Education','know feedback helps learners improve their work','Useful feedback','Learner Survey'],
  ['Quality of Education','identify variation in learner outcomes between curriculum areas','Outcome variation','Achievement Data'],
  ['Quality of Education','ensure online and face-to-face learners receive an equally strong experience','Mode consistency','Learner Survey'],
  ['Quality of Education','know new staff develop the expertise they need','Staff expertise','Staff Development Records'],
  ['Quality of Education','judge whether quality processes lead to better learning','Quality impact','Quality Improvement Plan'],
  ['Attendance','understand the causes of persistent absence','Persistent absence','Attendance Dashboard'],
  ['Attendance','know attendance actions improve participation for priority groups','Attendance impact','Attendance Dashboard'],
  ['Attendance','respond when attendance remains weak despite intervention','Attendance response','Case Studies'],
  ['Behaviour and Attitudes','know expectations for behaviour are applied consistently','Behaviour consistency','Learner Survey'],
  ['Behaviour and Attitudes','evaluate whether learners feel safe and respected','Learner safety','Learner Survey'],
  ['Behaviour and Attitudes','reduce low-level disruption without masking underlying causes','Behaviour improvement','Complaints and Compliments'],
  ['SEND and High Needs','know learners with SEND receive the support they need','SEND support','SEND Review'],
  ['SEND and High Needs','evaluate whether reasonable adjustments improve learning','Adjustment impact','SEND Review'],
  ['SEND and High Needs','ensure staff use learner support information effectively','Support information','Learning Walk Summary'],
  ['SEND and High Needs','identify outcome gaps for learners with SEND','SEND outcomes','Achievement Data'],
  ['SEND and High Needs','involve learners in reviewing their support','SEND learner voice','Learner Survey'],
  ['SEND and High Needs','ensure transitions prepare high-needs learners for their next stage','High-needs transition','Destination Data'],
  ['Safeguarding','know the safeguarding culture is understood by all staff','Safeguarding culture','Safeguarding Audit'],
  ['Safeguarding','assure themselves that concerns are acted on promptly','Concern response','Safeguarding Audit'],
  ['Safeguarding','evaluate whether learners know how to seek help','Seeking help','Learner Survey'],
  ['Safeguarding','ensure safeguarding training changes professional practice','Training impact','Staff Development Records'],
  ['Safeguarding','learn from safeguarding incidents and near misses','Safeguarding learning','Safeguarding Audit'],
  ['Curriculum Intent and Sequencing','know the curriculum is sequenced so learners build knowledge securely','Curriculum sequence','Curriculum Plans'],
  ['Curriculum Intent and Sequencing','ensure curriculum intent reflects learner starting points','Starting points','Curriculum Plans'],
  ['Curriculum Intent and Sequencing','know employer input materially improves the curriculum','Employer influence','Employer Feedback'],
  ['Curriculum Intent and Sequencing','identify where the curriculum is least effective','Curriculum weakness','Assessment Records'],
  ['Curriculum Intent and Sequencing','ensure enrichment supports rather than distracts from learning','Curriculum enrichment','Learner Survey'],
  ['Personal Development','know personal development meets the needs of different learner groups','Personal development','Learner Survey'],
  ['Learner Voice','ensure learner feedback leads to visible change','Learner feedback','Learner Survey'],
  ['Learner Voice','hear from learners who are least likely to participate','Representative voice','Learner Survey'],
  ['Personal Development','evaluate whether learners are prepared for their next steps','Next-step readiness','Destination Data'],
  ['Learner Voice','respond when learner feedback conflicts with performance data','Conflicting evidence','Learner Survey'],
  ['Governance and Oversight','ensure governors provide effective challenge rather than passive support','Governance challenge','Governor or Trustee Minutes'],
  ['Employer Engagement','know partnerships with employers improve learners’ experience','Employer impact','Employer Feedback'],
  ['Destinations and Progression','know destinations are sustained and appropriate','Sustained destinations','Destination Data'],
  ['Staff Development','evaluate whether professional development improves teaching','Development impact','Staff Development Records'],
  ['Quality Improvement','know self-assessment is candid, accurate and representative','Self-assessment accuracy','Self-Assessment Report']
]

export const questions: InspectionQuestion[] = seeds.map(([theme, phrase, subtheme, evidence], index) => {
  const personas = Object.fromEntries((Object.keys(followUps) as PersonaId[]).map(id => [id,{followUps:followUps[id],feedbackFocus:[id === 'jenny' ? 'impact' : id === 'chris' ? 'evidence' : id === 'raj' ? 'consistency' : id === 'sarah' ? 'learner focus' : id === 'martin' ? 'oversight' : 'curriculum thinking']}])) as InspectionQuestion['personas']
  return {
    id:`q${String(index+1).padStart(2,'0')}`, theme, subtheme, settings:allSettings, roles:allRoles,
    frameworkEdition:activeFramework.id, frameworkArea:frameworkAreaForTheme(theme), provisionStreams:streamsForTheme(theme),
    question:`How do leaders ${phrase}?`,
    contextPrompt:'Answer from your own organisational context. Be specific about the current position, evidence and impact.',
    personas, usefulEvidence:[evidence,'Quality Improvement Plan','Learner Survey'].filter((v,i,a)=>a.indexOf(v)===i),
    reflectionPrompts:['What is the strongest evidence for this claim?','What changed, and for whom?','What remains weaker or uncertain?'],
    answerBuilder:builder(subtheme,theme,index)
  }
})
