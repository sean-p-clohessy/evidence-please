import type { AnswerOption, AnswerSection, Debrief, InspectionQuestion, PersonaId, ProvisionStream, Ratings, ReviewAnswers } from '../types'

export const filterQuestions = (items:InspectionQuestion[], setting:string, role:string, selectedThemes:string[], selectedStreams:ProvisionStream[]=[]) =>
  items.filter(q => q.settings.includes(setting) && q.roles.includes(role) && (!selectedThemes.length || selectedThemes.includes(q.theme)) && (!selectedStreams.length || q.provisionStreams.some(stream=>selectedStreams.includes(stream))))

export const nextQuestion = (items:InspectionQuestion[], used:string[], seed=0) => {
  const available = items.filter(q => !used.includes(q.id))
  return available.length ? available[Math.abs(seed) % available.length] : undefined
}

export const getFollowUp = (q:InspectionQuestion, persona:PersonaId, used:number) => q.personas[persona].followUps[used]
export const canPush = (count:number, limit=2) => count < limit

const hashSeed = (value:string|number) => {
  const text=String(value); let hash=2166136261
  for(let i=0;i<text.length;i++){ hash^=text.charCodeAt(i); hash=Math.imul(hash,16777619) }
  return hash>>>0
}

/** Stable within a session, varied between sessions, and independent of option quality. */
export const shuffleOptions = <T>(items:readonly T[], seed:string|number):T[] => {
  const result=[...items]; let state=hashSeed(seed)
  for(let i=result.length-1;i>0;i--){
    state=(Math.imul(state,1664525)+1013904223)>>>0
    const j=state%(i+1); [result[i],result[j]]=[result[j],result[i]]
  }
  return result
}

export type TypedAnswerSignals = {
  substantive:boolean; evidenceFinding:boolean; causalImpact:boolean; breadth:boolean;
  honestQualification:boolean; learnerConnection:boolean; directOpening:boolean; keywordList:boolean
}

