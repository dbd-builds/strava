import { useState, useEffect } from "react";

(() => {
  if (document.getElementById("dash-fonts")) return;
  const l = document.createElement("link");
  l.id = "dash-fonts"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap";
  document.head.appendChild(l);
})();

(() => {
  if (document.getElementById("dash-style")) return;
  const s = document.createElement("style");
  s.id = "dash-style";
  s.textContent = `
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#080C18}
    ::-webkit-scrollbar{width:4px}
    ::-webkit-scrollbar-thumb{background:#1e2640;border-radius:2px}
    @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes glow{0%,100%{opacity:1}50%{opacity:.4}}
    .pcard{animation:fadeUp .4s ease both}
    .pcard:nth-child(1){animation-delay:.05s}.pcard:nth-child(2){animation-delay:.1s}
    .pcard:nth-child(3){animation-delay:.15s}.pcard:nth-child(4){animation-delay:.2s}
    .pcard:nth-child(5){animation-delay:.25s}
    .pbfill{transition:width 1s cubic-bezier(.4,0,.2,1)}
    .mrow:hover{background:rgba(255,255,255,.03)}
    .tab-btn:hover{background:rgba(255,255,255,.09)!important}
    .edit-btn:hover{background:rgba(255,255,255,.12)!important}
    .modal-overlay{animation:fadeUp .2s ease}
    .del-btn{opacity:0;transition:opacity .15s}
    .m-edit-row:hover .del-btn{opacity:1}
    .add-ms-btn:hover{background:rgba(255,255,255,.09)!important;border-color:rgba(255,255,255,.18)!important}
    .abp-card:hover .abp-del{opacity:1!important}
    .abp-card{animation:fadeUp .3s ease both}
    .drag-handle{cursor:grab;opacity:.35;transition:opacity .15s}
    .drag-handle:hover{opacity:.8}
    textarea,input,select{font-family:'DM Sans',sans-serif}
    select option{background:#1a2035}
    .spinner{display:inline-block;animation:glow 1s ease infinite}
    .icon-btn:hover{background:rgba(255,255,255,.1)!important}
    .resolve-btn:hover{opacity:1!important}
  `;
  document.head.appendChild(s);
})();

const INIT_PRIORITIES = [
  { id:1,num:"01",color:"#FC4C02",label:"Manager Competency",title:"Materially improve perception of manager competency, capability & ability to lead",status:"on-track",progress:0,metric:{label:"Perception Score",current:0,target:80,unit:"%"},milestones:[{id:"1a",text:"Baseline manager perception survey",done:false,q:"Q1"},{id:"1b",text:"Launch Manager Development Program",done:false,q:"Q2"},{id:"1c",text:"Mid-year perception pulse check",done:false,q:"Q3"},{id:"1d",text:"Year-end survey + impact analysis",done:false,q:"Q4"}],notes:"" },
  { id:2,num:"02",color:"#F59E0B",label:"Programs Created",title:"Volume of programs, tools & initiatives created and shipped",status:"on-track",progress:0,metric:{label:"Programs Shipped",current:0,target:10,unit:""},milestones:[{id:"2a",text:"Q1 program slate defined & launched",done:false,q:"Q1"},{id:"2b",text:"Q2 programs shipped",done:false,q:"Q2"},{id:"2c",text:"Q3 programs shipped",done:false,q:"Q3"},{id:"2d",text:"Q4 programs + complete catalog",done:false,q:"Q4"}],notes:"" },
  { id:3,num:"03",color:"#10B981",label:"Participant Enjoyment",title:"Average 4/5 participant enjoyment rating across all programs",status:"on-track",progress:0,metric:{label:"Avg Rating",current:0,target:4,unit:"/5"},milestones:[{id:"3a",text:"Establish feedback system across all programs",done:false,q:"Q1"},{id:"3b",text:"Q2 ratings review + program adjustments",done:false,q:"Q2"},{id:"3c",text:"Q3 refinements based on participant data",done:false,q:"Q3"},{id:"3d",text:"Year-end rating summary + report",done:false,q:"Q4"}],notes:"" },
  { id:4,num:"04",color:"#8B5CF6",label:"Accountability Framework",title:"Build behavioral accountability model using ReCulturing by Melissa Daimler",status:"on-track",progress:0,metric:{label:"Framework Completion",current:0,target:100,unit:"%"},milestones:[{id:"4a",text:"Synthesize ReCulturing + apply to Strava context",done:false,q:"Q1"},{id:"4b",text:"Co-design accountability model with Maurice",done:false,q:"Q2"},{id:"4c",text:"Pilot framework with select teams",done:false,q:"Q3"},{id:"4d",text:"Full rollout + adoption measurement",done:false,q:"Q4"}],notes:"" },
  { id:5,num:"05",color:"#06B6D4",label:"Global Events",title:"Own Global Events end-to-end \u2014 take this fully off Maurice's plate",status:"on-track",progress:0,metric:{label:"Events Delivered",current:0,target:4,unit:""},milestones:[{id:"5a",text:"Transfer global events ownership from Maurice",done:false,q:"Q1"},{id:"5b",text:"Plan & deliver Q2 global event",done:false,q:"Q2"},{id:"5c",text:"Plan & deliver Q3 global event",done:false,q:"Q3"},{id:"5d",text:"Q4 event + year-end retrospective",done:false,q:"Q4"}],notes:"" },
];

const INIT_11 = { wins:[], blocks:[], weekPriorities:[] };

const STATUS_CFG = {
  "on-track":{label:"On Track",color:"#10B981",bg:"rgba(16,185,129,.14)"},
  "at-risk":{label:"At Risk",color:"#F59E0B",bg:"rgba(245,158,11,.14)"},
  "behind":{label:"Behind",color:"#EF4444",bg:"rgba(239,68,68,.14)"},
  "complete":{label:"Complete",color:"#FC4C02",bg:"rgba(252,76,2,.14)"},
};

const ABP = {
  A:{ label:"Accomplished", color:"#C0444F", bg:"rgba(192,68,79,.13)", light:"rgba(192,68,79,.07)", letter:"A" },
  B:{ label:"Blocks",       color:"#B5943C", bg:"rgba(181,148,60,.13)", light:"rgba(181,148,60,.07)", letter:"B" },
  P:{ label:"Priorities",   color:"#6B9E3F", bg:"rgba(107,158,63,.13)", light:"rgba(107,158,63,.07)", letter:"P" },
};

const QS = ["Q1","Q2","Q3","Q4"];
const recalc = ms => ms.length===0?0:Math.round((ms.filter(m=>m.done).length/ms.length)*100);
const genId  = () => `i${Date.now()}${Math.random().toString(36).slice(2,5)}`;
const todayStr = () => new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
const weekStr  = () => {
  const d=new Date(); const day=d.getDay(); const diff=d.getDate()-day+(day===0?-6:1);
  const mon=new Date(d.setDate(diff));
  return mon.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
};

