import { personas } from './personas'
import type { FrameworkArea, PersonaId } from '../types'

export type InterviewPackFamily = {
  id:'safeguarding-assurance'|'curriculum-quality'
  title:string
  frameworkArea:FrameworkArea
  summary:string
  scenario:string
  learnerRole:string
  learnerInstructions:string
  memoryPrompts:string[]
  questions:Record<PersonaId,string[]>
}

export type BodyswapsInterviewPack = {
  id:string
  familyId:InterviewPackFamily['id']
  personaId:PersonaId
  title:string
  description:string
  conversationTopic:string
  learnerRole:string
  aiRoleBackstory:string
  aiCommunicationStyle:string
  learnerInstructions:string
  memoryPrompts:string[]
  questionBank:string[]
  coachQuestions:string[]
  assessmentCriteria:string[]
  recommendedSettings:{conversationLength:number;aiResponseWords:number;language:string;languageLevel:string;conversationStart:string;environment:string}
}

export const interviewPackFamilies:InterviewPackFamily[]=[
  {
    id:'safeguarding-assurance',title:'Safeguarding assurance',frameworkArea:'Safeguarding',
    summary:'Defend how leaders know safeguarding is effective across college, workplace, online and off-site learning.',
    scenario:'A college leader is meeting an independent reviewer after an internal safeguarding review. The reviewer is testing whether leaders understand learners’ lived experience, respond effectively to intelligence and can identify where assurance remains weaker across different provision streams.',
    learnerRole:'You are a college leader responsible for explaining and defending the effectiveness of safeguarding arrangements across a diverse general further education college.',
    learnerInstructions:'Answer directly and conversationally. Use evidence you could genuinely substantiate, explain what it demonstrates, connect action to changes for learners and acknowledge any remaining weakness. Do not invent figures or claim that practice is universally secure.',
    memoryPrompts:['What is your honest current position?','Which two or three sources give you assurance?','What changed because leaders acted?','What would learners or apprentices experience differently?','Where is assurance least secure, and what happens next?'],
    questions:{
      chris:['What evidence gives you confidence that safeguarding is effective, and what might challenge that conclusion?','What did your records, learner voice and referral reviews each demonstrate?','How do you test whether reported confidence matches actual reporting behaviour?','Which group or location is least visible in your evidence?','What evidence would cause you to revise your current judgement?','Summarise the strongest and weakest parts of your assurance in two sentences.'],
      jenny:['What is demonstrably safer or better for learners because of leaders’ safeguarding work?','You have described training and procedures; what changed afterwards?','Which action produced the clearest improvement, and how was that verified?','Where has activity not yet produced the intended effect?','What difference would a learner notice today compared with a year ago?','What is the next change leaders need to secure?'],
      raj:['How do you know learners receive an equally effective safeguarding response across all provision?','Is your strongest example typical of adult, apprentice, high-needs and off-site provision?','Where do referral timeliness or learner confidence vary?','How do leaders find small pockets of weaker practice?','What checks show that staff apply expectations consistently?','Which inconsistency remains, and how will you know it has closed?'],
      sarah:['What would learners say happens when they raise a safeguarding concern?','Which learners are least confident that concerns will be resolved?','How have learner accounts changed safeguarding teaching or support?','What would an apprentice studying mainly in the workplace experience?','How do you hear from learners who rarely respond to surveys?','What learner experience still needs to improve?'],
      martin:['How are governors assured that safeguarding arrangements work in practice?','What information enables governors to challenge rather than simply receive updates?','How are exceptions, delays and less-heard groups made visible to the board?','Give an example of governance challenge changing leaders’ action.','How does the board test whether improvement has endured?','Where should governors ask a more difficult question next?'],
      elaine:['How is safeguarding knowledge deliberately sequenced through the curriculum?','How do teachers check that learners can apply safeguarding knowledge in realistic situations?','How is content adapted for apprentices, adults and learners with high needs?','What do assessment and learner discussion show about gaps in understanding?','How have curriculum teams responded where knowledge was insecure?','What safeguarding knowledge should learners retain and use beyond college?']
    }
  },
  {
    id:'curriculum-quality',title:'Curriculum quality and coherence',frameworkArea:'Curriculum, teaching and training',
    summary:'Explain why curriculum decisions are appropriate and how leaders know teaching, assessment and support improve learner outcomes.',
    scenario:'A college leader is meeting an independent reviewer following a cross-college curriculum review. The reviewer is testing whether curriculum intent becomes consistently effective teaching, assessment and support across young people, adults, apprentices, higher-level routes, commercial provision and learners with high needs.',
    learnerRole:'You are a curriculum or senior leader responsible for explaining the quality, coherence and impact of curriculum decisions across a diverse general further education college.',
    learnerInstructions:'Explain the rationale for curriculum choices, use specific evidence from implementation and learner work, connect decisions to learner progress and destinations, and be candid about variation. Avoid relying on plans, meetings or staff training as proof that the curriculum is effective.',
    memoryPrompts:['What is the curriculum trying to enable learners to know or do?','What evidence shows implementation matches that intent?','What changed in teaching, assessment or support?','What difference is visible in learner work, progress or destination?','Where is implementation inconsistent, and what is the next test?'],
    questions:{
      chris:['What evidence shows that curriculum intent is realised in learners’ day-to-day experience?','What did work scrutiny, assessment, learner discussion and destination evidence each reveal?','Which evidence contradicts the strongest curriculum narrative?','How do you distinguish curriculum quality from favourable headline outcomes?','What evidence is missing for smaller or higher-level provision?','State the most secure and least secure curriculum claim you can substantiate.'],
      jenny:['What changed for learners because of the curriculum decisions leaders made?','You have described redesign and staff development; what improved afterwards?','Where is the effect visible in learner knowledge, work or progress?','Which curriculum action has not yet produced sufficient impact?','How did the change affect learners facing the greatest barriers?','What result must improve next?'],
      raj:['How consistently is the intended curriculum implemented across subjects and provision types?','Is the example you gave typical, or is it one strong team?','Where do assessment practice, sequencing or expectations vary?','How do leaders identify variation in small, off-site or workplace programmes?','What has successfully spread from stronger to weaker areas?','Which inconsistency remains most important?'],
      sarah:['How would learners describe the purpose and coherence of their programme?','Can learners explain how current learning builds on what came before?','What do apprentices and adults say about the relevance of learning to their goals?','How are learners with high needs supported without reducing ambition or independence?','Whose experience is least represented in curriculum evaluation?','What would learners say still makes learning harder than it should be?'],
      martin:['How are governors assured that curriculum quality is improving rather than activity increasing?','What curriculum information does the board receive below whole-college averages?','How do governors challenge variation between provision types?','Give an example of board challenge leading to a different curriculum decision.','How is investment connected to subsequent learner benefit?','What curriculum risk should governors monitor more closely?'],
      elaine:['Why is the curriculum sequenced in this way?','What critical knowledge or skill must learners master before moving on?','How do teachers use assessment to identify and repair misconceptions?','How are curriculum choices informed by starting points, destinations and employer need?','Where does teaching fail to realise curriculum intent consistently?','What would convincing improvement look like in learner work?']
    }
  }
]

