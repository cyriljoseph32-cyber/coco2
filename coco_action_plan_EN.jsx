import { useState } from "react";

const C = {
  teal:"#1B6B6B",tealDeep:"#0B3535",coral:"#E8724A",
  sand:"#E8C97A",cream:"#FAF3E6",white:"#FFFFFF",
  charcoal:"#1A1A1A",muted:"#8A7B6A",green:"#22C55E",creamDark:"#F0E6D0",
};

const DAYS = [
  {
    id:"wed",day:"Wednesday",date:"June 3 · Today",color:C.coral,icon:"🚀",label:"DEPLOYMENT",
    objective:"Get the landing page live with a shareable URL",
    tasks:[
      {id:"w1",time:"2:00pm",duration:"30 min",priority:"CRITICAL",title:"Create a Vercel account",
        description:"Go to vercel.com → Sign up with GitHub (create GitHub account if needed)",
        steps:["Open vercel.com in your browser","Click 'Start Deploying' → 'Continue with GitHub'","Create a GitHub account if you don't have one (2 min)","Authorize Vercel to access GitHub"],
        link:"https://vercel.com",output:"Active Vercel account"},
      {id:"w2",time:"2:30pm",duration:"20 min",priority:"CRITICAL",title:"Prepare the React project",
        description:"Create the minimal project to host the Coco landing page",
        steps:["Open StackBlitz.com (no installation needed)","Choose 'React' as the template","Replace App.jsx content with the coco_landing_v2.jsx code","Check the page displays correctly in the preview"],
        link:"https://stackblitz.com",output:"Functional preview",
        tip:"StackBlitz runs 100% in the browser — no installation needed from Samui"},
      {id:"w3",time:"3:00pm",duration:"15 min",priority:"CRITICAL",title:"Deploy to Vercel",
        description:"Connect StackBlitz to Vercel to get the public URL",
        steps:["In StackBlitz, click 'Deploy' (top right button)","Choose 'Deploy to Vercel'","Authorize the connection","Wait 2-3 minutes → URL generated automatically"],
        output:"URL like: coco-ai.vercel.app",
        tip:"This URL is immediately shareable. Works on mobile and desktop."},
      {id:"w4",time:"3:30pm",duration:"15 min",priority:"IMPORTANT",title:"Test the chatbot on the live URL",
        description:"Check Coco responds correctly via the public URL",
        steps:["Open the URL on your phone","Send 3 test messages in EN, FR, RU","Check Coco's responses","Check the page is readable on mobile"],
        output:"Demo URL confirmed and functional"},
      {id:"w5",time:"4:00pm",duration:"20 min",priority:"IMPORTANT",title:"Register the domain coco-samui.com",
        description:"Purchase the domain to add credibility to presentations",
        steps:["Go to namecheap.com","Search 'coco-samui.com' (~$12/year)","Alternatives if taken: cocosamui.ai · askcoco.io · cocosamuiai.com","Pay and connect to Vercel (DNS Settings)"],
        link:"https://www.namecheap.com",output:"Domain purchased and connected (24h propagation)",
        tip:"The Vercel domain is enough for this week. A custom domain is a plus but not a blocker."},
      {id:"w6",time:"5:00pm",duration:"30 min",priority:"IMPORTANT",title:"Record the demo video (Loom)",
        description:"Record a 2-min Coco demo video for emails",
        steps:["Install Loom (loom.com) on computer or phone","Record the screen during a conversation with Coco","Show: EN → RU → activity suggestions → pricing","Get the shareable Loom link"],
        link:"https://www.loom.com",output:"2-min demo video with shareable link",
        tip:"A 2-min video is worth a thousand words. Hoteliers immediately see what they are buying."},
    ],
  },
  {
    id:"thu",day:"Thursday",date:"June 4",color:C.teal,icon:"📋",label:"PROSPECTING",
    objective:"Prepare all contact tools and launch outreach",
    tasks:[
      {id:"t1",time:"9:00am",duration:"30 min",priority:"CRITICAL",title:"Finalise the priority contact list",
        description:"6 hotels to contact first — emails already compiled",
        steps:["Anantara Bophut → bophutsamui@anantara.com","Bandara Resort → stay@bandarasamui.com","Hansar Samui → reservation@hansarsamui.com","Amari Koh Samui → reservations.kohsamui@amari.com","Santiburi → info@santiburisamui.com","Centara Reserve → crs@chr.co.th"],
        output:"6 validated contacts",
        tip:"Start with 4★ hotels: faster decisions than 5★. Bandara and Hansar are the most accessible."},
      {id:"t2",time:"9:30am",duration:"45 min",priority:"CRITICAL",title:"Personalise the 6 contact emails",
        description:"Adapt the email template to each hotel with the manager's name if known",
        steps:["Open the email template already drafted","Personalise: [Hotel name], [Contact name if known], [Geographic zone]","Add the demo URL + Loom video link","Attach the pitch deck PDF (export from PPTX)","Proofread each email carefully before sending"],
        output:"6 personalised emails ready to send"},
      {id:"t3",time:"10:30am",duration:"30 min",priority:"CRITICAL",title:"Set up WhatsApp Business",
        description:"Create a WhatsApp Business profile for professional exchanges",
        steps:["Download WhatsApp Business (if not already installed)","Create the profile: 'Coco · Samui Concierge AI'","Profile photo: Coco logo","Description: 'Local AI concierge for hotels · Koh Samui'","Set up automatic welcome message"],
        output:"WhatsApp Business configured and professional"},
      {id:"t4",time:"11:00am",duration:"15 min",priority:"CRITICAL",title:"Send the 6 red-priority emails",
        description:"Send personalised emails from your professional email address",
        steps:["Send from a professional address (cyril@coconutprojects.com or similar)","Subject: 'An AI concierge for your guests – 24/7, multilingual, zero HR cost'","BCC yourself to keep a record","Space out sends by 5-10 min to avoid spam filters"],
        output:"6 emails sent · Follow-up in calendar",
        tip:"Tuesday–Thursday mornings 9–11am = best open rate for decision-makers."},
      {id:"t5",time:"2:00pm",duration:"1h",priority:"IMPORTANT",title:"Field canvassing — Bophut & Lamai hotels",
        description:"Present yourself in person at 2-3 nearby hotels",
        steps:["Print 5 colour copies of the pitch deck","Prepare the demo on your phone (live Coco URL)","Ask to speak with the Guest Relations Manager or Digital Manager","5-min pitch: problem → solution → live demo → pricing","Leave the printed pitch deck + business card"],
        output:"2-3 face-to-face meetings + hot leads identified",
        tip:"The live demo on your phone is your strongest argument. Making Coco speak Russian or German in front of them = immediate wow effect."},
      {id:"t6",time:"4:00pm",duration:"30 min",priority:"IMPORTANT",title:"Contact local concierge services",
        description:"Concierge services can become prescribers or partners",
        steps:["MrSamui.com → contact form on the website","Private Concierge Samui → via private-concierge-samui.com","Samui & Koh → via samui-and-koh.com","Proposal: partnership (commission on referred clients)"],
        output:"3 concierge services contacted"},
      {id:"t7",time:"5:00pm",duration:"30 min",priority:"BONUS",title:"Create a digital business card",
        description:"QR code linking to the Coco demo — perfect for in-person meetings",
        steps:["Go to qr-code-generator.com","Generate a QR code to the Coco demo URL","Download in high resolution","Print 10 cards at local printer or on laminated A4"],
        link:"https://www.qr-code-generator.com",output:"QR code + mini cards printed"},
    ],
  },
  {
    id:"fri",day:"Friday",date:"June 5",color:"#22C55E",icon:"🤝",label:"DEMOS & CLOSING",
    objective:"Run live demos and sign the first contracts",
    tasks:[
      {id:"f1",time:"9:00am",duration:"30 min",priority:"CRITICAL",title:"WhatsApp follow-ups — Thursday contacts",
        description:"Follow up by WhatsApp with all hotels contacted the day before",
        steps:["Short message: 'Hi [name], following up on my email yesterday about Coco, your future AI concierge. Available for a 15-min demo today?'","Include the demo link directly in the message","Don't call before 10am — respect hotel hours","Goal: 2-3 confirmed demo appointments for Friday/Monday"],
        output:"2-3 confirmed demo appointments",
        tip:"WhatsApp has a 98% open rate vs 25% for emails. It's your priority channel on Samui."},
      {id:"f2",time:"10:00am",duration:"30 min",priority:"CRITICAL",title:"Prepare the live demo script (15 min)",
        description:"Have a precise script for each demo appointment",
        steps:["Min 1-2: You → 'Your guests ask questions at 11pm. Coco responds in 2 sec.'","Min 3-7: Live demo → make Coco talk (honeymooning couple, family, Russian guest)","Min 8-10: Features → 5-line integration, co-branding, monthly report","Min 11-13: Pricing → Starter 2,500 / Partner 4,500 THB/month","Min 14-15: Closing → 'Shall we start with the 14 free days?'"],
        output:"Script memorised + phone charged + URL ready",
        tip:"Showing Coco speaking Russian or German to a GM = instant deal-maker on Samui."},
      {id:"f3",time:"10:30am",duration:"2h",priority:"CRITICAL",title:"Field demos — Chaweng & Lamai hotels",
        description:"In-person appointments with hotels that responded",
        steps:["Arrive 10 min early, demo on charged phone","Start with a question: 'How many languages do your guests speak?' → the answer justifies Coco","Show the demo, don't just explain it","If interested: propose the 14 free days directly","If undecided: leave pitch deck + QR code + call back Monday"],
        output:"Goal: 1 signed contract or 3 free trials activated"},
      {id:"f4",time:"2:00pm",duration:"1h",priority:"IMPORTANT",title:"Send secondary emails (orange priority)",
        description:"Contact the 10 hotels on the secondary list",
        steps:["Banyan Tree → samui@banyantree.com","Renaissance Koh Samui → renaissance.kohsamui@marriott.com","Silavadee → info@silavadee.com","Beach Republic → info@beachrepublic.com","Rocky's → reservations@rockyresort.com","+ 5 others from the contact list"],
        output:"10 additional emails sent"},
      {id:"f5",time:"3:30pm",duration:"45 min",priority:"IMPORTANT",title:"Prepare a simple contract / order form",
        description:"Have a signable document for hotels ready to start",
        steps:["1 page maximum: hotel name, chosen plan, duration, monthly price","Clause: '14-day free trial. Billing on day 15 unless cancelled.'","Signature + date. No lawyer needed to get started.","WhatsApp version: take a photo of the signed document"],
        output:"Simple contract ready to sign",
        tip:"A simple one-page contract = more deals signed than a 10-page one that blocks everything."},
      {id:"f6",time:"5:00pm",duration:"30 min",priority:"BONUS",title:"Week review + next week plan",
        description:"Measure results and prepare follow-up",
        steps:["Count: emails sent / replies / demos done / contracts signed","List hotels to follow up on Monday","Identify 2-3 field feedback to integrate into Coco","Prepare follow-up emails for Monday morning"],
        output:"Clear commercial pipeline for the following week"},
    ],
  },
];