const lbl = { display:"block",fontSize:11,color:"rgba(255,255,255,.4)",marginBottom:7,fontWeight:700,textTransform:"uppercase",letterSpacing:".09em" };
const inp  = { background:"#1a2035",border:"1px solid rgba(255,255,255,.1)",color:"white",padding:"9px 13px",borderRadius:8,fontSize:13.5,outline:"none",width:"100%" };

function StatusBadge({status}){
  const c=STATUS_CFG[status];
  return <span style={{fontSize:11,fontWeight:700,letterSpacing:".07em",textTransform:"uppercase",padding:"3px 9px",borderRadius:20,color:c.color,background:c.bg}}>{c.label}</span>;
}
function ProgressBar({progress,color}){
  return <div style={{height:4,background:"rgba(255,255,255,.08)",borderRadius:2,overflow:"hidden",position:"relative"}}><div className="pbfill" style={{position:"absolute",top:0,left:0,height:"100%",width:`${progress}%`,background:color,borderRadius:2}}/></div>;
}
function MetricGauge({metric,color}){
  const pct=Math.min(metric.target>0?(metric.current/metric.target)*100:0,100);
  const r=18,circ=2*Math.PI*r,dash=circ*(pct/100);
  return (
    <div style={{display:"flex",alignItems:"center",gap:14}}>
      <div style={{position:"relative",width:52,height:52,flexShrink:0}}>
        <svg width="52" height="52" style={{transform:"rotate(-90deg)"}}>
          <circle cx="26" cy="26" r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="4"/>
          <circle cx="26" cy="26" r={r} fill="none" stroke={color} strokeWidth="4" strokeDasharray={`${dash} ${circ-dash}`} strokeLinecap="round" style={{transition:"stroke-dasharray 1s cubic-bezier(.4,0,.2,1)"}}/>
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color}}>{Math.round(pct)}%</div>
      </div>
      <div>
        <div style={{fontSize:22,fontWeight:700,color:"white",fontFamily:"'Fraunces',serif",lineHeight:1}}>{metric.current}{metric.unit}</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,.38)",marginTop:3}}>{metric.label} \u00b7 target {metric.target}{metric.unit}</div>
      </div>
    </div>
  );
}

