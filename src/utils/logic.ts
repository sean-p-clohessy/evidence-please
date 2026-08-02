import type { AnswerOption, AnswerSection, Debrief, InspectionQuestion, PersonaId, Ratings, ReviewAnswers } from '../types'

export const filterQuestions = (items:InspectionQuestion[], setting:string, role:string, selectedThemes:string[]) =>
  items.filter(q => q.settings.includes(setting) && q.roles.includes(role) && (!selectedThemes.length || selectedThemes.includes(q.theme)))

export const nextQuestion = (items:InspectionQuestion[], used:string[], seed=0) => {
  const available = items.filter(q => !used.includes(q.id))
  return available.length ? available[Math.abs(seed) % available.length] : undefined
}

export const getFollowUp = (q:InspectionQuestion, persona:PersonaId, used:number) => q.personas[persona].followUps[used]
export const canPush = (count:number, limit=2) => count < limit

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
  const ratings=emptyRatings()
  ratings.Evidence=Math.min(5,1+Number(review.evidence)*2+Math.min(1,evidenceCount))
  ratings.Impact=1+Number(review.impact)*3
  ratings.Insight=1+Number(review.position)*2+Number(review.weakness)
  ratings.Honesty=1+Number(review.weakness)*3
  ratings.Directness=1+Number(review.direct)*3
  ratings.Consistency=1+Number(review.evidence)*2
  ratings['Learner focus']=answer.toLowerCase().match(/learner|student|pupil|apprentice/) ? 4 : 1
  ratings.Brevity=answer.length > 1200 ? 2 : answer.length > 80 ? 4 : 3
  return {
    outcome:yes>=5 ? 'You Answered the Question' : yes>=3 ? 'Convincing, With Reservations' : 'Evidence Pending',
    summary:yes>=5 ? 'Your self-review identifies a direct, balanced and evidenced response.' : 'Your reflection suggests the answer needs another pass. Add what the evidence showed and what changed.',
    strengths:Object.entries(review).filter(([,v])=>v).slice(0,3).map(([k])=>`Self-review confirmed: ${k}.`),
    opportunities:Object.entries(review).filter(([,v])=>!v).slice(0,3).map(([k])=>`Revisit: ${k}.`),
    ratings
  }
}
