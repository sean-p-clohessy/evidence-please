import { describe, expect, it } from 'vitest'
import { activeFramework, ofstedReportSources, reportFindingPatterns } from './data/ofstedCorpus'
import { questions } from './data/questions'
import { provisionStreams } from './data/settings'
import { analyseTypedAnswer, calculateGameScore, canPush, feedbackFromBuild, feedbackFromReview, filterQuestions, getFollowUp, nextQuestion, shuffleOptions, typedAnswerPrompts } from './utils/logic'
describe('question selection',()=>{
  const college='General Further Education College'
  it('filters by setting',()=>expect(filterQuestions(questions,college,'Senior Leader',[]).every(q=>q.settings.includes(college))).toBe(true))
  it('filters by role',()=>expect(filterQuestions(questions,college,'SEND Lead',[]).every(q=>q.roles.includes('SEND Lead'))).toBe(true))
  it('filters by theme',()=>expect(filterQuestions(questions,college,'Senior Leader',['Safeguarding']).every(q=>q.theme==='Safeguarding')).toBe(true))
  it('filters by provision stream',()=>expect(filterQuestions(questions,college,'Senior Leader',[],['Provision for learners with high needs']).every(q=>q.provisionStreams.includes('Provision for learners with high needs'))).toBe(true))
  it('avoids duplicates',()=>expect(nextQuestion(questions,[questions[0].id],0)?.id).not.toBe(questions[0].id))
  it('uses persona follow-ups',()=>expect(getFollowUp(questions[0],'chris',0)).toContain('evidence'))
  it('meets content minimums',()=>{expect(questions.length).toBeGreaterThanOrEqual(45);expect(questions.every(q=>q.answerBuilder)).toBe(true)})
  it('uses only the active renewed toolkit edition',()=>expect(questions.every(q=>q.frameworkEdition===activeFramework.id)).toBe(true))
})
describe('feedback',()=>{
  it('rewards strong builder choices',()=>{
    const b=questions[0].answerBuilder!
    const result=feedbackFromBuild({currentPosition:b.currentPosition![0],evidence:b.evidence![0],action:b.action![0],impact:b.impact![0],remainingChallenge:b.remainingChallenge![0]},2)
    expect(result.outcome).toBe('Credible and Well Evidenced');expect(result.ratings.Evidence).toBeGreaterThan(3)
  })
  it('generates self-review feedback for a developed response',()=>expect(feedbackFromReview(
    {position:true,evidence:true,action:true,impact:true,weakness:true,direct:true},
    'Our current position is mixed. Survey data showed learner confidence increased from 62% to 76% after leaders changed tutorial support. As a result, learners across three groups reported better access, although one group remains weaker.',
    2
  ).outcome).toBe('You Answered the Question'))
  it('converts reflective indicators into a bounded game score',()=>{
    const low={Evidence:1,Impact:1,Consistency:1,Insight:1,'Learner focus':1,Brevity:1,Honesty:1,Directness:1}
    const high={Evidence:5,Impact:5,Consistency:5,Insight:5,'Learner focus':5,Brevity:5,Honesty:5,Directness:5}
    expect(calculateGameScore(low)).toBe(0)
    expect(calculateGameScore(high)).toBe(100)
  })
  it('includes the calculated score in debrief feedback',()=>{
    const result=feedbackFromReview({},'A short response with enough words to form one complete sentence.',0)
    expect(result.score).toBe(calculateGameScore(result.ratings))
  })
  it('explains how to repair weak builder choices and supplies a stronger example',()=>{
    const builder=questions[0].answerBuilder!
    const weak=Object.fromEntries(Object.entries(builder).map(([section,options])=>[section,options?.find(option=>option.weaknesses.length)??options?.[0]]))
    const result=feedbackFromBuild(weak,0,builder)
    expect(result.opportunities.some(item=>/Add|Show|State|Name/.test(item))).toBe(true)
    expect(result.improvementExample?.length).toBeGreaterThan(80)
    expect(result.opportunities.join(' ')).not.toContain('Watch for')
  })
  it('does not give a strong headline when an impact choice fails to demonstrate impact',()=>{
    const builder=questions[0].answerBuilder!
    const result=feedbackFromBuild({
      currentPosition:builder.currentPosition?.[0], evidence:builder.evidence?.[0], action:builder.action?.[0],
      impact:builder.impact?.find(option=>option.weaknesses.includes('impact not demonstrated')),
      remainingChallenge:builder.remainingChallenge?.[0]
    },2,builder)
    expect(result.ratings.Impact).toBe(1)
    expect(result.outcome).not.toBe('Credible and Well Evidenced')
    expect(result.improvementExample).toBeTruthy()
  })
  it('respects push limits',()=>{expect(canPush(1)).toBe(true);expect(canPush(2)).toBe(false)})
})

