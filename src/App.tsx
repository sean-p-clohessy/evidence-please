import { useEffect, useMemo, useRef, useState } from 'react'
import { evidenceTypes } from './data/evidence'
import { personas } from './data/personas'
import { questions } from './data/questions'
import { modes, provisionStreams, roles, settings, themes } from './data/settings'
import type { AnswerMethod, AnswerOption, AnswerSection, Debrief, ModeId, PersonaId, ProvisionStream, ReviewAnswers } from './types'
import { canPush, feedbackFromBuild, feedbackFromReview, filterQuestions, getFollowUp, nextQuestion, shuffleOptions, typedAnswerPrompts } from './utils/logic'

type Screen='title'|'setup'|'session'|'debrief'
const reviewItems=[
  ['position','Did I clearly establish the current position?'],['evidence','Did I use specific evidence?'],
  ['action','Did I explain what leaders did?'],['impact','Did I describe impact?'],
  ['weakness','Did I recognise remaining weaknesses?'],['direct','Did I answer the question directly?']
]
const sections: {id:AnswerSection;label:string}[]=[
  {id:'currentPosition',label:'Current position'},{id:'evidence',label:'Evidence'},{id:'action',label:'Action taken'},
  {id:'impact',label:'Impact'},{id:'remainingChallenge',label:'Remaining challenge'}
]

function Avatar({id,large=false}:{id:PersonaId,large?:boolean}) {
  const p=personas.find(x=>x.id===id)!
  return <div className={`avatar avatar-${id} ${large?'large':''}`} aria-hidden="true" style={{'--avatar':p.colour} as React.CSSProperties}>
    <span className="hair"/><span className="face"><i/><b>{p.initials}</b></span><span className="body"/>
  </div>
}