function PriorityCard({p,onToggle,onEdit}){
  const [expanded,setExpanded]=useState(false);
  const done=p.milestones.filter(m=>m.done).length, total=p.milestones.length;
  return (
    <div className="pcard" style={{background:"linear-gradient(145deg,#111827,#0d1224)",borderRadius:16,border:"1px solid rgba(255,255,255,.07)",overflow:"hidden",boxShadow:expanded?`0 0 0 1px ${p.color}35,0 8px 32px rgba(0,0,0,.4)`:"0 2px 12px rgba(0,0,0,.3)",transition:"box-shadow .25s"}}>
      <div style={{height:3,background:p.color}}/>
      <div style={{padding:"20px 22px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,borderRadius:9,background:`${p.color}1a`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:p.color,fontFamily:"'Fraunces',serif",flexShrink:0}}>{p.num}</div>
            <div style={{fontSize:11,color:p.color,fontWeight:700,letterSpacing:".09em",textTransform:"uppercase"}}>{p.label}</div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <StatusBadge status={p.status}/>
            <button className="edit-btn" onClick={()=>onEdit(p)} style={{background:"rgba(255,255,255,.07)",border:"none",color:"rgba(255,255,255,.5)",padding:"4px 11px",borderRadius:6,cursor:"pointer",fontSize:12,transition:"background .15s"}}>Edit</button>
          </div>
        </div>
        <p style={{fontSize:13.5,color:"rgba(255,255,255,.8)",lineHeight:1.55,marginBottom:18}}>{p.title}</p>
        <div style={{marginBottom:18}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
            <span style={{fontSize:11,color:"rgba(255,255,255,.35)"}}>Progress</span>
            <span style={{fontSize:12,color:p.color,fontWeight:700}}>{p.progress}% \u00b7 {done}/{total} milestones</span>
          </div>
          <ProgressBar progress={p.progress} color={p.color}/>
        </div>
        <MetricGauge metric={p.metric} color={p.color}/>
        <button onClick={()=>setExpanded(x=>!x)} style={{width:"100%",marginTop:16,padding:"8px 12px",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.07)",borderRadius:8,color:"rgba(255,255,255,.45)",cursor:"pointer",fontSize:12,display:"flex",justifyContent:"space-between",alignItems:"center",transition:"background .15s"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.08)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.04)"}>
          <span>Milestones ({done}/{total} done)</span>
          <span style={{transition:"transform .25s",transform:expanded?"rotate(180deg)":"none",fontSize:10}}>\u25bc</span>
        </button>
        {expanded&&(
          <div style={{marginTop:8,display:"flex",flexDirection:"column",gap:2}}>
            {p.milestones.length===0&&<p style={{fontSize:12,color:"rgba(255,255,255,.28)",padding:"10px 6px",textAlign:"center"}}>No milestones \u2014 click Edit to add some.</p>}
            {p.milestones.map(m=>(
              <div key={m.id} className="mrow" onClick={()=>onToggle(p.id,m.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 6px",borderRadius:7,cursor:"pointer",transition:"background .15s"}}>
                <div style={{width:16,height:16,borderRadius:4,flexShrink:0,border:m.done?"none":"1.5px solid rgba(255,255,255,.2)",background:m.done?p.color:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s",fontSize:9,color:"white"}}>{m.done&&"\u2713"}</div>
                <span style={{fontSize:13,color:m.done?"rgba(255,255,255,.3)":"rgba(255,255,255,.75)",textDecoration:m.done?"line-through":"none",flex:1,transition:"all .2s"}}>{m.text}</span>
                <span style={{fontSize:10,color:p.color,fontWeight:700,background:`${p.color}18`,padding:"2px 7px",borderRadius:4}}>{m.q}</span>
              </div>
            ))}
            {p.notes&&<div style={{marginTop:6,padding:"10px 12px",background:"rgba(255,255,255,.04)",borderRadius:8,borderLeft:`2px solid ${p.color}`,fontSize:12.5,color:"rgba(255,255,255,.55)",lineHeight:1.55}}>{p.notes}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

function EditModal({p,onSave,onClose}){
  const [status,setStatus]=useState(p.status);
  const [metricCurrent,setMetricCurrent]=useState(p.metric.current);
  const [notes,setNotes]=useState(p.notes);
  const [milestones,setMilestones]=useState(p.milestones.map(m=>({...m})));
  const [editingId,setEditingId]=useState(null);
  const [newText,setNewText]=useState("");
  const [newQ,setNewQ]=useState("Q1");
  const progress=recalc(milestones);
  const toggleDone=id=>setMilestones(ms=>ms.map(m=>m.id===id?{...m,done:!m.done}:m));
  const updateText=(id,text)=>setMilestones(ms=>ms.map(m=>m.id===id?{...m,text}:m));
  const updateQ=(id,q)=>setMilestones(ms=>ms.map(m=>m.id===id?{...m,q}:m));
  const deleteMilestone=id=>setMilestones(ms=>ms.filter(m=>m.id!==id));
  const addMilestone=()=>{ const t=newText.trim(); if(!t)return; setMilestones(ms=>[...ms,{id:genId(),text:t,done:false,q:newQ}]); setNewText(""); };
  const save=()=>{ onSave(p.id,{status,progress,metric:{...p.metric,current:Number(metricCurrent)},notes,milestones}); onClose(); };
  return (
    <div className="modal-overlay" style={{position:"fixed",inset:0,background:"rgba(0,0,0,.78)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:"#111827",borderRadius:20,border:"1px solid rgba(255,255,255,.1)",width:"100%",maxWidth:540,maxHeight:"90vh",overflowY:"auto",padding:30,boxShadow:"0 24px 72px rgba(0,0,0,.65)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
          <div><div style={{fontSize:11,color:p.color,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",marginBottom:5}}>Editing Priority {p.num}</div><h3 style={{fontSize:17,color:"white",fontFamily:"'Fraunces',serif",fontWeight:600,lineHeight:1.3}}>{p.label}</h3></div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.08)",border:"none",color:"rgba(255,255,255,.7)",width:32,height:32,borderRadius:8,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>\u00d7</button>
        </div>
        <div style={{marginBottom:18}}><label style={lbl}>Status</label><select value={status} onChange={e=>setStatus(e.target.value)} style={{...inp}}>{Object.entries(STATUS_CFG).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select></div>
        <div style={{marginBottom:18}}><label style={lbl}>{p.metric.label} \u00b7 Target: {p.metric.target}{p.metric.unit}</label><input type="number" step="0.1" value={metricCurrent} onChange={e=>setMetricCurrent(e.target.value)} style={{...inp}}/></div>
        <div style={{marginBottom:22,padding:"12px 14px",background:"rgba(255,255,255,.04)",borderRadius:10,border:"1px solid rgba(255,255,255,.07)"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:12,color:"rgba(255,255,255,.4)"}}>Progress \u00b7 auto-calculated from milestones</span><span style={{fontSize:13,fontWeight:700,color:p.color}}>{progress}%</span></div>
          <ProgressBar progress={progress} color={p.color}/>
          <div style={{fontSize:11,color:"rgba(255,255,255,.28)",marginTop:7}}>{milestones.filter(m=>m.done).length} of {milestones.length} complete</div>
        </div>
        <div style={{marginBottom:6}}><label style={lbl}>Milestones</label>
          {milestones.length===0&&<div style={{padding:"14px",textAlign:"center",color:"rgba(255,255,255,.25)",fontSize:13,borderRadius:8,border:"1px dashed rgba(255,255,255,.1)",marginBottom:10}}>No milestones yet</div>}
          <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:10}}>
            {milestones.map(m=>(
              <div key={m.id} className="m-edit-row" style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:"#1a2035",borderRadius:9,border:"1px solid rgba(255,255,255,.07)"}}>
                <div onClick={()=>toggleDone(m.id)} style={{width:17,height:17,borderRadius:4,flexShrink:0,border:m.done?"none":"1.5px solid rgba(255,255,255,.2)",background:m.done?p.color:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"white",cursor:"pointer",transition:"all .2s"}}>{m.done&&"\u2713"}</div>
                {editingId===m.id
                  ? <input autoFocus value={m.text} onChange={e=>updateText(m.id,e.target.value)} onBlur={()=>setEditingId(null)} onKeyDown={e=>{if(e.key==="Enter"||e.key==="Escape")setEditingId(null);}} style={{flex:1,background:"transparent",border:"none",color:"white",fontSize:13,outline:"none",padding:0}}/>
                  : <span onClick={()=>setEditingId(m.id)} title="Click to rename" style={{flex:1,fontSize:13,color:m.done?"rgba(255,255,255,.3)":"rgba(255,255,255,.8)",textDecoration:m.done?"line-through":"none",cursor:"text",lineHeight:1.4}}>{m.text||<em style={{color:"rgba(255,255,255,.25)"}}>click to add text</em>}</span>}
                <select value={m.q} onChange={e=>updateQ(m.id,e.target.value)} style={{background:"transparent",border:"1px solid rgba(255,255,255,.1)",color:p.color,fontSize:11,fontWeight:700,borderRadius:5,padding:"2px 4px",cursor:"pointer",outline:"none",flexShrink:0}}>{QS.map(q=><option key={q} value={q}>{q}</option>)}</select>
                <button className="del-btn" onClick={()=>deleteMilestone(m.id)} style={{background:"rgba(239,68,68,.15)",border:"none",color:"#EF4444",width:24,height:24,borderRadius:5,cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>\u00d7</button>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:7,alignItems:"center"}}>
            <input value={newText} onChange={e=>setNewText(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();addMilestone();}}} placeholder="New milestone \u2014 Enter to add..." style={{...inp,border:"1px dashed rgba(255,255,255,.15)",flex:1}}/>
            <select value={newQ} onChange={e=>setNewQ(e.target.value)} style={{background:"#1a2035",border:"1px solid rgba(255,255,255,.1)",color:"rgba(255,255,255,.7)",fontSize:12,fontWeight:700,borderRadius:9,padding:"9px 8px",cursor:"pointer",outline:"none",flexShrink:0}}>{QS.map(q=><option key={q} value={q}>{q}</option>)}</select>
            <button className="add-ms-btn" onClick={addMilestone} style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",color:"rgba(255,255,255,.7)",padding:"9px 14px",borderRadius:9,cursor:"pointer",fontSize:13,fontWeight:600,flexShrink:0,transition:"all .15s"}}>+ Add</button>
          </div>
          <p style={{fontSize:11,color:"rgba(255,255,255,.22)",marginTop:7,paddingLeft:2}}>Click text to rename \u00b7 dropdown to reassign quarter \u00b7 hover for \u00d7</p>
        </div>
        <div style={{marginBottom:24,marginTop:18}}><label style={lbl}>Notes & Context</label><textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Key wins, blockers, context..." rows={3} style={{...inp,lineHeight:1.6,resize:"vertical"}}/></div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onClose} style={{flex:1,padding:"12px",background:"rgba(255,255,255,.07)",border:"none",color:"rgba(255,255,255,.5)",borderRadius:10,cursor:"pointer",fontSize:14}}>Cancel</button>
          <button onClick={save} style={{flex:2,padding:"12px",background:p.color,border:"none",color:"white",borderRadius:10,cursor:"pointer",fontSize:14,fontWeight:700}}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function TimelineView({priorities}){
  return (
    <div style={{overflowX:"auto"}}><div style={{minWidth:660}}>
      <div style={{display:"grid",gridTemplateColumns:"170px repeat(4,1fr)",marginBottom:12}}>
        <div/>
        {QS.map(q=><div key={q} style={{textAlign:"center",fontSize:11,fontWeight:700,color:"rgba(255,255,255,.35)",letterSpacing:".12em",textTransform:"uppercase",paddingBottom:14,borderBottom:"1px solid rgba(255,255,255,.08)"}}>{q} 2026</div>)}
      </div>
      {priorities.map(p=>(
        <div key={p.id} style={{display:"grid",gridTemplateColumns:"170px repeat(4,1fr)",marginBottom:6}}>
          <div style={{display:"flex",alignItems:"flex-start",paddingTop:8,paddingRight:16}}>
            <div style={{width:3,minHeight:32,background:p.color,borderRadius:2,marginRight:10,flexShrink:0,alignSelf:"stretch"}}/>
            <span style={{fontSize:12,color:"rgba(255,255,255,.65)",lineHeight:1.35,fontWeight:500,paddingTop:2}}>{p.label}</span>
          </div>
          {QS.map(q=>{
            const ms=p.milestones.filter(m=>m.q===q);
            return <div key={q} style={{padding:"6px 6px",borderLeft:"1px solid rgba(255,255,255,.05)",minHeight:40}}>
              {ms.map(m=>(
                <div key={m.id} style={{padding:"7px 10px",borderRadius:7,marginBottom:4,background:m.done?`${p.color}22`:"rgba(255,255,255,.04)",border:`1px solid ${m.done?p.color+"45":"rgba(255,255,255,.07)"}`,fontSize:11.5,color:m.done?"rgba(255,255,255,.8)":"rgba(255,255,255,.43)",lineHeight:1.45,display:"flex",alignItems:"flex-start",gap:6}}>
                  <span style={{color:m.done?p.color:"rgba(255,255,255,.2)",flexShrink:0,fontSize:10,marginTop:1}}>{m.done?"\u2713":"\u25cb"}</span>
                  <span>{m.text}</span>
                </div>
              ))}
            </div>;
          })}
        </div>
      ))}
    </div></div>
  );
}

function UpdateView({priorities,narrative,generating,onGenerate}){
  const [copied,setCopied]=useState(false);
  const copy=()=>{navigator.clipboard.writeText(narrative);setCopied(true);setTimeout(()=>setCopied(false),2500);};
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
        <div><h2 style={{fontSize:22,color:"white",fontFamily:"'Fraunces',serif",fontWeight:600}}>Executive Update</h2><p style={{fontSize:13,color:"rgba(255,255,255,.38)",marginTop:5}}>AI-drafted for Maurice Wilkins + Michele Bousquet (CPO)</p></div>
        <button onClick={onGenerate} disabled={generating} style={{padding:"11px 24px",background:generating?"rgba(252,76,2,.35)":"#FC4C02",border:"none",color:"white",borderRadius:10,cursor:generating?"default":"pointer",fontSize:13.5,fontWeight:700,display:"flex",alignItems:"center",gap:9,transition:"all .2s"}}>
          {generating?<><span className="spinner">\u25cc</span> Generating...</>:"\u21bb Generate Update"}
        </button>
      </div>
      {!narrative&&!generating&&(
        <div style={{padding:"52px 32px",borderRadius:16,border:"1.5px dashed rgba(255,255,255,.1)",textAlign:"center"}}>
          <div style={{fontSize:28,marginBottom:14,color:"rgba(255,255,255,.15)"}}>\u25ce</div>
          <p style={{fontSize:15,color:"rgba(255,255,255,.35)"}}>Generate an AI-drafted executive status update</p>
          <p style={{fontSize:12.5,color:"rgba(255,255,255,.22)",marginTop:6}}>Pulls live from your progress, metrics & milestones across all 5 priorities</p>
        </div>
      )}
      {generating&&<div style={{padding:"52px 32px",borderRadius:16,border:"1px solid rgba(252,76,2,.18)",background:"rgba(252,76,2,.04)",textAlign:"center"}}><div style={{fontSize:22,color:"#FC4C02",marginBottom:12,animation:"glow 1.4s ease infinite"}}>\u25c8</div><p style={{color:"rgba(255,255,255,.5)",fontSize:14}}>Drafting your executive update...</p></div>}
      {narrative&&!generating&&(
        <div>
          <div style={{padding:"28px 32px",borderRadius:16,background:"#111827",border:"1px solid rgba(255,255,255,.08)",color:"rgba(255,255,255,.82)",lineHeight:1.85,fontSize:14.5,whiteSpace:"pre-line"}}>{narrative}</div>
          <div style={{marginTop:14,display:"flex",gap:10}}>
            <button onClick={copy} style={{padding:"10px 20px",background:copied?"rgba(16,185,129,.2)":"rgba(255,255,255,.07)",border:`1px solid ${copied?"rgba(16,185,129,.4)":"rgba(255,255,255,.1)"}`,color:copied?"#10B981":"rgba(255,255,255,.6)",borderRadius:8,cursor:"pointer",fontSize:13,transition:"all .2s"}}>{copied?"\u2713 Copied!":"Copy to Clipboard"}</button>
            <button onClick={onGenerate} style={{padding:"10px 20px",background:"rgba(252,76,2,.12)",border:"1px solid rgba(252,76,2,.25)",color:"#FC4C02",borderRadius:8,cursor:"pointer",fontSize:13}}>Regenerate</button>
          </div>
        </div>
      )}
    </div>
  );
}

function OneonOneView({data,setData,priorities}){
  const [winForm,setWinForm]=useState({text:"",priorityId:"",milestoneId:""});
  const [blockForm,setBlockForm]=useState({problem:"",solutions:["","",""],recommendation:"",priorityId:""});
  const [newPriText,setNewPriText]=useState("");
  const [showWinForm,setShowWinForm]=useState(false);
  const [showBlockForm,setShowBlockForm]=useState(false);

  const selectedP=priorities.find(p=>String(p.id)===String(winForm.priorityId));
  const addWin=()=>{
    if(!winForm.text.trim())return;
    setData(d=>({...d,wins:[{id:genId(),date:todayStr(),text:winForm.text.trim(),priorityId:winForm.priorityId,milestoneId:winForm.milestoneId},...d.wins]}));
    setWinForm({text:"",priorityId:"",milestoneId:""});setShowWinForm(false);
  };
  const deleteWin=id=>setData(d=>({...d,wins:d.wins.filter(w=>w.id!==id)}));

  const setSol=(i,v)=>setBlockForm(f=>({...f,solutions:f.solutions.map((s,j)=>j===i?v:s)}));
  const addBlock=()=>{
    if(!blockForm.problem.trim())return;
    setData(d=>({...d,blocks:[{id:genId(),date:todayStr(),...blockForm,resolved:false},...d.blocks]}));
    setBlockForm({problem:"",solutions:["","",""],recommendation:"",priorityId:""});setShowBlockForm(false);
  };
  const deleteBlock=id=>setData(d=>({...d,blocks:d.blocks.filter(b=>b.id!==id)}));
  const resolveBlock=id=>setData(d=>({...d,blocks:d.blocks.map(b=>b.id===id?{...b,resolved:!b.resolved}:b)}));

  const addWeekPri=()=>{
    const t=newPriText.trim(); if(!t)return;
    setData(d=>({...d,weekPriorities:[...d.weekPriorities,{id:genId(),text:t}]}));
    setNewPriText("");
  };
  const deleteWeekPri=id=>setData(d=>({...d,weekPriorities:d.weekPriorities.filter(p=>p.id!==id)}));
  const moveWeekPri=(id,dir)=>setData(d=>{
    const arr=[...d.weekPriorities]; const i=arr.findIndex(p=>p.id===id);
    const j=i+dir; if(j<0||j>=arr.length)return d;
    [arr[i],arr[j]]=[arr[j],arr[i]]; return {...d,weekPriorities:arr};
  });

  const getPriorityLabel=(pid)=>{ const p=priorities.find(p=>String(p.id)===String(pid)); return p?p.label:null; };
  const getPriorityColor=(pid)=>{ const p=priorities.find(p=>String(p.id)===String(pid)); return p?p.color:"#888"; };
  const getMilestoneLabel=(pid,mid)=>{ const p=priorities.find(p=>String(p.id)===String(pid)); if(!p)return null; const m=p.milestones.find(m=>m.id===mid); return m?m.text:null; };

  const sectionHdr=(cfg,count)=>(
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
      <div style={{width:36,height:36,borderRadius:10,background:cfg.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:700,color:cfg.color,fontFamily:"'Fraunces',serif",flexShrink:0}}>{cfg.letter}</div>
      <div>
        <div style={{fontSize:17,fontWeight:700,color:"white",fontFamily:"'Fraunces',serif"}}>{cfg.label}</div>
        {count>0&&<div style={{fontSize:11,color:"rgba(255,255,255,.35)",marginTop:1}}>{count} item{count!==1?"s":""}</div>}
      </div>
    </div>
  );

  return (
    <div style={{display:"flex",flexDirection:"column",gap:24}}>
      <div style={{background:"linear-gradient(145deg,#111827,#0d1224)",borderRadius:16,border:"1px solid rgba(255,255,255,.07)",overflow:"hidden"}}>
        <div style={{height:3,background:ABP.A.color}}/>
        <div style={{padding:"22px 26px"}}>
          {sectionHdr(ABP.A,data.wins.length)}
          <p style={{fontSize:13,color:"rgba(255,255,255,.4)",marginBottom:16,lineHeight:1.5}}>Capture wins since your last check-in. Don't assume Maurice knows \u2014 make every impact visible.</p>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:14}}>
            {data.wins.map(w=>{
              const pColor=getPriorityColor(w.priorityId);
              const pLabel=getPriorityLabel(w.priorityId);
              const mLabel=getMilestoneLabel(w.priorityId,w.milestoneId);
              return (
                <div key={w.id} className="abp-card" style={{padding:"14px 16px",background:ABP.A.light,borderRadius:10,border:`1px solid ${ABP.A.color}30`,position:"relative"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
                    <div style={{flex:1}}>
                      <p style={{fontSize:14,color:"rgba(255,255,255,.88)",lineHeight:1.55,marginBottom:8}}>{w.text}</p>
                      <div style={{display:"flex",flexWrap:"wrap",gap:6,alignItems:"center"}}>
                        <span style={{fontSize:10,color:"rgba(255,255,255,.32)"}}>{w.date}</span>
                        {pLabel&&<span style={{fontSize:11,color:pColor,background:`${pColor}20`,padding:"2px 8px",borderRadius:20,fontWeight:600}}>{pLabel}</span>}
                        {mLabel&&<span style={{fontSize:11,color:"rgba(255,255,255,.45)",background:"rgba(255,255,255,.07)",padding:"2px 8px",borderRadius:20}}>\u21b3 {mLabel}</span>}
                      </div>
                    </div>
                    <button className="abp-del" onClick={()=>deleteWin(w.id)} style={{opacity:0,background:"rgba(239,68,68,.15)",border:"none",color:"#EF4444",width:26,height:26,borderRadius:6,cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"opacity .15s"}}>\u00d7</button>
                  </div>
                </div>
              );
            })}
          </div>
          {showWinForm?(
            <div style={{background:"rgba(255,255,255,.04)",borderRadius:12,border:"1px solid rgba(255,255,255,.09)",padding:"18px"}}>
              <div style={{marginBottom:14}}>
                <label style={lbl}>What did you accomplish?</label>
                <textarea value={winForm.text} onChange={e=>setWinForm(f=>({...f,text:e.target.value}))} placeholder="Describe the win and its impact..." rows={3} style={{...inp,lineHeight:1.6,resize:"vertical"}}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
                <div>
                  <label style={lbl}>Tied to Priority</label>
                  <select value={winForm.priorityId} onChange={e=>setWinForm(f=>({...f,priorityId:e.target.value,milestoneId:""}))} style={{...inp}}>
                    <option value="">\u2014 Select priority \u2014</option>
                    {priorities.map(p=><option key={p.id} value={p.id}>{p.num} \u00b7 {p.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Tied to Milestone</label>
                  <select value={winForm.milestoneId} onChange={e=>setWinForm(f=>({...f,milestoneId:e.target.value}))} style={{...inp}} disabled={!selectedP||selectedP.milestones.length===0}>
                    <option value="">\u2014 Optional \u2014</option>
                    {selectedP&&selectedP.milestones.map(m=><option key={m.id} value={m.id}>{m.q}: {m.text}</option>)}
                  </select>
                </div>
              </div>
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>{setShowWinForm(false);setWinForm({text:"",priorityId:"",milestoneId:""});}} style={{flex:1,padding:"10px",background:"rgba(255,255,255,.07)",border:"none",color:"rgba(255,255,255,.5)",borderRadius:8,cursor:"pointer",fontSize:13}}>Cancel</button>
                <button onClick={addWin} style={{flex:2,padding:"10px",background:ABP.A.color,border:"none",color:"white",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:700}}>Add Win</button>
              </div>
            </div>
          ):(
            <button onClick={()=>setShowWinForm(true)} style={{width:"100%",padding:"11px",background:"rgba(255,255,255,.04)",border:`1px dashed ${ABP.A.color}60`,borderRadius:10,color:ABP.A.color,cursor:"pointer",fontSize:13,fontWeight:600,transition:"all .2s"}} onMouseEnter={e=>e.currentTarget.style.background=ABP.A.light} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.04)"}>
              + Log a Win
            </button>
          )}
        </div>
      </div>

      <div style={{background:"linear-gradient(145deg,#111827,#0d1224)",borderRadius:16,border:"1px solid rgba(255,255,255,.07)",overflow:"hidden"}}>
        <div style={{height:3,background:ABP.B.color}}/>
        <div style={{padding:"22px 26px"}}>
          {sectionHdr(ABP.B,data.blocks.filter(b=>!b.resolved).length)}
          <p style={{fontSize:13,color:"rgba(255,255,255,.4)",marginBottom:16,lineHeight:1.5}}>Use the <strong style={{color:ABP.B.color,fontWeight:600}}>1\u20133\u20131 Rule</strong>: for every block, bring 1 problem, 3 possible solutions, and your 1 recommendation.</p>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:14}}>
            {data.blocks.map(b=>{
              const pLabel=getPriorityLabel(b.priorityId);
              const pColor=getPriorityColor(b.priorityId);
              return (
                <div key={b.id} className="abp-card" style={{padding:"16px",background:b.resolved?"rgba(255,255,255,.03)":ABP.B.light,borderRadius:10,border:`1px solid ${b.resolved?"rgba(255,255,255,.07)":ABP.B.color+"30"}`,opacity:b.resolved?.55:1,transition:"all .3s",position:"relative"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,marginBottom:b.resolved?0:12}}>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginBottom:6}}>
                        {b.resolved&&<span style={{fontSize:10,color:"#10B981",background:"rgba(16,185,129,.15)",padding:"1px 7px",borderRadius:20,fontWeight:700}}>Resolved</span>}
                        <span style={{fontSize:10,color:"rgba(255,255,255,.32)"}}>{b.date}</span>
                        {pLabel&&<span style={{fontSize:11,color:pColor,background:`${pColor}20`,padding:"2px 8px",borderRadius:20,fontWeight:600}}>{pLabel}</span>}
                      </div>
                      <p style={{fontSize:14,color:"rgba(255,255,255,.85)",fontWeight:600,lineHeight:1.45,marginBottom:b.resolved?0:10}}>{b.problem}</p>
                    </div>
                    <div style={{display:"flex",gap:6,flexShrink:0}}>
                      <button className="resolve-btn" onClick={()=>resolveBlock(b.id)} title={b.resolved?"Re-open":"Mark resolved"} style={{opacity:.4,background:b.resolved?"rgba(255,255,255,.08)":"rgba(16,185,129,.15)",border:"none",color:b.resolved?"rgba(255,255,255,.5)":"#10B981",padding:"4px 10px",borderRadius:6,cursor:"pointer",fontSize:11,fontWeight:600,transition:"opacity .15s"}}>{b.resolved?"Re-open":"Resolved"}</button>
                      <button className="abp-del" onClick={()=>deleteBlock(b.id)} style={{opacity:0,background:"rgba(239,68,68,.15)",border:"none",color:"#EF4444",width:26,height:26,borderRadius:6,cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",transition:"opacity .15s"}}>\u00d7</button>
                    </div>
                  </div>
                  {!b.resolved&&(
                    <div style={{display:"flex",flexDirection:"column",gap:6}}>
                      {b.solutions.filter(s=>s.trim()).map((s,i)=>(
                        <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                          <span style={{fontSize:10,fontWeight:700,color:ABP.B.color,background:ABP.B.bg,width:20,height:20,borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>{i+1}</span>
                          <span style={{fontSize:13,color:"rgba(255,255,255,.65)",lineHeight:1.45}}>{s}</span>
                        </div>
                      ))}
                      {b.recommendation&&(
                        <div style={{marginTop:4,padding:"9px 12px",background:`${ABP.B.color}18`,borderRadius:8,borderLeft:`2px solid ${ABP.B.color}`,fontSize:13,color:"rgba(255,255,255,.75)",lineHeight:1.45}}>
                          <span style={{fontSize:10,fontWeight:700,color:ABP.B.color,textTransform:"uppercase",letterSpacing:".08em"}}>My recommendation: </span>{b.recommendation}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {showBlockForm?(
            <div style={{background:"rgba(255,255,255,.04)",borderRadius:12,border:"1px solid rgba(255,255,255,.09)",padding:"18px"}}>
              <div style={{marginBottom:14}}>
                <label style={lbl}>The Problem (1)</label>
                <textarea value={blockForm.problem} onChange={e=>setBlockForm(f=>({...f,problem:e.target.value}))} placeholder="State the block clearly and concisely..." rows={2} style={{...inp,lineHeight:1.6,resize:"vertical"}}/>
              </div>
              <div style={{marginBottom:14}}>
                <label style={lbl}>Possible Solutions (3)</label>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {[0,1,2].map(i=>(
                    <div key={i} style={{display:"flex",gap:8,alignItems:"center"}}>
                      <span style={{fontSize:11,fontWeight:700,color:ABP.B.color,background:ABP.B.bg,width:22,height:22,borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{i+1}</span>
                      <input value={blockForm.solutions[i]} onChange={e=>setSol(i,e.target.value)} placeholder={`Solution ${i+1}...`} style={{...inp}}/>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:14}}>
                <label style={lbl}>Your Recommendation (1)</label>
                <textarea value={blockForm.recommendation} onChange={e=>setBlockForm(f=>({...f,recommendation:e.target.value}))} placeholder="Which solution do you recommend and why?" rows={2} style={{...inp,lineHeight:1.6,resize:"vertical"}}/>
              </div>
              <div style={{marginBottom:16}}>
                <label style={lbl}>Related Priority (optional)</label>
                <select value={blockForm.priorityId} onChange={e=>setBlockForm(f=>({...f,priorityId:e.target.value}))} style={{...inp}}>
                  <option value="">\u2014 Select priority \u2014</option>
                  {priorities.map(p=><option key={p.id} value={p.id}>{p.num} \u00b7 {p.label}</option>)}
                </select>
              </div>
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>{setShowBlockForm(false);setBlockForm({problem:"",solutions:["","",""],recommendation:"",priorityId:""});}} style={{flex:1,padding:"10px",background:"rgba(255,255,255,.07)",border:"none",color:"rgba(255,255,255,.5)",borderRadius:8,cursor:"pointer",fontSize:13}}>Cancel</button>
                <button onClick={addBlock} style={{flex:2,padding:"10px",background:ABP.B.color,border:"none",color:"white",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:700}}>Add Block</button>
              </div>
            </div>
          ):(
            <button onClick={()=>setShowBlockForm(true)} style={{width:"100%",padding:"11px",background:"rgba(255,255,255,.04)",border:`1px dashed ${ABP.B.color}60`,borderRadius:10,color:ABP.B.color,cursor:"pointer",fontSize:13,fontWeight:600,transition:"all .2s"}} onMouseEnter={e=>e.currentTarget.style.background=ABP.B.light} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.04)"}>
              + Add a Block (1\u20133\u20131)
            </button>
          )}
        </div>
      </div>

      <div style={{background:"linear-gradient(145deg,#111827,#0d1224)",borderRadius:16,border:"1px solid rgba(255,255,255,.07)",overflow:"hidden"}}>
        <div style={{height:3,background:ABP.P.color}}/>
        <div style={{padding:"22px 26px"}}>
          {sectionHdr(ABP.P,data.weekPriorities.length)}
          <p style={{fontSize:13,color:"rgba(255,255,255,.4)",marginBottom:16,lineHeight:1.5}}>Your prioritized workflow for the coming period. Share this list and ask Maurice to confirm or change it.</p>
          <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:14}}>
            {data.weekPriorities.map((p,i)=>(
              <div key={p.id} className="abp-card" style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",background:ABP.P.light,borderRadius:10,border:`1px solid ${ABP.P.color}30`}}>
                <span style={{fontSize:13,fontWeight:700,color:ABP.P.color,width:22,textAlign:"center",flexShrink:0,fontFamily:"'Fraunces',serif"}}>{i+1}</span>
                <span style={{flex:1,fontSize:14,color:"rgba(255,255,255,.85)",lineHeight:1.4}}>{p.text}</span>
                <div style={{display:"flex",gap:4,flexShrink:0}}>
                  <button onClick={()=>moveWeekPri(p.id,-1)} disabled={i===0} style={{background:"rgba(255,255,255,.06)",border:"none",color:i===0?"rgba(255,255,255,.15)":"rgba(255,255,255,.5)",width:24,height:24,borderRadius:5,cursor:i===0?"default":"pointer",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}}>\u25b2</button>
                  <button onClick={()=>moveWeekPri(p.id,1)} disabled={i===data.weekPriorities.length-1} style={{background:"rgba(255,255,255,.06)",border:"none",color:i===data.weekPriorities.length-1?"rgba(255,255,255,.15)":"rgba(255,255,255,.5)",width:24,height:24,borderRadius:5,cursor:i===data.weekPriorities.length-1?"default":"pointer",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}}>\u25bc</button>
                  <button className="abp-del" onClick={()=>deleteWeekPri(p.id)} style={{opacity:0,background:"rgba(239,68,68,.15)",border:"none",color:"#EF4444",width:24,height:24,borderRadius:5,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",transition:"opacity .15s"}}>\u00d7</button>
                </div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <input value={newPriText} onChange={e=>setNewPriText(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();addWeekPri();}}} placeholder="Add a priority item \u2014 Enter to add..." style={{...inp,flex:1,border:`1px dashed ${ABP.P.color}60`}}/>
            <button onClick={addWeekPri} style={{background:ABP.P.color,border:"none",color:"white",padding:"9px 18px",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:700,flexShrink:0}}>+ Add</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function downloadSummary(priorities, data){
  const getPL=(pid)=>{ const p=priorities.find(p=>String(p.id)===String(pid)); return p?`${p.num} \u00b7 ${p.label}`:null; };
  const getML=(pid,mid)=>{ const p=priorities.find(p=>String(p.id)===String(pid)); if(!p)return null; const m=p.milestones.find(m=>m.id===mid); return m?m.text:null; };
  const activeBlocks=data.blocks.filter(b=>!b.resolved);
  const lines=[
    `WEEKLY CHECK-IN PREP \u2014 ABP SUMMARY`,
    `David Brown-Dawson \u2192 Maurice Wilkins`,
    `Week of ${weekStr()}`,
    `${"─".repeat(52)}`,
    ``,
    `A \u2014 ACCOMPLISHED`,
    ``,
    data.wins.length===0?"  (No wins logged this week)"
      :data.wins.map((w,i)=>{
        const pl=getPL(w.priorityId); const ml=getML(w.priorityId,w.milestoneId);
        return [
          `  ${i+1}. ${w.text}`,
          pl?`     Priority: ${pl}`:"",
          ml?`     Milestone: ${ml}`:"",
          `     Date: ${w.date}`,
        ].filter(Boolean).join("\n");
      }).join("\n\n"),
    ``,
    `${"─".repeat(52)}`,
    ``,
    `B \u2014 BLOCKS  (1\u20133\u20131 Rule)`,
    ``,
    activeBlocks.length===0?"  (No active blocks)"
      :activeBlocks.map((b,i)=>{
        const pl=getPL(b.priorityId);
        return [
          `  Block ${i+1}: ${b.problem}`,
          pl?`  Related to: ${pl}`:"",
          ``,
          `  Solutions considered:`,
          ...b.solutions.map((s,j)=>s.trim()?`    ${j+1}. ${s}`:"").filter(Boolean),
          b.recommendation?`\n  \u2192 My recommendation: ${b.recommendation}`:"",
        ].filter(l=>l!==undefined).join("\n");
      }).join("\n\n"),
    ``,
    `${"─".repeat(52)}`,
    ``,
    `P \u2014 PRIORITIES  (my prioritized workflow \u2014 please confirm or adjust)`,
    ``,
    data.weekPriorities.length===0?"  (No priorities listed)"
      :data.weekPriorities.map((p,i)=>`  ${i+1}. ${p.text}`).join("\n"),
    ``,
    `${"─".repeat(52)}`,
    ``,
    `TOP 5 PROGRESS SNAPSHOT`,
    ``,
    ...priorities.map(p=>{
      const done=p.milestones.filter(m=>m.done).length;
      return `  ${p.num} ${p.label}\n      Status: ${STATUS_CFG[p.status].label} | Progress: ${p.progress}% | ${done}/${p.milestones.length} milestones | ${p.metric.label}: ${p.metric.current}${p.metric.unit}`;
    }),
    ``,
    `Generated ${todayStr()} via Maurice's Top 5 Dashboard`,
  ];
  const text=lines.join("\n");
  const blob=new Blob([text],{type:"text/plain"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url; a.download=`ABP_CheckIn_${new Date().toISOString().slice(0,10)}.txt`;
  document.body.appendChild(a); a.click();
  setTimeout(()=>{document.body.removeChild(a);URL.revokeObjectURL(url);},100);
}

export default function Dashboard(){
  const [priorities,setPriorities]=useState(INIT_PRIORITIES);
  const [oneOnOne,setOneOnOne]=useState(INIT_11);
  const [view,setView]=useState("overview");
  const [editTarget,setEditTarget]=useState(null);
  const [narrative,setNarrative]=useState("");
  const [generating,setGenerating]=useState(false);
  const [loaded,setLoaded]=useState(false);

  useEffect(()=>{
    try{ const r=localStorage.getItem("strava-p5-v5"); if(r)setPriorities(JSON.parse(r)); }catch{}
    try{ const r=localStorage.getItem("strava-11-v1"); if(r)setOneOnOne(JSON.parse(r)); }catch{}
    setLoaded(true);
  },[]);

  useEffect(()=>{ if(!loaded)return; try{localStorage.setItem("strava-p5-v5",JSON.stringify(priorities));}catch{} },[priorities,loaded]);
  useEffect(()=>{ if(!loaded)return; try{localStorage.setItem("strava-11-v1",JSON.stringify(oneOnOne));}catch{} },[oneOnOne,loaded]);

  const toggleMilestone=(pId,mId)=>{
    setPriorities(prev=>prev.map(p=>{ if(p.id!==pId)return p; const milestones=p.milestones.map(m=>m.id===mId?{...m,done:!m.done}:m); return {...p,milestones,progress:recalc(milestones)}; }));
  };
  const saveEdit=(id,changes)=>setPriorities(prev=>prev.map(p=>p.id===id?{...p,...changes}:p));

  const generateUpdate=async()=>{
    setGenerating(true);setView("update");setNarrative("");
    const summary=priorities.map(p=>{ const done=p.milestones.filter(m=>m.done).map(m=>m.text); const next=p.milestones.find(m=>!m.done); return `Priority ${p.num} \u2014 ${p.label}\nStatus: ${STATUS_CFG[p.status].label} | Progress: ${p.progress}%\n${p.metric.label}: ${p.metric.current}${p.metric.unit} (target: ${p.metric.target}${p.metric.unit})\nCompleted: ${done.length?done.join("; "):"None yet"}\nNext: ${next?`${next.text} (${next.q})`:"All complete"}\n${p.notes?`Notes: ${p.notes}`:""}`;}).join("\n\n");
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "x-api-key":import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version":"2023-06-01",
          "anthropic-dangerous-direct-browser-access":"true"
        },
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:`You are writing on behalf of David Brown-Dawson, Senior People Programs & Development Manager at Strava.\n\nGenerate a confident, concise executive status update to share with Maurice Wilkins (direct manager) and Michele Bousquet (Chief People Officer), covering progress on Maurice's Top 5 Priorities for 2026.\n\nPriority data:\n${summary}\n\nFormat:\n- One compelling opening sentence on overall momentum\n- A paragraph per priority (2-3 sentences): status, wins, what's next\n- One closing sentence signaling ownership and forward momentum\n\nTone: Direct, confident, energetic. Sound like a high-performer who owns outcomes. Active voice. Flowing paragraphs \u2014 no bullet points. ~280 words.`}]})
      });
      const d=await r.json(); setNarrative(d.content?.map(c=>c.text||"").join("")||"Unable to generate.");
    }catch{ setNarrative("Error generating update. Please try again."); }
    setGenerating(false);
  };

  const overallPct=Math.round(priorities.reduce((s,p)=>s+p.progress,0)/priorities.length);
  const onTrack=priorities.filter(p=>p.status==="on-track"||p.status==="complete").length;
  const totalM=priorities.reduce((s,p)=>s+p.milestones.length,0);
  const doneM=priorities.reduce((s,p)=>s+p.milestones.filter(m=>m.done).length,0);
  const activeBlocks=oneOnOne.blocks.filter(b=>!b.resolved).length;

  const TABS=[
    {id:"overview",label:"Overview"},
    {id:"timeline",label:"Q1\u2013Q4 Roadmap"},
    {id:"11",label:`\u2726 1:1 Prep${activeBlocks>0?` (${activeBlocks} blocks)`:""}`},
    {id:"update",label:"Generate Update"},
  ];

  return (
    <div style={{minHeight:"100vh",background:"#080C18",fontFamily:"'DM Sans',sans-serif",color:"white"}}>
      <div style={{background:"linear-gradient(180deg,#0e1428 0%,#080C18 100%)",borderBottom:"1px solid rgba(255,255,255,.07)",padding:"24px 32px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24,flexWrap:"wrap",gap:16}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <div style={{width:28,height:28,background:"#FC4C02",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"white",flexShrink:0}}>S</div>
              <span style={{fontSize:12,color:"rgba(255,255,255,.4)",letterSpacing:".08em",textTransform:"uppercase"}}>Strava \u00b7 People &amp; Development</span>
            </div>
            <h1 style={{fontSize:28,fontWeight:700,fontFamily:"'Fraunces',serif",letterSpacing:"-.02em"}}>David's Top 5 <span style={{color:"#FC4C02"}}>\u00b7 2026</span></h1>
            <p style={{fontSize:13,color:"rgba(255,255,255,.38)",marginTop:4}}>David Brown-Dawson \u00b7 Maurice Wilkins \u2192 Michele Bousquet, CPO</p>
          </div>
          <div style={{display:"flex",gap:28,alignItems:"flex-start",flexWrap:"wrap"}}>
            {[
              {label:"Overall Progress",value:`${overallPct}%`,color:"#FC4C02"},
              {label:"On Track",value:`${onTrack}/5`,color:"#10B981"},
              {label:"Milestones Done",value:`${doneM}/${totalM}`,color:"#8B5CF6"},
              {label:"Active Blocks",value:`${activeBlocks}`,color:activeBlocks>0?ABP.B.color:"rgba(255,255,255,.3)"},
            ].map(s=>(
              <div key={s.label} style={{textAlign:"right"}}>
                <div style={{fontSize:24,fontWeight:700,fontFamily:"'Fraunces',serif",lineHeight:1,color:s.color}}>{s.value}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,.32)",textTransform:"uppercase",letterSpacing:".08em",marginTop:2}}>{s.label}</div>
              </div>
            ))}
            <button onClick={()=>downloadSummary(priorities,oneOnOne)} title="Download weekly ABP summary" style={{background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.12)",color:"rgba(255,255,255,.6)",padding:"8px 16px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:7,transition:"all .2s",alignSelf:"center"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.12)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.07)"}>
              \u2193 Download ABP Summary
            </button>
          </div>
        </div>
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
          {TABS.map(t=>(
            <button key={t.id} className="tab-btn" onClick={()=>setView(t.id)} style={{padding:"9px 20px",borderRadius:"8px 8px 0 0",border:"none",cursor:"pointer",fontSize:13,fontWeight:500,transition:"all .2s",background:view===t.id?"#FC4C02":"rgba(255,255,255,.06)",color:view===t.id?"white":"rgba(255,255,255,.45)"}}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{padding:"28px 32px"}}>
        {view==="overview"&&(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:18}}>
            {priorities.map(p=><PriorityCard key={p.id} p={p} onToggle={toggleMilestone} onEdit={setEditTarget}/>)}
          </div>
        )}
        {view==="timeline"&&<TimelineView priorities={priorities}/>}
        {view==="11"&&<OneonOneView data={oneOnOne} setData={setOneOnOne} priorities={priorities}/>}
        {view==="update"&&<UpdateView priorities={priorities} narrative={narrative} generating={generating} onGenerate={generateUpdate}/>}
      </div>
      {editTarget&&<EditModal p={editTarget} onSave={saveEdit} onClose={()=>setEditTarget(null)}/>}
    </div>
  );
}