const personaStyle:Record<PersonaId,string>={
  chris:'Formal, precise and evidence-led. Ask one question at a time, request triangulation and calmly test whether contrary evidence changes the conclusion.',
  jenny:'Direct and outcome-focused. Politely interrupt descriptions of activity and ask what changed, for whom and how the change was verified.',
  raj:'Measured and persistent. Test whether examples are representative across groups, sites and provision types, and ask explicitly about variation.',
  sarah:'Calm, curious and learner-centred. Return organisational claims to lived experience and seek the voices of less-heard learners and apprentices.',
  martin:'Strategic and professionally sceptical. Probe governance information, challenge, decisions and assurance without pretending that governors manage operations.',
  elaine:'Analytical and curriculum-focused. Probe rationale, sequencing, assessment, expertise and whether implementation produces ambitious learning.'
}

export const buildInterviewPack=(family:InterviewPackFamily,personaId:PersonaId):BodyswapsInterviewPack=>{
  const persona=personas.find(item=>item.id===personaId)!
  return {
    id:`${family.id}-${personaId}`,familyId:family.id,personaId,
    title:`${family.title}: ${persona.name}'s challenge`,
    description:`A spoken professional-development encounter about ${family.title.toLowerCase()}, led in the style of ${persona.name}, ${persona.title.toLowerCase()}.`,
    conversationTopic:`${family.scenario} Use the question bank flexibly: begin with a related but not identical opening, listen to the learner's answer, then choose follow-up questions that test ${persona.focus.toLowerCase()}. Do not recite every question or imply an official inspection judgement.`,
    learnerRole:family.learnerRole,
    aiRoleBackstory:`You are ${persona.name}, an independent professional-development roleplay character known as ${persona.title}. Your priority is ${persona.focus.toLowerCase()}. You are not an Ofsted inspector and must not claim to predict or award an inspection grade. Your purpose is to help the learner rehearse a credible professional conversation.`,
    aiCommunicationStyle:personaStyle[personaId],
    learnerInstructions:family.learnerInstructions,
    memoryPrompts:family.memoryPrompts,
    questionBank:family.questions[personaId],
    coachQuestions:['Which claim did you support most convincingly?','Where did you describe activity without fully explaining impact?','Which question made you reconsider the consistency of your evidence?','How effectively did you keep learners and apprentices central?','What evidence anchor will you prepare before trying this encounter again?'],
    assessmentCriteria:['Answers the question directly','Uses specific and relevant evidence','Explains what the evidence demonstrates','Connects action to learner impact','Addresses consistency and variation','Keeps learners and apprentices central','Acknowledges limitations honestly','Responds constructively to challenge','Communicates clearly and concisely'],
    recommendedSettings:{conversationLength:10,aiResponseWords:60,language:'English (UK)',languageLevel:'Native',conversationStart:'AI character',environment:'Professional meeting room or classroom'}
  }
}

