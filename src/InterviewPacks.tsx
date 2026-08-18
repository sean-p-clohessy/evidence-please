import { useEffect, useMemo, useRef, useState } from 'react'
import { bodyswapsInterviewPacks, formatInterviewPack, interviewPackFamilies } from './data/interviewPacks'
import { personas } from './data/personas'
import type { PersonaId } from './types'

const PackField=({label,value}:{label:string;value:string})=><section className="pack-field"><h3>{label}</h3><p>{value}</p></section>

export function InterviewPacks({onBack}:{onBack:()=>void}){
  const [familyId,setFamilyId]=useState(interviewPackFamilies[0].id)
  const [personaId,setPersonaId]=useState<PersonaId>('chris')
  const [copied,setCopied]=useState(false)
  const headingRef=useRef<HTMLHeadingElement>(null)
  const family=interviewPackFamilies.find(item=>item.id===familyId)!
  const pack=useMemo(()=>bodyswapsInterviewPacks.find(item=>item.familyId===familyId&&item.personaId===personaId)!,[familyId,personaId])
  useEffect(()=>headingRef.current?.focus(),[])
  const copyPack=async()=>{
    try{ await navigator.clipboard.writeText(formatInterviewPack(pack)); setCopied(true); window.setTimeout(()=>setCopied(false),1800) }
    catch{ setCopied(false) }
  }
  return <section className="packs-screen" aria-labelledby="packs-heading">
    <div className="section-heading"><div><p className="eyebrow">External practice file // pilot library</p><h1 id="packs-heading" ref={headingRef} tabIndex={-1}>Bodyswaps interview packs</h1></div><button className="text-button" onClick={onBack}>← Return</button></div>
    <div className="packs-intro"><p>Prepare a spoken encounter using a scenario family and one of the six Evidence, Please inspector styles. Copy the completed field pack into Bodyswaps Go and adapt it to your organisation before assigning it.</p><p><strong>Independent pilot:</strong> Evidence, Please is not affiliated with or endorsed by Bodyswaps or Ofsted. No information is sent to either platform.</p></div>
    <div className="family-grid" aria-label="Scenario families">{interviewPackFamilies.map(item=><button key={item.id} className={`family-card ${familyId===item.id?'selected':''}`} aria-pressed={familyId===item.id} onClick={()=>setFamilyId(item.id)}><span>{item.frameworkArea}</span><strong>{item.title}</strong><p>{item.summary}</p><small>6 inspector packs</small></button>)}</div>
    <div className="pack-workspace">
      <aside className="pack-personas" aria-label="Inspector styles"><span className="eyebrow">Choose an inspector style</span>{personas.map(persona=><button key={persona.id} className={personaId===persona.id?'selected':''} aria-pressed={personaId===persona.id} onClick={()=>setPersonaId(persona.id)}><i style={{background:persona.colour}}>{persona.initials}</i><span><strong>{persona.name}</strong><small>{persona.title}</small></span></button>)}</aside>
      <article className="pack-document">
        <header><div><span className="eyebrow">Pack {pack.id}</span><h2>{pack.title}</h2><p>{pack.description}</p></div><button className="primary" onClick={copyPack}>{copied?'Copied':'Copy complete pack'}</button></header>
        <div className="pack-meta"><span>10 exchanges</span><span>60-word AI replies</span><span>English (UK)</span><span>AI speaks first</span></div>
        <PackField label="Conversation topic" value={pack.conversationTopic}/>
        <div className="pack-columns"><PackField label="Learner role" value={pack.learnerRole}/><PackField label="AI role and backstory" value={pack.aiRoleBackstory}/></div>
        <PackField label="AI communication style" value={pack.aiCommunicationStyle}/>
        <PackField label="Learner instructions" value={pack.learnerInstructions}/>
        <section className="pack-list"><h3>Private memory-card prompts</h3><ol>{pack.memoryPrompts.map(item=><li key={item}>{item}</li>)}</ol></section>
        <section className="pack-list"><h3>Adaptive question bank</h3><ol>{pack.questionBank.map(item=><li key={item}>{item}</li>)}</ol></section>
        <div className="pack-columns"><section className="pack-list"><h3>AI Coach questions</h3><ol>{pack.coachQuestions.map(item=><li key={item}>{item}</li>)}</ol></section><section className="pack-list"><h3>Assessment criteria</h3><ol>{pack.assessmentCriteria.map(item=><li key={item}>{item}</li>)}</ol></section></div>
        <section className="pack-field"><h3>Manual selections in Bodyswaps</h3><p>Choose an appropriate professional avatar and a {pack.recommendedSettings.environment.toLowerCase()}. Keep the roleplay private while testing and preview the complete learner experience before assignment.</p></section>
      </article>
    </div>
  </section>
}