export const analyseTypedAnswer = (answer:string):TypedAnswerSignals => {
  const normal=answer.toLowerCase().replace(/[’]/g,"'").trim()
  const words=normal.match(/[a-z0-9%'-]+/g)??[]
  const unique=new Set(words)
  const hasSentence=/[.!?;:]|\b(because|although|however|therefore|while)\b/.test(normal)
  const coachingTerms=new Set(['evidence','impact','learner','learners','consistent','consistency','data','improved','improvement','challenge','action','honest','direct'])
  const coachingTermShare=words.filter(word=>coachingTerms.has(word)).length/Math.max(1,words.length)
  const keywordList=words.length<12 || (words.length>5&&unique.size/words.length<.45) || (words.length<20&&coachingTermShare>.5)
  const substantive=words.length>=12&&unique.size>=9&&hasSentence&&!keywordList
  const source=/\b(data|dashboard|survey|feedback|records?|audit|review|observation|sample|minutes|destinations?|attendance|achievement|retention)\b/.test(normal)
  const finding=/\b(show(?:s|ed)?|indicat(?:e|es|ed)|demonstrat(?:e|es|ed)|found|revealed|rose|fell|declined|increased|decreased|narrowed|remained|compared|\d+(?:\.\d+)?%)\b/.test(normal)||/\bfrom\s+\d[^.!?]{0,35}\bto\s+\d/.test(normal)
  const cause=/\b(as a result|which led to|resulted in|so that|therefore|following|because of|after leaders?|consequently)\b/.test(normal)
  const change=/\b(improv(?:e|ed|ement)|increas(?:e|ed)|decreas(?:e|ed)|reduc(?:e|ed|tion)|narrow(?:ed|ing)|chang(?:e|ed)|remain(?:ed|s)|rose|fell|progress(?:ed)?|sustain(?:ed)?)\b/.test(normal)
  return {
    substantive,
    evidenceFinding:substantive&&source&&finding,
    causalImpact:substantive&&cause&&change,
    breadth:substantive&&/\b(across|all areas|each area|departments?|curriculum areas?|groups?|cohorts?|representative|sample|exception|variation|consistent(?:ly)?)\b/.test(normal),
    honestQualification:substantive&&/\b(however|although|but|not yet|remain(?:s|ed)?|weak(?:er|ness)?|challenge|exception|limited|mixed|uncertain|still)\b/.test(normal),
    learnerConnection:substantive&&/\b(learner|student|pupil|apprentice)s?\b/.test(normal)&&/\b(experience|outcome|progress|feedback|voice|support|attendance|achievement|benefit|learning)\b/.test(normal),
    directOpening:substantive&&/^(our current position|we know|leaders know|the evidence|data (?:shows|indicates)|currently|the position)/.test(normal),
    keywordList
  }
}

export const typedAnswerPrompts = (answer:string):string[] => {
  if(!answer.trim()) return []
  const s=analyseTypedAnswer(answer)
  if(!s.substantive) return ['Develop the point in full sentences; isolated terms do not demonstrate a claim.']
  const prompts:string[]=[]
  if(!s.evidenceFinding) prompts.push('Name a source and explain what it showed, not merely that it exists.')
  if(!s.causalImpact) prompts.push('Link an action to a specific change: what happened as a result?')
  if(!s.breadth) prompts.push('Indicate how representative or consistent this is across areas or groups.')
  if(!s.honestQualification) prompts.push('Acknowledge a limitation, exception or remaining weakness if one exists.')
  return prompts.slice(0,2)
}

const emptyRatings = ():Ratings => ({Evidence:1,Impact:1,Consistency:1,Insight:1,'Learner focus':1,Brevity:3,Honesty:1,Directness:1})
export const feedbackFromBuild = (selected:Partial<Record<AnswerSection,AnswerOption>>, evidenceCount=0):Debrief => {
  const options = Object.values(selected).filter(Boolean) as AnswerOption[]
  const signals = options.flatMap(o=>o.qualitySignals)
  const weaknesses = options.flatMap(o=>o.weaknesses)
  const ratings=emptyRatings()
  ratings.Evidence=Math.min(5,1+signals.filter(s=>['evidence','triangulation','specificity'].includes(s)).length+Math.min(1,evidenceCount))
  ratings.Impact=Math.min(5,1+signals.filter(s=>s==='impact').length*2)
  ratings.Consistency=Math.min(5,1+signals.filter(s=>s==='consistency').length*2)
  ratings.Insight=Math.min(5,1+signals.filter(s=>['honesty','specificity'].includes(s)).length)
  ratings.Honesty=Math.min(5,1+signals.filter(s=>s==='honesty').length*2)
  ratings.Directness=Math.min(5,2+Number(options.length>=4))
  ratings['Learner focus']=Math.min(5,1+signals.filter(s=>s==='learner focus').length*2)
  const strong=signals.length >= 5
  return {
    outcome:strong ? 'Credible and Well Evidenced' : weaknesses.includes('process only') || weaknesses.includes('activity only') ? 'Too Much Process, Not Enough Impact' : 'Requires More Specificity',
    summary:strong ? 'You built a balanced response with evidence, action, impact and an honest view of what remains.' : 'Your response has a credible foundation, but some selected statements need firmer evidence or clearer impact.',
    strengths:[...new Set(signals)].slice(0,3).map(s=>`You demonstrated ${s}.`),
    opportunities:[...new Set(weaknesses)].slice(0,3).map(w=>`Watch for ${w}.`),
    ratings
  }
}

export const feedbackFromReview = (review:ReviewAnswers, answer:string, evidenceCount=0):Debrief => {
  const yes=Object.values(review).filter(Boolean).length
  const signals=analyseTypedAnswer(answer)
  const ratings=emptyRatings()
  ratings.Evidence=Math.min(5,1+Number(review.evidence)+Number(signals.evidenceFinding)*2+Math.min(1,evidenceCount))
  ratings.Impact=Math.min(5,1+Number(review.impact)+Number(signals.causalImpact)*2)
  ratings.Insight=Math.min(5,1+Number(review.position)+Number(review.weakness)+Number(signals.honestQualification))
  ratings.Honesty=Math.min(5,1+Number(review.weakness)*2+Number(signals.honestQualification))
  ratings.Directness=Math.min(5,1+Number(review.direct)*2+Number(signals.directOpening))
  ratings.Consistency=Math.min(5,1+Number(review.evidence)+Number(signals.breadth)*2)
  ratings['Learner focus']=signals.learnerConnection?4:1
  ratings.Brevity=answer.length > 1200 ? 2 : answer.length > 80 ? 4 : 3
  const observed=[
    signals.evidenceFinding&&'Your wording explains what a source showed.',
    signals.causalImpact&&'Your wording connects action with a stated change.',
    signals.breadth&&'You addressed consistency or representativeness.',
    signals.honestQualification&&'Honest qualification or remaining uncertainty was visible.',
    signals.learnerConnection&&'The response connects leadership claims to learners.'
  ].filter(Boolean) as string[]
  const supportedCount=observed.length
  return {
    outcome:yes>=5&&supportedCount>=3?'You Answered the Question':yes>=3&&signals.substantive?'Convincing, With Reservations':'Evidence Pending',
    summary:signals.keywordList?'The response contains relevant terms, but isolated words are not treated as evidence of a developed answer.':yes>=5&&supportedCount>=3?'Your self-review and the visible structure of your response suggest a direct, balanced rehearsal answer.':'Your reflection suggests another pass. These prompts identify visible features, not the meaning or accuracy of your response.',
    strengths:[...observed,...Object.entries(review).filter(([,v])=>v).map(([k])=>`Self-review confirmed: ${k}.`)].slice(0,3),
    opportunities:[...typedAnswerPrompts(answer),...Object.entries(review).filter(([,v])=>!v).map(([k])=>`Revisit your self-review item: ${k}.`)].slice(0,3),
    ratings
  }
}