describe('answer-builder presentation',()=>{
  const options=questions[0].answerBuilder!.evidence!
  it('preserves every option when shuffling',()=>expect(shuffleOptions(options,'session-a').map(o=>o.id).sort()).toEqual(options.map(o=>o.id).sort()))
  it('is deterministic for the same session seed',()=>expect(shuffleOptions(options,'session-a')).toEqual(shuffleOptions(options,'session-a')))
  it('does not leave the strong option permanently first',()=>{
    const positions=new Set(Array.from({length:30},(_,seed)=>shuffleOptions(options,seed).findIndex(o=>o.qualitySignals.length>0)))
    expect(positions.size).toBeGreaterThan(1)
  })
})

describe('typed-answer coaching',()=>{
  const allYes={position:true,evidence:true,action:true,impact:true,weakness:true,direct:true}
  const developed='Our current position is mixed. Attendance dashboard data showed persistent absence fell from 14% to 10% after leaders introduced weekly case reviews. As a result, learners in two priority groups attended more often, although one curriculum area remains weaker than the rest.'
  it('recognises visible evidence, impact, breadth, learner focus and qualification',()=>{
    expect(analyseTypedAnswer(developed)).toMatchObject({substantive:true,evidenceFinding:true,causalImpact:true,breadth:true,honestQualification:true,learnerConnection:true,directOpening:true,keywordList:false})
  })
  it('does not reward a list of magic words',()=>{
    const result=feedbackFromReview(allYes,'evidence impact learner consistent honest direct',3)
    expect(result.outcome).toBe('Evidence Pending')
    expect(result.ratings.Evidence).toBeLessThan(4)
    expect(result.ratings.Impact).toBeLessThan(4)
    expect(result.ratings['Learner focus']).toBe(1)
  })
  it('does not mistake a developed evidence-led opening for keyword stuffing',()=>expect(analyseTypedAnswer('The evidence shows attendance improved across three learner groups after leaders changed the support process, although one group still has weaker outcomes.').keywordList).toBe(false))
  it('distinguishes naming evidence from explaining a finding',()=>{
    const answer='We review the attendance dashboard and learner survey in every meeting because these documents are important to leaders.'
    expect(analyseTypedAnswer(answer).evidenceFinding).toBe(false)
    expect(typedAnswerPrompts(answer)[0]).toContain('what it showed')
  })
  it('gives stronger reflective signals to a developed answer',()=>{
    const developedResult=feedbackFromReview(allYes,developed,2)
    const thinResult=feedbackFromReview(allYes,'Evidence impact learner consistent honest direct',2)
    expect(developedResult.outcome).toBe('You Answered the Question')
    expect(developedResult.ratings.Evidence).toBeGreaterThan(thinResult.ratings.Evidence)
    expect(developedResult.ratings.Impact).toBeGreaterThan(thinResult.ratings.Impact)
  })
  it('keeps short-answer prompting supportive',()=>expect(typedAnswerPrompts('Learner impact evidence.')).toEqual(['Develop the point in full sentences; isolated terms do not demonstrate a claim.']))
})

describe('renewed-toolkit report corpus',()=>{
  it('contains ten post-renewal general FE college reports',()=>{
    expect(ofstedReportSources).toHaveLength(10)
    expect(ofstedReportSources.every(source=>source.providerType==='General Further Education and Tertiary')).toBe(true)
    expect(ofstedReportSources.every(source=>source.inspectionDate>='2025-11-10')).toBe(true)
  })
  it('uses only official Ofsted report URLs',()=>expect(ofstedReportSources.every(source=>source.reportUrl.startsWith('https://files.ofsted.gov.uk/'))).toBe(true))
  it('covers every selected college provision stream',()=>{
    for(const stream of provisionStreams) expect(ofstedReportSources.some(source=>source.provisionStreams.includes(stream))).toBe(true)
  })
  it('keeps every derived pattern traceable to known sources',()=>{
    const ids=new Set(ofstedReportSources.map(source=>source.id))
    expect(reportFindingPatterns.every(pattern=>pattern.sourceIds.length>=2&&pattern.sourceIds.every(id=>ids.has(id)))).toBe(true)
  })
  it('does not leak provider names or URNs into gameplay fragments',()=>{
    const fragments=reportFindingPatterns.flatMap(pattern=>Object.values(pattern.fragments)).join(' ').toLowerCase()
    for(const source of ofstedReportSources){
      expect(fragments).not.toContain(source.providerLabel.toLowerCase())
      expect(fragments).not.toContain(source.urn)
    }
  })
})