export const bodyswapsInterviewPacks=interviewPackFamilies.flatMap(family=>personas.map(persona=>buildInterviewPack(family,persona.id)))

export const formatInterviewPack=(pack:BodyswapsInterviewPack)=>[
  `TITLE\n${pack.title}`,`DESCRIPTION\n${pack.description}`,`CONVERSATION TOPIC\n${pack.conversationTopic}`,
  `LEARNER ROLE\n${pack.learnerRole}`,`AI ROLE AND BACKSTORY\n${pack.aiRoleBackstory}`,`AI COMMUNICATION STYLE\n${pack.aiCommunicationStyle}`,
  `LEARNER INSTRUCTIONS\n${pack.learnerInstructions}`,`MEMORY CARD PROMPTS\n${pack.memoryPrompts.map((item,index)=>`${index+1}. ${item}`).join('\n')}`,
  `ADAPTIVE QUESTION BANK\n${pack.questionBank.map((item,index)=>`${index+1}. ${item}`).join('\n')}`,
  `AI COACH QUESTIONS\n${pack.coachQuestions.map((item,index)=>`${index+1}. ${item}`).join('\n')}`,
  `ASSESSMENT CRITERIA\n${pack.assessmentCriteria.map((item,index)=>`${index+1}. ${item}`).join('\n')}`,
  `RECOMMENDED SETTINGS\nConversation length: ${pack.recommendedSettings.conversationLength} exchanges\nAI response length: ${pack.recommendedSettings.aiResponseWords} words\nLanguage: ${pack.recommendedSettings.language}\nLanguage level: ${pack.recommendedSettings.languageLevel}\nConversation start: ${pack.recommendedSettings.conversationStart}\nEnvironment: ${pack.recommendedSettings.environment}`,
  'NOTICE\nIndependent professional-development material for configuration in the separate Bodyswaps platform. Not affiliated with or endorsed by Bodyswaps or Ofsted.'
].join('\n\n')
