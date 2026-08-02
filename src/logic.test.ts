import { describe, expect, it } from 'vitest'
import { questions } from './data/questions'
import { canPush, feedbackFromBuild, feedbackFromReview, filterQuestions, getFollowUp, nextQuestion } from './utils/logic'
describe('question selection',()=>{
  it('filters by setting',()=>expect(filterQuestions(questions,'School','Senior Leader',[]).every(q=>q.settings.includes('School'))).toBe(true))
  it('filters by role',()=>expect(filterQuestions(questions,'School','SEND Lead',[]).every(q=>q.roles.includes('SEND Lead'))).toBe(true))
  it('filters by theme',()=>expect(filterQuestions(questions,'School','Senior Leader',['Safeguarding']).every(q=>q.theme==='Safeguarding')).toBe(true))
  it('avoids duplicates',()=>expect(nextQuestion(questions,[questions[0].id],0)?.id).not.toBe(questions[0].id))
  it('uses persona follow-ups',()=>expect(getFollowUp(questions[0],'chris',0)).toContain('evidence'))
  it('meets content minimums',()=>{expect(questions.length).toBeGreaterThanOrEqual(45);expect(questions.filter(q=>q.answerBuilder).length).toBeGreaterThanOrEqual(15)})
})
describe('feedback',()=>{
  it('rewards strong builder choices',()=>{
    const b=questions[0].answerBuilder!
    const result=feedbackFromBuild({currentPosition:b.currentPosition![0],evidence:b.evidence![0],action:b.action![0],impact:b.impact![0],remainingChallenge:b.remainingChallenge![0]},2)
    expect(result.outcome).toBe('Credible and Well Evidenced');expect(result.ratings.Evidence).toBeGreaterThan(3)
  })
  it('generates self-review feedback',()=>expect(feedbackFromReview({position:true,evidence:true,action:true,impact:true,weakness:true,direct:true},'Learners improved.',2).outcome).toBe('You Answered the Question'))
  it('respects push limits',()=>{expect(canPush(1)).toBe(true);expect(canPush(2)).toBe(false)})
})
