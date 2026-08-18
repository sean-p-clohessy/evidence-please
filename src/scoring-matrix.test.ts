import { describe, expect, it } from 'vitest'
import { questions } from './data/questions'
import type { AnswerOption, AnswerSection } from './types'
import { feedbackFromBuild } from './utils/logic'

const sections:AnswerSection[]=['currentPosition','evidence','action','impact','remainingChallenge']

const combinationsFor = (question:(typeof questions)[number]) => {
  const builder=question.answerBuilder!
  const combinations:Partial<Record<AnswerSection,AnswerOption>>[]=[{}]
  for(const section of sections){
    const options=builder[section]??[]
    const existing=[...combinations]
    combinations.length=0
    for(const combination of existing) for(const option of options) combinations.push({...combination,[section]:option})
  }
  return combinations
}

describe('complete answer scoring matrix',()=>{
  it.each(questions.map(question=>[question.id,question] as const))('%s has coherent outcomes across every answer combination',(_,question)=>{
    const builder=question.answerBuilder!
    const combinations=combinationsFor(question)
    const expectedCount=sections.reduce((total,section)=>total*(builder[section]?.length??0),1)
    expect(combinations).toHaveLength(expectedCount)
    expect(expectedCount).toBeGreaterThan(0)

    const evaluated=combinations.map(selected=>({
      selected,
      weaknesses:Object.values(selected).flatMap(option=>option?.weaknesses??[]),
      result:feedbackFromBuild(selected,3,builder)
    }))

    for(const {weaknesses,result} of evaluated){
      expect(Number.isInteger(result.score)).toBe(true)
      expect(result.score).toBeGreaterThanOrEqual(0)
      expect(result.score).toBeLessThanOrEqual(100)
      if(weaknesses.length) expect(result.outcome).not.toBe('Credible and Well Evidenced')
      if(result.ratings.Impact<4) expect(result.outcome).not.toBe('Credible and Well Evidenced')
      if(result.score<70||Object.values(result.ratings).some(value=>value<3)) expect(result.improvementExample).toBeTruthy()
      if(result.score>=70&&result.score<85) expect(result.outcome).toBe('Well Structured, With Gaps')
      if(result.score>=55&&result.score<70) expect(result.outcome).toBe('Credible Foundation — Keep Building')
    }

    const best=evaluated.reduce((highest,item)=>item.result.score>highest.result.score?item:highest)
    expect(best.result.score).toBe(100)
    expect(best.result.outcome).toBe('Credible and Well Evidenced')

    const whollyWeak=Object.fromEntries(sections.map(section=>[section,builder[section]?.find(option=>option.weaknesses.length)]))
    const weakResult=feedbackFromBuild(whollyWeak,0,builder)
    expect(weakResult.score).toBeLessThan(55)
    expect(weakResult.outcome).not.toBe('Credible and Well Evidenced')

    for(const section of sections){
      for(const weakOption of builder[section]?.filter(option=>option.weaknesses.length)??[]){
        const weakened=feedbackFromBuild({...best.selected,[section]:weakOption},3,builder)
        expect(weakened.score).toBeLessThan(best.result.score)
        expect(weakened.outcome).not.toBe('Credible and Well Evidenced')
      }
    }
  })
})
