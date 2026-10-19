export const emptyState=()=>({version:1,week:1,done:{},notes:{},reviews:{},sessions:[],activeTimer:null,history:[]});
const record=v=>v&&typeof v==='object'&&!Array.isArray(v);
const dayPattern=/^\d{4}-\d{2}-\d{2}$/;
export function validDate(day){return typeof day==='string'&&dayPattern.test(day)&&new Date(day+'T12:00:00Z').toISOString().slice(0,10)===day}
export function normalizeState(s){
 if(!record(s)||s.version!==1||!Number.isInteger(s.week)||s.week<1||s.week>12||!['done','notes','reviews'].every(k=>record(s[k])))throw Error('Geçersiz Pathwork yedeği');
 if(!Object.values(s.done).every(v=>typeof v==='boolean')||!['notes','reviews'].every(k=>Object.values(s[k]).every(v=>typeof v==='string'&&v.length<=50000)))throw Error('Geçersiz notlar');
 const history=s.history??[];
 if(!Array.isArray(history)||!history.every(h=>record(h)&&typeof h.id==='string'&&h.id.startsWith('sites-')&&typeof h.title==='string'&&h.title.length<=500&&['js','leetcode','security','lab','ds','ml'].includes(h.category)&&Number.isInteger(h.week)&&validDate(h.date)&&(h.mappedTaskId===null||typeof h.mappedTaskId==='string')))throw Error('Geçersiz geçmiş çalışma');
 if(new Set(history.map(h=>h.id)).size!==history.length)throw Error('Yinelenen geçmiş kayıt');
 const sessions=s.sessions??[];
 if(!Array.isArray(sessions)||sessions.length>100000||!sessions.every(x=>record(x)&&typeof x.id==='string'&&typeof x.taskId==='string'&&Number.isFinite(x.seconds)&&x.seconds>0&&x.seconds<=86400*365&&validDate(x.date)&&['manual','timer'].includes(x.source)))throw Error('Geçersiz çalışma süreleri');
 if(new Set(sessions.map(x=>x.id)).size!==sessions.length)throw Error('Yinelenen süre kaydı');
 const timer=s.activeTimer??null;
 if(timer!==null&&(!record(timer)||typeof timer.taskId!=='string'||!Number.isFinite(timer.startedAt)||timer.startedAt<=0||timer.startedAt>Date.now()+1000))throw Error('Geçersiz sayaç');
 return {...emptyState(),week:s.week,done:{...s.done},notes:{...s.notes},reviews:{...s.reviews},history:history.map(x=>({...x})),sessions:sessions.map(x=>({...x})),activeTimer:timer?{...timer}:null};
}
export const dayKey=(time=Date.now())=>new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Istanbul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(time));
export function elapsed(timer,now=Date.now()){return timer?Math.max(0,Math.floor((now-timer.startedAt)/1000)):0}
export function timerSessions(timer,now=Date.now()){
 if(!timer)return [];
 let cursor=timer.startedAt;const result=[];
 while(cursor<now){const date=dayKey(cursor),next=Date.parse(date+'T00:00:00+03:00')+86400000,end=Math.min(next,now),seconds=(end-cursor)/1000;
 if(seconds>0)result.push({id:`timer-${timer.taskId}-${cursor}-${end}`,taskId:timer.taskId,date,seconds,source:'timer'});cursor=end;}
 return result;
}
export function stopTimer(state,now=Date.now()){state.sessions.push(...timerSessions(state.activeTimer,now));state.activeTimer=null}
export function taskSeconds(state,id,now=Date.now()){return state.sessions.filter(s=>s.taskId===id).reduce((n,s)=>n+s.seconds,0)+(state.activeTimer?.taskId===id?elapsed(state.activeTimer,now):0)}
export function mergeProgress(current,incoming){
 const a=normalizeState(current),b=normalizeState(incoming);
 for(const [k,v]of Object.entries(b.done))a.done[k]=Boolean(a.done[k]||v);
 for(const kind of ['notes','reviews'])for(const [k,v]of Object.entries(b[kind])){const old=a[kind][k];if(!old)a[kind][k]=v;else if(v&&!old.includes(v))a[kind][k]=old+'\n\n— İçe aktarılan not —\n'+v;}
 const historyIds=new Set(a.history.map(h=>h.id));for(const h of b.history)if(!historyIds.has(h.id)){a.history.push(h);historyIds.add(h.id)}
 const ids=new Set(a.sessions.map(s=>s.id));for(const s of b.sessions)if(!ids.has(s.id)){a.sessions.push(s);ids.add(s.id)}
 // An imported live timer is not resumed: only recorded sessions are portable.
 return a;
}
export function statistics(state,tasks,now=Date.now()){
 const sessions=[...state.sessions,...timerSessions(state.activeTimer,now)],known=new Map(tasks.map(t=>[t.id,t]));
 const total=sessions.reduce((n,s)=>n+s.seconds,0),daily={},categories={};
 for(const s of sessions){daily[s.date]=(daily[s.date]||0)+s.seconds;const category=known.get(s.taskId)?.category||'other';categories[category]=(categories[category]||0)+s.seconds}
 return {total,daily,categories,completed:tasks.filter(t=>state.done[t.id]).length,sessions};
}