const CONTACTS_URGENT = [
  {name:"Anantara Bophut",email:"bophutsamui@anantara.com",zone:"Bophut",stars:5},
  {name:"Bandara Resort",email:"stay@bandarasamui.com",zone:"Bophut",stars:4},
  {name:"Hansar Samui",email:"reservation@hansarsamui.com",zone:"Bophut",stars:5},
  {name:"Amari Koh Samui",email:"reservations.kohsamui@amari.com",zone:"Chaweng",stars:4},
  {name:"Santiburi",email:"info@santiburisamui.com",zone:"Maenam",stars:5},
  {name:"Centara Reserve",email:"crs@chr.co.th",zone:"Chaweng",stars:5},
];

function TaskCard({task,done,onToggle}){
  const[open,setOpen]=useState(false);
  const pC={CRITICAL:["#FEE2E2","#EF4444"],IMPORTANT:["#FEF3C7","#F59E0B"],BONUS:["#F0FDF4","#22C55E"]};
  const[bg,fg]=pC[task.priority]||pC.IMPORTANT;
  return(
    <div style={{background:C.white,borderRadius:14,overflow:"hidden",boxShadow:done?"none":"0 2px 16px rgba(0,0,0,0.06)",border:`1px solid ${done?"#E0F2E9":C.creamDark}`,opacity:done?0.7:1,transition:"all 0.3s"}}>
      <div style={{padding:"14px 16px",display:"flex",alignItems:"flex-start",gap:12,cursor:"pointer"}} onClick={()=>setOpen(o=>!o)}>
        <div onClick={e=>{e.stopPropagation();onToggle();}} style={{width:22,height:22,borderRadius:6,border:done?"none":`2px solid #CBD5E1`,background:done?C.green:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1,cursor:"pointer",transition:"all 0.2s"}}>
          {done&&<span style={{color:"white",fontSize:12,fontWeight:700}}>✓</span>}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:4}}>
            <span style={{fontSize:11,color:C.muted,fontWeight:500}}>{task.time}</span>
            <span style={{fontSize:9,padding:"2px 7px",borderRadius:20,background:bg,color:fg,fontWeight:700,letterSpacing:"0.05em"}}>{task.priority}</span>
            <span style={{fontSize:10,color:C.muted}}>{task.duration}</span>
          </div>
          <div style={{fontSize:14,fontWeight:600,color:done?C.muted:C.charcoal,textDecoration:done?"line-through":"none"}}>{task.title}</div>
          <div style={{fontSize:12,color:C.muted,marginTop:3,lineHeight:1.5}}>{task.description}</div>
        </div>
        <div style={{fontSize:16,color:C.muted,transition:"transform 0.2s",transform:open?"rotate(180deg)":"none",flexShrink:0}}>▾</div>
      </div>
      {open&&(
        <div style={{padding:"0 16px 16px 50px",borderTop:`1px solid ${C.creamDark}`}}>
          <div style={{paddingTop:12}}>
            <div style={{fontSize:11,fontWeight:600,color:C.teal,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>Steps:</div>
            {task.steps.map((step,i)=>(
              <div key={i} style={{display:"flex",gap:8,marginBottom:7,alignItems:"flex-start"}}>
                <div style={{width:18,height:18,borderRadius:"50%",background:C.teal,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                  <span style={{fontSize:9,color:"white",fontWeight:700}}>{i+1}</span>
                </div>
                <span style={{fontSize:12.5,color:C.charcoal,lineHeight:1.5}}>{step}</span>
              </div>
            ))}
            {task.tip&&(
              <div style={{background:`${C.sand}22`,borderRadius:10,padding:"10px 12px",marginTop:10,display:"flex",gap:8,alignItems:"flex-start"}}>
                <span style={{fontSize:14}}>💡</span>
                <span style={{fontSize:12,color:"#7A5C00",lineHeight:1.55}}>{task.tip}</span>
              </div>
            )}
            <div style={{marginTop:10,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
              <span style={{fontSize:10,fontWeight:600,color:C.teal}}>→ Output:</span>
              <span style={{fontSize:11,background:`${C.teal}12`,color:C.teal,padding:"3px 10px",borderRadius:20,fontWeight:500}}>{task.output}</span>
              {task.link&&<a href={task.link} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:C.coral,textDecoration:"none",padding:"3px 10px",border:`1px solid ${C.coral}30`,borderRadius:20}}>🔗 Open →</a>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ActionPlanEN(){
  const[activeDay,setActiveDay]=useState("wed");
  const[done,setDone]=useState({});
  const[copiedEmail,setCopiedEmail]=useState(null);
  const toggleTask=(id)=>setDone(d=>({...d,[id]:!d[id]}));
  const allTasks=DAYS.flatMap(d=>d.tasks);
  const totalDone=allTasks.filter(t=>done[t.id]).length;
  const progress=Math.round((totalDone/allTasks.length)*100);
  const currentDay=DAYS.find(d=>d.id===activeDay);
  const dayDone=currentDay.tasks.filter(t=>done[t.id]).length;
  const copyEmail=(email)=>{navigator.clipboard.writeText(email);setCopiedEmail(email);setTimeout(()=>setCopiedEmail(null),2000);};

  return(
    <div style={{fontFamily:"'DM Sans','Segoe UI',sans-serif",background:C.cream,minHeight:"100vh"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>

      {/* Header */}
      <div style={{background:`linear-gradient(135deg,${C.tealDeep},${C.teal})`,padding:"24px 24px 20px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
          <span style={{fontSize:24}}>🥥</span>
          <div>
            <div style={{fontSize:18,fontWeight:700,color:C.white,letterSpacing:"0.08em"}}>COCO · Action Plan</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",letterSpacing:"0.15em"}}>GOAL: READY TO PRESENT TO HOTELS · END OF WEEK</div>
          </div>
        </div>
        <div style={{background:"rgba(255,255,255,0.08)",borderRadius:12,padding:"14px 16px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <span style={{fontSize:12,color:"rgba(255,255,255,0.65)"}}>Overall progress</span>
            <span style={{fontSize:16,fontWeight:700,color:C.sand}}>{progress}%</span>
          </div>
          <div style={{height:6,background:"rgba(255,255,255,0.12)",borderRadius:3,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${progress}%`,background:`linear-gradient(90deg,${C.coral},${C.sand})`,borderRadius:3,transition:"width 0.5s ease"}}/>
          </div>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",marginTop:6}}>{totalDone}/{allTasks.length} tasks completed</div>
        </div>
      </div>

      {/* Day tabs */}
      <div style={{background:C.white,borderBottom:`1px solid ${C.creamDark}`,display:"flex",overflowX:"auto"}}>
        {DAYS.map(d=>{
          const dayComplete=d.tasks.filter(t=>done[t.id]).length;
          return(
            <button key={d.id} onClick={()=>setActiveDay(d.id)} style={{padding:"14px 16px",background:"none",border:"none",cursor:"pointer",borderBottom:activeDay===d.id?`3px solid ${d.color}`:"3px solid transparent",marginBottom:-1,whiteSpace:"nowrap",flex:1}}>
              <div style={{fontSize:16,marginBottom:2}}>{d.icon}</div>
              <div style={{fontSize:12,fontWeight:activeDay===d.id?600:400,color:activeDay===d.id?d.color:C.muted}}>{d.day}</div>
              <div style={{fontSize:10,color:C.muted}}>{d.date}</div>
              <div style={{fontSize:9,marginTop:2,color:dayComplete===d.tasks.length?"#22C55E":C.muted}}>{dayComplete}/{d.tasks.length} ✓</div>
            </button>
          );
        })}
      </div>

      {/* Day content */}
      <div style={{padding:"16px"}}>
        <div style={{background:`${currentDay.color}14`,border:`1px solid ${currentDay.color}30`,borderRadius:14,padding:"14px 16px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
              <span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:20,background:currentDay.color,color:"white",letterSpacing:"0.1em"}}>{currentDay.label}</span>
              <span style={{fontSize:12,color:C.muted}}>{currentDay.date}</span>
            </div>
            <div style={{fontSize:13.5,fontWeight:600,color:C.charcoal}}>🎯 {currentDay.objective}</div>
          </div>
          <div style={{textAlign:"center",flexShrink:0}}>
            <div style={{fontSize:22,fontWeight:700,color:currentDay.color}}>{dayDone}/{currentDay.tasks.length}</div>
            <div style={{fontSize:9,color:C.muted}}>tasks</div>
          </div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
          {currentDay.tasks.map(task=>(
            <TaskCard key={task.id} task={task} done={!!done[task.id]} onToggle={()=>toggleTask(task.id)}/>
          ))}
        </div>

        {activeDay==="thu"&&(
          <div style={{marginBottom:24}}>
            <div style={{fontSize:13,fontWeight:600,color:C.tealDeep,marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
              <span>📋</span> RED priority contacts — copy & paste
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {CONTACTS_URGENT.map(c=>(
                <div key={c.email} style={{background:C.white,borderRadius:12,padding:"12px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,boxShadow:"0 1px 8px rgba(0,0,0,0.05)"}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:600,color:C.charcoal}}>{c.name}</div>
                    <div style={{fontSize:11,color:C.muted}}>{c.zone} · {"⭐".repeat(c.stars)}</div>
                    <div style={{fontSize:11,color:C.teal,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.email}</div>
                  </div>
                  <button onClick={()=>copyEmail(c.email)} style={{padding:"7px 12px",borderRadius:8,border:`1px solid ${C.teal}30`,background:copiedEmail===c.email?`${C.green}20`:"transparent",color:copiedEmail===c.email?C.green:C.teal,fontSize:11,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.2s"}}>
                    {copiedEmail===c.email?"✓ Copied":"📋 Copy"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeDay==="wed"&&(
          <div style={{background:C.white,borderRadius:14,padding:16,border:`1px solid ${C.creamDark}`}}>
            <div style={{fontSize:13,fontWeight:600,color:C.tealDeep,marginBottom:10}}>📱 WhatsApp demo message (send after deployment)</div>
            <div style={{background:C.cream,borderRadius:10,padding:"12px 14px",fontSize:12.5,color:C.charcoal,lineHeight:1.7,fontStyle:"italic"}}>
              "Hi [Name], this is Cyril, based on Koh Samui. I'm building Coco 🥥 — a local AI concierge for hotels, available 24/7 in 6 languages. Sending you a 2-min demo: [LOOM URL]. Live interactive demo: [VERCEL URL]. Available for a quick 15-min call this week?"
            </div>
          </div>
        )}

        {activeDay==="fri"&&(
          <div style={{background:`${C.green}10`,borderRadius:14,padding:16,border:`1px solid ${C.green}30`}}>
            <div style={{fontSize:14,fontWeight:600,color:"#166534",marginBottom:8}}>🏁 End-of-week targets</div>
            {["✓ Demo URL live and functional","✓ Pitch deck sent to 16+ hotels","✓ 3+ live demos completed","✓ 1 contract signed OR 3 free trials activated","✓ Pipeline of 10 hotels ready for next week"].map((item,i)=>(
              <div key={i} style={{fontSize:12.5,color:"#166534",lineHeight:1.8}}>{item}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