function App() {
  const [screen,setScreen]=useState<Screen>('title')
  const [mode,setMode]=useState<ModeId>('quick')
  const [personaId,setPersonaId]=useState<PersonaId>('chris')
  const [setting,setSetting]=useState(settings[0])
  const [role,setRole]=useState(roles[0])
  const [selectedThemes,setSelectedThemes]=useState<string[]>(['Quality of Education'])
  const [selectedStreams,setSelectedStreams]=useState<ProvisionStream[]>([...provisionStreams])
  const [method,setMethod]=useState<AnswerMethod>('type')
  const [currentId,setCurrentId]=useState('')
  const [used,setUsed]=useState<string[]>([])
  const [answer,setAnswer]=useState('')
  const [selected,setSelected]=useState<Partial<Record<AnswerSection,AnswerOption>>>({})
  const [evidence,setEvidence]=useState<string[]>([])
  const [review,setReview]=useState<ReviewAnswers>({})
  const [followUp,setFollowUp]=useState('')
  const [followCount,setFollowCount]=useState(0)
  const [pushCount,setPushCount]=useState(0)
  const [notes,setNotes]=useState('')
  const [tab,setTab]=useState<'answer'|'evidence'|'notes'>('answer')
  const [startedAt,setStartedAt]=useState(0)
  const [elapsed,setElapsed]=useState('00:00')
  const [debrief,setDebrief]=useState<Debrief|null>(null)
  const [completed,setCompleted]=useState(0)
  const [showReview,setShowReview]=useState(false)
  const headingRef=useRef<HTMLHeadingElement>(null)

  const persona=personas.find(p=>p.id===personaId)!
  const filtered=useMemo(()=>{
    const matches=filterQuestions(questions,setting,role,selectedThemes,selectedStreams)
    return method==='build'?matches.filter(q=>q.answerBuilder):matches
  },[setting,role,selectedThemes,selectedStreams,method])
  const current=questions.find(q=>q.id===currentId)
  const writingPrompts=useMemo(()=>typedAnswerPrompts(answer),[answer])
  const target=mode==='mock'?Math.min(6,Math.max(4,selectedThemes.length*2)):1

  useEffect(()=>{ headingRef.current?.focus() },[screen])
  useEffect(()=>{
    if(screen!=='session') return
    const tick=()=>{ const seconds=Math.floor((Date.now()-startedAt)/1000); setElapsed(`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`) }
    tick(); const timer=window.setInterval(tick,1000); return()=>clearInterval(timer)
  },[screen,startedAt])

  const resetQuestion=(id:string)=>{
    setCurrentId(id); setAnswer(''); setSelected({}); setEvidence([]); setReview({}); setFollowUp(''); setFollowCount(0); setPushCount(0); setShowReview(false); setTab('answer')
  }
  const start=()=>{
    const q=nextQuestion(filtered,[],selectedThemes.join('').length)
    if(!q) return
    setUsed([q.id]); setCompleted(0); setNotes(''); setStartedAt(Date.now()); resetQuestion(q.id); setScreen('session')
  }
  const completeAnswer=()=>{
    if(method==='type' && !showReview){ setShowReview(true); return }
    const result=method==='type'?feedbackFromReview(review,answer,evidence.length):feedbackFromBuild(selected,evidence.length)
    const allowed=mode==='quick'?1:2
    if(followCount<allowed && current){
      const next=getFollowUp(current,personaId,followCount)
      if(next){ setFollowUp(next); setFollowCount(c=>c+1); return }
    }
    const done=completed+1
    if(mode==='mock' && done<target){
      const q=nextQuestion(filtered,used,done)
      if(q){ setUsed(v=>[...v,q.id]); setCompleted(done); resetQuestion(q.id); return }
    }
    setDebrief(result); setCompleted(done); setScreen('debrief')
  }
  const skip=()=>{
    const q=nextQuestion(filtered,used,used.length+3)
    if(q){ setUsed(v=>[...v,q.id]); resetQuestion(q.id) }
  }
  const toggleEvidence=(item:string)=>setEvidence(v=>v.includes(item)?v.filter(x=>x!==item):v.length<3?[...v,item]:v)
  const toggleTheme=(theme:string)=>setSelectedThemes(v=>v.includes(theme)?(v.length>1?v.filter(t=>t!==theme):v):[...v,theme])
  const toggleStream=(stream:ProvisionStream)=>setSelectedStreams(v=>v.includes(stream)?(v.length>1?v.filter(item=>item!==stream):v):[...v,stream])

  return <div className="app-shell">
    <header className="topbar"><span className="seal">EP</span><span>EVIDENCE CONTROL SYSTEM</span><span className="top-status"><i/> SYSTEM READY · v0.1.0</span></header>
    <main id="main">
      {screen==='title' && <section className="title-screen" aria-labelledby="title">
        <div className="title-copy">
          <p className="eyebrow">Professional rehearsal terminal // independent release</p>
          <h1 id="title" ref={headingRef} tabIndex={-1}>EVIDENCE,<br/><span>PLEASE</span></h1>
          <p className="tagline">HOW DO YOU KNOW?</p>
          <p className="intro">Practise challenging inspection-style conversations.<br/>Strengthen your answers. Stand up to scrutiny.</p>
          <button className="primary big" onClick={()=>setScreen('setup')}>Begin inspection <span>→</span></button>
        </div>
        <div className="title-art" aria-hidden="true">
          <div className="folders"><i>REPORTS</i><i>DATA</i><i>EVIDENCE</i></div>
          <div className="terminal"><b>READY</b><span>█</span></div>
          <div className="paper-stack">CLAIMS<br/>EVIDENCE<br/>IMPACT</div>
        </div>
        <div className="title-footer">
          <details><summary>How it works</summary><p>Choose your context and inspector. Answer one or more rehearsal prompts, use evidence thoughtfully, face follow-up questions, then reflect using a structured debrief.</p></details>
          <details><summary>Disclaimer</summary><p>Evidence, Please is an independent professional-development and rehearsal tool. It is not affiliated with, endorsed by or produced by Ofsted. Questions and feedback support reflection and do not predict inspection activity or represent official inspection judgements.</p></details>
        </div>
      </section>}

      {screen==='setup' && <section className="setup-screen" aria-labelledby="setup-heading">
        <div className="section-heading"><div><p className="eyebrow">Form EP-01 // session requisition</p><h1 id="setup-heading" ref={headingRef} tabIndex={-1}>Prepare your inspection</h1></div><button className="text-button" onClick={()=>setScreen('title')}>← Return</button></div>
        <fieldset className="setup-section"><legend><span>01</span> Choose your mode</legend><div className="mode-grid">
          {modes.map(m=><button key={m.id} className={`choice-card ${mode===m.id?'selected':''}`} onClick={()=>setMode(m.id)} aria-pressed={mode===m.id}><strong>{m.name}</strong><small>{m.time}</small><p>{m.description}</p></button>)}
        </div></fieldset>
        <fieldset className="setup-section"><legend><span>02</span> Choose your inspector</legend><div className="persona-grid">
          {personas.map(p=><button key={p.id} className={`persona-card ${personaId===p.id?'selected':''}`} onClick={()=>setPersonaId(p.id)} aria-pressed={personaId===p.id}>
            <Avatar id={p.id}/><span><strong>{p.name}</strong><small>{p.title}</small><em>{p.focus}</em></span>
          </button>)}
        </div></fieldset>
        <fieldset className="setup-section"><legend><span>03</span> File the particulars</legend><p className="framework-note"><strong>Framework edition:</strong> renewed FE and skills toolkit currently in use since 10 November 2025. The September 2026 revision is not yet applied.</p><div className="form-grid">
          <label>College type<select value={setting} onChange={e=>setSetting(e.target.value)}>{settings.map(x=><option key={x}>{x}</option>)}</select></label>
          <label>Your role<select value={role} onChange={e=>setRole(e.target.value)}>{roles.map(x=><option key={x}>{x}</option>)}</select></label>
          <label>Answer method<select value={method} onChange={e=>setMethod(e.target.value as AnswerMethod)}><option value="type">Type my answer</option><option value="build">Build my answer</option></select></label>
        </div>
        <span className="field-label">Provision streams — choose one or more</span><div className="chip-grid stream-grid">{provisionStreams.map(stream=><button key={stream} className={selectedStreams.includes(stream)?'chip selected':'chip'} aria-pressed={selectedStreams.includes(stream)} onClick={()=>toggleStream(stream)}>{stream}</button>)}</div>
        <span className="field-label">Themes — choose one or more</span><div className="chip-grid">{themes.map(t=><button key={t} className={selectedThemes.includes(t)?'chip selected':'chip'} aria-pressed={selectedThemes.includes(t)} onClick={()=>toggleTheme(t)}>{t}</button>)}</div>
        </fieldset>
        <div className="setup-submit"><div><span className="status-dot"/> {filtered.length} suitable rehearsal prompts located</div><button className="primary big" onClick={start} disabled={!filtered.length}>Start session →</button></div>
      </section>}

      {screen==='session' && current && <section className="session-screen" aria-labelledby="session-heading">
        <div className="session-status">
          <span>Inspection in progress</span><span>{mode==='mock'?`Question ${completed+1} of ${target}`:'Question 1 of 1'}</span><span aria-label={`Elapsed time ${elapsed}`}>◷ {elapsed}</span>
        </div>
        <div className="inspector-strip"><Avatar id={personaId} large/><div><small>{persona.title} · toolkit area: {current.frameworkArea}</small><h1 id="session-heading" ref={headingRef} tabIndex={-1}>{persona.name} asks:</h1><p>{current.question}</p></div></div>
        {followUp && <div className="follow-up" role="status"><strong>Reflective follow-up:</strong> {followUp}</div>}
        <div className="session-grid">
          <div className="work-area">
            <div className="tabs" role="tablist" aria-label="Session workspace">
              {(['answer','evidence','notes'] as const).map(x=><button key={x} role="tab" aria-selected={tab===x} onClick={()=>setTab(x)}>{x}{x==='evidence'&&evidence.length?` (${evidence.length})`:''}</button>)}
            </div>
            {tab==='answer' && <div className="paper-panel">
              <p className="context">{current.contextPrompt}</p>
              {method==='type' ? <>
                <label className="sr-only" htmlFor="answer">Your answer</label><textarea id="answer" rows={10} value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="Establish the position. Explain your evidence. Describe the impact…"/>
                <div className="counter">{answer.length} characters</div>
                {writingPrompts.length>0 && <div className="writing-prompts" aria-live="polite"><strong>Rehearsal prompts</strong><span>Pattern-based prompts only; your response has not been graded.</span><ul>{writingPrompts.map(prompt=><li key={prompt}>{prompt}</li>)}</ul></div>}
                {showReview && <fieldset className="self-review"><legend>Self-review before submission</legend>{reviewItems.map(([id,label])=><label key={id}><input type="checkbox" checked={!!review[id]} onChange={e=>setReview(v=>({...v,[id]:e.target.checked}))}/>{label}</label>)}</fieldset>}
              </> : <div className="builder">
                {sections.map(section=><div className="builder-section" key={section.id}><h2>{section.label}</h2><div className="option-list">
                  {shuffleOptions(current.answerBuilder?.[section.id]??[],`${current.id}-${section.id}-${startedAt}`).map(o=><button key={o.id} className={selected[section.id]?.id===o.id?'answer-option selected':'answer-option'} onClick={()=>setSelected(v=>({...v,[section.id]:o}))} aria-pressed={selected[section.id]?.id===o.id}>{o.text}</button>)}
                  {!current.answerBuilder?.[section.id] && <p className="unavailable">No prepared components for this prompt. Choose another question or use Type My Answer.</p>}
                </div></div>)}
              </div>}
            </div>}
            {tab==='evidence' && <div className="paper-panel evidence-panel"><div className="library-heading"><div><h2>Evidence library</h2><p>Select up to three sources. Naming a document is not the same as explaining what it demonstrates.</p></div><span>{evidence.length}/3 filed</span></div><div className="document-grid">
              {evidenceTypes.map((item,i)=><button key={item} className={evidence.includes(item)?'document selected':'document'} disabled={!evidence.includes(item)&&evidence.length>=3} onClick={()=>toggleEvidence(item)} aria-pressed={evidence.includes(item)}><i>EP-{String(i+1).padStart(2,'0')}</i><strong>{item}</strong><small>{current.usefulEvidence.includes(item)?'Suggested for this prompt':'Available reference'}</small></button>)}
            </div></div>}
            {tab==='notes' && <div className="paper-panel"><label htmlFor="notes"><strong>Session notes</strong><span className="hint">Private working notes for this browser session.</span></label><textarea id="notes" rows={14} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Record a figure to check, a weakness to revisit, or a better way to frame the answer…"/></div>}
            <div className="action-row"><button className="secondary" onClick={skip}>Request another question</button><button className="primary" onClick={completeAnswer} disabled={method==='type'?!answer.trim():(Object.keys(selected).length<3)}>{method==='type'&&!showReview?'Review answer':followUp?'Respond & continue':'Submit answer'} →</button></div>
          </div>
          <aside className="challenge-panel"><span className="eyebrow">Challenge desk</span><Avatar id={personaId}/><h2>{persona.name} is listening.</h2><p>{persona.challenge}</p><button className="push-button" disabled={!canPush(pushCount)} onClick={()=>{setFollowUp(persona.push);setPushCount(c=>c+1)}}>Push me <span>{pushCount}/2</span></button><small>{canPush(pushCount)?'Request a stronger challenge.':'Maximum challenge filed.'}</small>
            <div className="evidence-summary"><strong>Evidence attached</strong>{evidence.length?evidence.map(x=><span key={x}>▰ {x}</span>):<em>None. Claim submitted; proof pending.</em>}</div>
          </aside>
        </div>
      </section>}

      {screen==='debrief' && debrief && <section className="debrief-screen" aria-labelledby="debrief-heading">
        <div className="section-heading"><div><p className="eyebrow">Inspection debrief // reflective record</p><h1 id="debrief-heading" ref={headingRef} tabIndex={-1}>{persona.name}’s notes</h1></div><span className="stamp">{debrief.outcome}</span></div>
        <div className="debrief-grid">
          <div className="report paper-panel"><div className="report-intro"><Avatar id={personaId}/><p>{debrief.summary}</p></div>
            <h2>Strengths noted</h2><ul>{debrief.strengths.length?debrief.strengths.map(x=><li className="positive" key={x}>{x}</li>):<li>No clear strength was confirmed in the self-review. This is useful information, not a verdict.</li>}</ul>
            <h2>Missed opportunities</h2><ul>{debrief.opportunities.length?debrief.opportunities.map(x=><li key={x}>{x}</li>):<li>Try adding one counter-example or remaining uncertainty.</li>}</ul>
            <div className="persona-note"><strong>{persona.name} remains focused on {persona.focus.toLowerCase()}.</strong><p>Next time, answer the question in one sentence before adding supporting detail.</p></div>
          </div>
          <div className="ratings paper-panel"><h2>Reflective indicators</h2><p>Descriptive coaching signals, not scientific scores or inspection judgements.</p>{Object.entries(debrief.ratings).map(([name,value])=><div className="rating" key={name}><span>{name}</span><div aria-label={`${name}: ${value} of 5`}>{[1,2,3,4,5].map(n=><i key={n} className={n<=value?'filled':''}/>)}</div><b>{value>=4?'Clear':value>=3?'Developing':'Revisit'}</b></div>)}</div>
        </div>
        <div className="debrief-actions"><button className="secondary" onClick={()=>setScreen('setup')}>Change settings</button><button className="secondary" onClick={()=>{setPersonaId(personas[(personas.findIndex(p=>p.id===personaId)+1)%personas.length].id);setScreen('setup')}}>Choose another inspector</button><button className="primary" onClick={start}>Try again →</button></div>
        <p className="disclaimer">Independent professional-development tool. Not affiliated with, endorsed by or produced by Ofsted. Feedback supports reflection and is not an official judgement.</p>
      </section>}
    </main>
  </div>
}
export default App
