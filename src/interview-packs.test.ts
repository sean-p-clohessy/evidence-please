import { describe, expect, it } from 'vitest'
import { bodyswapsInterviewPacks, formatInterviewPack, interviewPackFamilies } from './data/interviewPacks'
import { personas } from './data/personas'

describe('Bodyswaps interview pack pilot library',()=>{
  it('contains two families with one pack for every inspector style',()=>{
    expect(interviewPackFamilies).toHaveLength(2)
    expect(bodyswapsInterviewPacks).toHaveLength(interviewPackFamilies.length*personas.length)
    for(const family of interviewPackFamilies){
      expect(bodyswapsInterviewPacks.filter(pack=>pack.familyId===family.id).map(pack=>pack.personaId).sort()).toEqual(personas.map(persona=>persona.id).sort())
    }
  })

  it('gives every pack complete Bodyswaps-ready fields',()=>{
    for(const pack of bodyswapsInterviewPacks){
      expect(pack.title.length).toBeGreaterThan(20)
      expect(pack.description.length).toBeGreaterThan(50)
      expect(pack.conversationTopic.length).toBeGreaterThan(200)
      expect(pack.learnerRole.length).toBeGreaterThan(80)
      expect(pack.aiRoleBackstory.length).toBeGreaterThan(150)
      expect(pack.aiCommunicationStyle.length).toBeGreaterThan(80)
      expect(pack.learnerInstructions.length).toBeGreaterThan(150)
      expect(pack.memoryPrompts).toHaveLength(5)
      expect(pack.questionBank).toHaveLength(6)
      expect(pack.coachQuestions).toHaveLength(5)
      expect(pack.assessmentCriteria.length).toBeGreaterThanOrEqual(8)
      expect(pack.assessmentCriteria.length).toBeLessThanOrEqual(10)
    }
  })

  it('keeps the six inspector question banks genuinely distinct within each family',()=>{
    for(const family of interviewPackFamilies){
      const banks=bodyswapsInterviewPacks.filter(pack=>pack.familyId===family.id).map(pack=>pack.questionBank.join(' '))
      expect(new Set(banks).size).toBe(personas.length)
    }
  })

  it('retains the independent rehearsal boundary in AI instructions',()=>{
    for(const pack of bodyswapsInterviewPacks){
      expect(pack.aiRoleBackstory).toContain('not an Ofsted inspector')
      expect(pack.conversationTopic).toMatch(/not .*official inspection judgement/i)
    }
  })

  it('formats every field into a copyable complete pack',()=>{
    for(const pack of bodyswapsInterviewPacks){
      const formatted=formatInterviewPack(pack)
      for(const heading of ['TITLE','CONVERSATION TOPIC','LEARNER ROLE','AI ROLE AND BACKSTORY','ADAPTIVE QUESTION BANK','AI COACH QUESTIONS','ASSESSMENT CRITERIA','RECOMMENDED SETTINGS','NOTICE']) expect(formatted).toContain(heading)
      expect(formatted).toContain(pack.questionBank[0])
      expect(formatted).toMatch(/not affiliated with or endorsed by Bodyswaps or Ofsted/i)
    }
  })
})
