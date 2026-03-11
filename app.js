/* ═══════════════════════════════════════════════
   Grader Genie  v3.0 — app.js
   Premium rebuild · March 2026
═══════════════════════════════════════════════ */

/* ─── DATA ─── */
let feedbackData=[
  {id:1,studentName:'Alice Chen',homeworkTitle:'World War II Essay',subject:'History',grade:92,letterGrade:'A',feedback:'Excellent analysis of causation. Thesis is sharp and well-supported with primary sources. Minor APA inconsistencies on page 4.',date:'2026-03-01',answer:'WWII was caused by multiple interrelated factors...'},
  {id:2,studentName:'Bob Martinez',homeworkTitle:'Quadratic Equations',subject:'Mathematics',grade:78,letterGrade:'B',feedback:'Good process work. Step 3 has an arithmetic error leading to an incorrect final answer. Review completing-the-square method.',date:'2026-03-02',answer:'x² + 5x + 6 = 0, factoring gives (x+2)(x+3)...'},
  {id:3,studentName:'Clara Osei',homeworkTitle:'Photosynthesis Report',subject:'Science',grade:95,letterGrade:'A',feedback:'Outstanding clarity and use of diagrams. Correctly explains both light-dependent and light-independent reactions.',date:'2026-03-02',answer:'Photosynthesis converts CO₂ and H₂O into glucose...'},
  {id:4,studentName:'David Kim',homeworkTitle:'Shakespeare Analysis',subject:'English',grade:65,letterGrade:'D',feedback:'Your reading is surface-level. Push deeper into the metaphorical language. Use at least 3 textual quotations per claim.',date:'2026-03-03',answer:'Hamlet is sad and wants revenge...'},
  {id:5,studentName:'Emma Zhang',homeworkTitle:'Quadratic Equations',subject:'Mathematics',grade:88,letterGrade:'B',feedback:'Very strong. All steps are correct. To reach an A, show alternative methods and check discriminant before solving.',date:'2026-03-03',answer:'Using the quadratic formula for 2x²-4x-6=0...'},
  {id:6,studentName:'Frank Adeyemi',homeworkTitle:'Climate Change Essay',subject:'Geography',grade:85,letterGrade:'B',feedback:'Solid argument with good data citations. Conclusion could be stronger — synthesize your key points rather than just restating them.',date:'2026-03-04',answer:'Climate change is accelerating due to human activity...'},
  {id:7,studentName:'Grace Liu',homeworkTitle:'Photosynthesis Report',subject:'Science',grade:72,letterGrade:'C',feedback:'Correct overview but lacks detail on the Calvin cycle. Missing comparison between C3 and C4 plants as required.',date:'2026-03-04',answer:'Plants use sunlight to make food through photosynthesis...'},
  {id:8,studentName:'Henry Okafor',homeworkTitle:'World War II Essay',subject:'History',grade:55,letterGrade:'F',feedback:'The essay lacks a clear thesis. Most claims are unsupported. Please visit office hours — I want to help you improve.',date:'2026-03-05',answer:'WW2 started when Germany invaded Poland in 1939...'},
  {id:9,studentName:'Isla Patel',homeworkTitle:'Shakespeare Analysis',subject:'English',grade:90,letterGrade:'A',feedback:'Impressive close-reading. Your interpretation of the "To be or not to be" soliloquy is original and well-argued.',date:'2026-03-05',answer:'The soliloquy reveals Hamlet\'s philosophical struggle...'},
  {id:10,studentName:'Jake Torres',homeworkTitle:'Climate Change Essay',subject:'Geography',grade:60,letterGrade:'D',feedback:'Basic understanding present, but lacks specific data or statistics. Avoid vague generalisations — quantify your claims.',date:'2026-03-05',answer:'The Earth is getting warmer because of pollution...'},
  {id:11,studentName:'Alice Chen',homeworkTitle:'Quadratic Equations',subject:'Mathematics',grade:96,letterGrade:'A',feedback:'Flawless. All three methods demonstrated correctly with clear notation.',date:'2026-03-06',answer:'Method 1: factoring. Method 2: quadratic formula. Method 3: completing the square...'},
  {id:12,studentName:'Clara Osei',homeworkTitle:'Climate Change Essay',subject:'Geography',grade:91,letterGrade:'A',feedback:'Exceptional use of IPCC data. Well-structured argument from evidence to conclusion.',date:'2026-03-06',answer:'According to the 2023 IPCC report, global temps have risen by 1.2°C...'},
];
let nextId=13;

/* State */
let curPage='dashboard';
let globalSearch='';
let filterAssignment='';
let filterSubject='';
let filterGrade='';
let sortKey='date';let sortAsc=false;
let pageCurrent=1;const pageSize=8;

/* Rubric state */
const rubCriteria=[
  {name:'Thesis & Argument',max:30,score:null},
  {name:'Evidence & Sources',max:25,score:null},
  {name:'Analysis & Depth',max:25,score:null},
  {name:'Writing & Clarity',max:20,score:null},
];

/* ─── HELPERS ─── */
const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);
const gradeStr=n=>n>=90?'A':n>=80?'B':n>=70?'C':n>=60?'D':'F';
const gradeColor=g=>({A:'#34d399',B:'#22d3ee',C:'#fbbf24',D:'#fb923c',F:'#f87171'}[g]||'#7285a8');
const gradeClass=g=>({A:'bA',B:'bB',C:'bC',D:'bD',F:'bF'}[g]||'bgr');
const avg=a=>a.length?Math.round(a.reduce((s,v)=>s+v,0)/a.length):0;
const median=a=>{if(!a.length)return 0;const s=[...a].sort((x,y)=>x-y);const m=Math.floor(s.length/2);return s.length%2?s[m]:Math.round((s[m-1]+s[m])/2)};
const stddev=a=>{if(!a.length)return 0;const m=avg(a);return Math.round(Math.sqrt(avg(a.map(v=>(v-m)**2))))};
const initials=n=>(n||'?').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
const since=d=>{const diff=Date.now()-new Date(d);const days=Math.floor(diff/86400000);return days===0?'Today':days===1?'Yesterday':days+'d ago'};

/* ─── MODAL ─── */
function openModal(id){document.getElementById(id).classList.add('open');document.body.style.overflow='hidden'}
function closeModal(id){document.getElementById(id).classList.remove('open');document.body.style.overflow=''}
document.addEventListener('keydown',e=>{if(e.key==='Escape')$$('.overlay.open').forEach(o=>{o.classList.remove('open');document.body.style.overflow=''})});
$$('.overlay').forEach(o=>o.addEventListener('click',e=>{if(e.target===o){o.classList.remove('open');document.body.style.overflow=''}}));

/* ─── TOAST ─── */
function toast(msg,type='info'){
  const wrap=$('.twrap');
  const t=document.createElement('div');
  t.className=`toast t${type[0]}`;
  const icons={success:'fa-circle-check',error:'fa-circle-xmark',info:'fa-circle-info'};
  t.innerHTML=`<i class="fas ${icons[type]||icons.info}"></i><span>${msg}</span>`;
  wrap.appendChild(t);
  setTimeout(()=>{t.style.opacity='0';t.style.transform='translateX(16px)';t.style.transition='all .3s';setTimeout(()=>t.remove(),300)},3500);
}

/* ─── AUTH ─── */
function handleLogin(){
  const em=$('#li-email').value.trim();const pw=$('#li-pw').value;
  if(!em||!pw){toast('Please fill in all fields','error');return}
  if(!em.includes('@')){toast('Enter a valid email','error');return}
  localStorage.setItem('gg_loggedIn','1');
  localStorage.setItem('gg_email',em);
  if(!localStorage.getItem('gg_name'))localStorage.setItem('gg_name',em.split('@')[0].replace(/[^a-zA-Z ]/g,' ').replace(/\b\w/g,c=>c.toUpperCase()));
  toast('Welcome back!','success');
  setTimeout(()=>{window.location.href='homework-grader.html'},600);
}
function handleSignup(){
  const nm=$('#su-name').value.trim();const em=$('#su-email').value.trim();
  const pw=$('#su-pw').value;const cp=$('#su-cpw').value;
  if(!nm||!em||!pw||!cp){toast('Please fill in all fields','error');return}
  if(pw!==cp){toast('Passwords do not match','error');return}
  if(pw.length<6){toast('Password must be 6+ characters','error');return}
  localStorage.setItem('gg_loggedIn','1');localStorage.setItem('gg_name',nm);localStorage.setItem('gg_email',em);
  toast('Account created!','success');
  setTimeout(()=>{window.location.href='homework-grader.html'},600);
}

/* ─── NAVIGATE ─── */
function navigate(pid,btn){
  $$('.page').forEach(p=>p.classList.remove('active'));
  $$('.nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById('pg-'+pid).classList.add('active');
  if(btn)btn.classList.add('active');
  const titles={dashboard:'Dashboard',grade:'Grade Submission',rubric:'Rubric Grader',submissions:'Submissions',analytics:'Analytics',students:'Students',export:'Export / Import',profile:'My Profile',leaderboard:'Leaderboard',assignments:'Assignment Tracker',notes:'Quick Notes'};
  $('#topbar-title').textContent=titles[pid]||pid;
  curPage=pid;
  if(pid==='dashboard')renderDashboard();
  if(pid==='submissions'){renderTable();syncFilters()}
  if(pid==='analytics')renderAnalytics();
  if(pid==='students')renderStudents();
  if(pid==='profile')renderProfile();
  if(pid==='leaderboard')renderLeaderboard();
  if(pid==='assignments')renderAssignments();
}

/* ─── GRADE FORM ─── */
function onGradeInput(){
  const v=parseInt($('#f-grade').value);
  if(v>=0&&v<=100){
    const g=gradeStr(v);
    $('#grade-preview').innerHTML=`<span class="badge ${gradeClass(g)}" style="font-size:18px;padding:5px 14px">${g}</span>`;
    $('#grade-pbar').style.width=v+'%';
    const pf=$('#grade-pbar');
    if(v>=90)pf.style.background='linear-gradient(90deg,#34d399,#22d3ee)';
    else if(v>=80)pf.style.background='linear-gradient(90deg,#22d3ee,#60a5fa)';
    else if(v>=70)pf.style.background='linear-gradient(90deg,#fbbf24,#fb923c)';
    else pf.style.background='linear-gradient(90deg,#fb923c,#f87171)';
  }else{$('#grade-preview').innerHTML='';$('#grade-pbar').style.width='0%'}
}

function clearForm(){$('#grade-form').reset();$('#grade-preview').innerHTML='';$('#grade-pbar').style.width='0%'}

function submitGrade(){
  const nm=$('#f-name').value.trim();const ti=$('#f-title').value.trim();
  const su=$('#f-subject').value.trim();const gr=parseInt($('#f-grade').value);
  const fb=$('#f-feedback').value.trim();const ans=$('#f-answer').value.trim();
  if(!nm||!ti||!gr&&gr!==0||!fb){toast('Please fill in all required fields','error');return}
  if(gr<0||gr>100){toast('Grade must be 0–100','error');return}
  feedbackData.push({id:nextId++,studentName:nm,homeworkTitle:ti,subject:su||'General',grade:gr,letterGrade:gradeStr(gr),feedback:fb,date:new Date().toISOString().slice(0,10),answer:ans});
  clearForm();
  updateSuggestions();
  toast('Submission graded successfully!','success');
}

/* ─── DEMO FEEDBACK GENERATOR ─── */
function generateAI(){
  const nm   = $('#f-name').value.trim()    || 'the student';
  const ti   = $('#f-title').value.trim()   || 'this assignment';
  const su   = ($('#f-subject').value.trim() || 'General').toLowerCase();
  const gr   = parseInt($('#f-grade').value) || null;
  const ans  = $('#f-answer').value.trim();
  const btn  = $('#ai-btn');

  btn.classList.add('loading'); btn.disabled = true;

  // Simulate a brief "thinking" delay for realism
  setTimeout(() => {
    const feedback = _buildFeedback(nm, ti, su, gr, ans);
    $('#f-feedback').value = feedback;
    btn.classList.remove('loading'); btn.disabled = false;
    toast('Feedback generated!', 'success');
  }, 820);
}

function _buildFeedback(name, title, subject, grade, answer) {
  const first = name.split(' ')[0];
  const letter = grade !== null ? gradeStr(grade) : null;

  /* ── Opening: grade-band aware ── */
  const openings = {
    A: [
      `${first}, this is an outstanding piece of work on "${title}" — your understanding really shines through.`,
      `Excellent effort, ${first}! Your submission on "${title}" demonstrates a confident and thorough command of the material.`,
      `${first}, you've delivered a truly impressive response to "${title}" and it's clear you put genuine thought into every section.`,
    ],
    B: [
      `${first}, this is a strong submission on "${title}" that shows a solid grasp of the core ideas.`,
      `Good work, ${first} — your response to "${title}" is well-structured and demonstrates real understanding.`,
      `${first}, you've tackled "${title}" with confidence, and the result is a commendable piece of work overall.`,
    ],
    C: [
      `${first}, your submission on "${title}" shows a foundational understanding, and there are some clear areas to build on.`,
      `A fair attempt, ${first} — you've covered the basics of "${title}", though there is room to develop your ideas further.`,
      `${first}, you've made a reasonable start on "${title}" and I can see you're engaging with the material.`,
    ],
    D: [
      `${first}, your response to "${title}" shows you've made an attempt, but there are several areas that need more attention.`,
      `${first}, I can see some effort here on "${title}", though the work needs considerable development before it meets the expected standard.`,
    ],
    F: [
      `${first}, your submission on "${title}" suggests you may be struggling with this material — please don't hesitate to reach out for support.`,
      `${first}, this response to "${title}" falls short of the requirements; I'd strongly encourage you to revisit the key concepts and come to office hours.`,
    ],
  };

  /* ── Subject-specific middle sentences ── */
  const subjectHints = {
    mathematics:  [
      'Your working is clearly laid out, which makes it easy to follow your reasoning step by step.',
      'Pay careful attention to arithmetic at each stage — a single slip early on can affect the entire solution.',
      'Try to show all intermediate steps rather than jumping to the answer, as this helps demonstrate full understanding.',
      'Consider checking your answer by substituting it back into the original equation.',
    ],
    science: [
      'Your use of scientific terminology is appropriate and adds precision to your explanations.',
      'Try to connect your observations more explicitly to the underlying theory or mechanism.',
      'Including more specific data or figures would significantly strengthen your scientific argument.',
      'Your hypothesis and conclusion are well aligned — this is exactly the kind of structured thinking science demands.',
    ],
    english: [
      'Your analysis shows genuine engagement with the text, and your personal voice comes through clearly.',
      'To strengthen your argument, support each claim with at least one direct quotation and a brief explanation of its significance.',
      'The introduction sets up an interesting thesis — make sure your body paragraphs follow through consistently.',
      'Focus on the language choices the author makes and ask yourself why they chose those particular words.',
    ],
    history: [
      'You show a good awareness of the key events; now try to analyse causes and consequences more deeply.',
      'Where possible, use specific dates, names, and primary sources to add authority to your claims.',
      'Your essay would benefit from considering multiple perspectives rather than a single narrative.',
      'The chronology is solid — the next step is to move from description toward analytical argument.',
    ],
    geography: [
      'You demonstrate a good understanding of the geographical processes at work here.',
      'Try to incorporate more specific data, statistics, or case studies to ground your arguments in evidence.',
      'Consider the human and physical dimensions of the issue together rather than in isolation.',
      'Your use of geographical terminology is developing well — keep building on this.',
    ],
    general: [
      'Your ideas are clearly expressed and logically organised throughout.',
      'Try to develop each point in more depth before moving on to the next.',
      'The structure of your response is commendable — introduction, development, and conclusion are all present.',
      'Evidence and examples are key: for every claim you make, aim to back it up with a specific example.',
    ],
  };

  /* ── Closing: improvement + encouragement ── */
  const closings = {
    A: [
      `Keep up this excellent standard, ${first} — you should be proud of what you've produced.`,
      `This is the kind of analytical thinking I love to see; keep challenging yourself at this level.`,
      `Wonderful work — I look forward to seeing where you take these ideas next.`,
    ],
    B: [
      `With a little more depth in your analysis, you're well on track for top marks next time, ${first}.`,
      `A really solid effort — push yourself to explore the nuances a bit further and an A is well within reach.`,
      `Keep it up, ${first} — you're building strong academic habits that will serve you well.`,
    ],
    C: [
      `I'd encourage you to review the feedback above and have another look at the key material, ${first} — you have the ability to do better.`,
      `Don't be discouraged — focus on the areas highlighted and you'll see real improvement next time.`,
      `Let's talk through this together if you'd like, ${first}; I'm confident you can push this to the next level.`,
    ],
    D: [
      `Please come and see me during office hours, ${first} — together we can identify exactly where to focus your revision.`,
      `I believe you can improve significantly with targeted practice; let's make a plan to get you there.`,
    ],
    F: [
      `Please reach out as soon as possible, ${first} — I want to help you get back on track before the next assessment.`,
      `This is a setback, not a verdict; with the right support and effort, improvement is absolutely achievable.`,
    ],
  };

  /* ── Answer-specific personalisation ── */
  let personalLine = '';
  if (answer && answer.length > 20) {
    const firstWords = answer.slice(0, 60).replace(/\n/g, ' ').trim();
    if (grade !== null && grade >= 80) {
      personalLine = ` Your opening — "${firstWords}…" — immediately signals a strong understanding of the topic.`;
    } else if (grade !== null && grade >= 60) {
      personalLine = ` Your response begins with "${firstWords}…" which shows promise; developing this thread further would add real depth.`;
    } else {
      personalLine = ` Looking at your response, try to build more substantially beyond the opening idea.`;
    }
  }

  /* ── Pick random items from each pool ── */
  const band = letter || 'C';
  const pick  = arr => arr[Math.floor(Math.random() * arr.length)];

  const subKey = Object.keys(subjectHints).find(k => subject.includes(k)) || 'general';
  const hints  = subjectHints[subKey];

  // Build 3-sentence feedback
  const opening = pick(openings[band]  || openings['C']);
  const middle1 = pick(hints);
  const middle2 = pick(hints.filter(h => h !== middle1)) || middle1;
  const closing = pick(closings[band]  || closings['C']);

  // Grade mention
  const gradeMention = grade !== null
    ? ` Your score of ${grade} (${band}) reflects ${grade >= 90 ? 'exceptional' : grade >= 80 ? 'strong' : grade >= 70 ? 'satisfactory' : grade >= 60 ? 'developing' : 'limited'} mastery at this stage.`
    : '';

  return `${opening}${personalLine}${gradeMention} ${middle1} ${middle2} ${closing}`;
}

/* ─── FILTERS & TABLE ─── */
function getFiltered(){
  let d=[...feedbackData];
  if(globalSearch){const q=globalSearch.toLowerCase();d=d.filter(r=>r.studentName.toLowerCase().includes(q)||r.homeworkTitle.toLowerCase().includes(q)||(r.subject||'').toLowerCase().includes(q)||r.letterGrade===q.toUpperCase())}
  if(filterAssignment)d=d.filter(r=>r.homeworkTitle===filterAssignment);
  if(filterSubject)d=d.filter(r=>r.subject===filterSubject);
  if(filterGrade)d=d.filter(r=>r.letterGrade===filterGrade);
  d.sort((a,b)=>{
    let av=a[sortKey]??'',bv=b[sortKey]??'';
    if(sortKey==='grade'){av=+av;bv=+bv}
    else{av=String(av).toLowerCase();bv=String(bv).toLowerCase()}
    return sortAsc?(av>bv?1:av<bv?-1:0):(av<bv?1:av>bv?-1:0);
  });
  return d;
}

function renderTable(){
  const all=getFiltered();const total=all.length;
  const totalPages=Math.max(1,Math.ceil(total/pageSize));
  if(pageCurrent>totalPages)pageCurrent=totalPages;
  const rows=all.slice((pageCurrent-1)*pageSize,pageCurrent*pageSize);
  const tbody=$('#sub-tbody');
  if(!tbody)return;
  tbody.innerHTML='';
  if(!rows.length){tbody.innerHTML=`<tr><td colspan="7" style="text-align:center;padding:52px;color:var(--t4)"><i class="fas fa-inbox" style="font-size:34px;display:block;margin-bottom:12px;opacity:.3"></i>No submissions match filters</td></tr>`;buildPagination(1,0);return}
  rows.forEach(r=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`
      <td><div style="display:flex;align-items:center;gap:9px"><div class="sc-ava" style="width:32px;height:32px;font-size:12px">${initials(r.studentName)}</div><span style="font-weight:700">${r.studentName}</span></div></td>
      <td><span class="td-clip">${r.homeworkTitle}</span></td>
      <td><span class="badge bgr">${r.subject||'—'}</span></td>
      <td><span style="font-weight:800">${r.grade}</span></td>
      <td><span class="badge ${gradeClass(r.letterGrade)}">${r.letterGrade}</span></td>
      <td><span class="td-muted">${r.date?since(r.date):'—'}</span></td>
      <td><div class="act-grp"><button class="act-btn e" title="Edit" onclick="openEdit(${r.id})"><i class="fas fa-pen"></i></button><button class="act-btn v" title="View" onclick="viewFeedback(${r.id})"><i class="fas fa-eye"></i></button><button class="act-btn d" title="Delete" onclick="deleteEntry(${r.id})"><i class="fas fa-trash"></i></button></div></td>`;
    tbody.appendChild(tr);
  });
  buildPagination(totalPages,total);
  $('#sub-count').textContent=`${total} submission${total!==1?'s':''}`;
}

function syncFilters(){
  const assignments=[...new Set(feedbackData.map(r=>r.homeworkTitle))].sort();
  const subjects=[...new Set(feedbackData.map(r=>r.subject||'General'))].sort();
  const fa=$('#filter-assignment');const fs=$('#filter-subject');
  if(fa){fa.innerHTML='<option value="">All Assignments</option>';assignments.forEach(a=>{const o=document.createElement('option');o.value=a;o.textContent=a;fa.appendChild(o)});fa.value=filterAssignment}
  if(fs){fs.innerHTML='<option value="">All Subjects</option>';subjects.forEach(s=>{const o=document.createElement('option');o.value=s;o.textContent=s;fs.appendChild(o)});fs.value=filterSubject}
}

function buildPagination(totalPages,total){
  const bar=$('#pag-bar');if(!bar)return;
  const left=$('#pag-left');if(left)left.textContent=total?`Showing ${(pageCurrent-1)*pageSize+1}–${Math.min(pageCurrent*pageSize,total)} of ${total}`:'';
  const pg=$('#pag-btns');if(!pg)return;
  pg.innerHTML='';
  const prev=document.createElement('button');prev.className='pg-btn';prev.innerHTML='<i class="fas fa-chevron-left"></i>';
  prev.disabled=pageCurrent===1;prev.addEventListener('click',()=>{pageCurrent--;renderTable()});pg.appendChild(prev);
  let pages=[];if(totalPages<=7){for(let i=1;i<=totalPages;i++)pages.push(i)}else{pages=[1];if(pageCurrent>3)pages.push('…');const lo=Math.max(2,pageCurrent-1);const hi=Math.min(totalPages-1,pageCurrent+1);for(let i=lo;i<=hi;i++)pages.push(i);if(pageCurrent<totalPages-2)pages.push('…');pages.push(totalPages)}
  pages.forEach(p=>{const b=document.createElement('button');b.className='pg-btn'+(p===pageCurrent?' active':'');b.textContent=p;b.disabled=p==='…';if(p!=='…')b.addEventListener('click',()=>{pageCurrent=p;renderTable()});pg.appendChild(b)});
  const next=document.createElement('button');next.className='pg-btn';next.innerHTML='<i class="fas fa-chevron-right"></i>';
  next.disabled=pageCurrent===totalPages;next.addEventListener('click',()=>{pageCurrent++;renderTable()});pg.appendChild(next);
}

function sortBy(key){if(sortKey===key)sortAsc=!sortAsc;else{sortKey=key;sortAsc=false}$$('[data-sort]').forEach(th=>{th.classList.remove('sorted');th.querySelector('.si').textContent='↕'});const th=document.querySelector(`[data-sort="${key}"]`);if(th){th.classList.add('sorted');th.querySelector('.si').textContent=sortAsc?'↑':'↓'}renderTable()}
function onSearch(){globalSearch=$('#topbar-search').value;pageCurrent=1;if(curPage==='submissions')renderTable()}

/* ─── EDIT / VIEW / DELETE ─── */
function openEdit(id){
  const r=feedbackData.find(x=>x.id===id);if(!r)return;
  $('#em-name').value=r.studentName;$('#em-title').value=r.homeworkTitle;$('#em-subject').value=r.subject||'';
  $('#em-grade').value=r.grade;$('#em-feedback').value=r.feedback;
  $('#em-save').onclick=()=>{
    r.studentName=$('#em-name').value.trim();r.homeworkTitle=$('#em-title').value.trim();
    r.subject=$('#em-subject').value.trim();r.grade=parseInt($('#em-grade').value);
    r.letterGrade=gradeStr(r.grade);r.feedback=$('#em-feedback').value.trim();
    renderTable();syncFilters();updateSuggestions();closeModal('editModal');toast('Saved!','success');
  };
  openModal('editModal');
}
function viewFeedback(id){
  const r=feedbackData.find(x=>x.id===id);if(!r)return;
  $('#vm-student').textContent=r.studentName;$('#vm-title').textContent=r.homeworkTitle;
  $('#vm-grade').innerHTML=`<span class="badge ${gradeClass(r.letterGrade)}" style="font-size:20px;padding:6px 16px">${r.letterGrade}</span><span style="font-size:26px;font-weight:800;margin-left:10px">${r.grade}</span>`;
  $('#vm-subject').innerHTML=r.subject?`<span class="badge bgr">${r.subject}</span>`:'';
  $('#vm-feedback').textContent=r.feedback;$('#vm-answer').textContent=r.answer||'(not provided)';
  $('#vm-date').textContent=r.date||'';
  openModal('viewModal');
}
function deleteEntry(id){
  if(!confirm('Delete this submission?'))return;
  feedbackData=feedbackData.filter(x=>x.id!==id);
  renderTable();syncFilters();updateSuggestions();
  if(curPage==='dashboard')renderDashboard();
  toast('Submission deleted','info');
}

/* ─── SUGGESTIONS ─── */
function updateSuggestions(){
  const titles=[...new Set(feedbackData.map(r=>r.homeworkTitle))];
  const subjects=[...new Set(feedbackData.map(r=>r.subject||''))];
  const names=[...new Set(feedbackData.map(r=>r.studentName))];
  const setDL=(id,arr)=>{const dl=document.getElementById(id);if(dl){dl.innerHTML='';arr.forEach(v=>{const o=document.createElement('option');o.value=v;dl.appendChild(o)})}};
  setDL('dl-titles',titles);setDL('dl-subjects',subjects);setDL('dl-names',names);
}

/* ─── DASHBOARD ─── */
function renderDashboard(){
  const grades=feedbackData.map(r=>r.grade);const total=feedbackData.length;
  const passing=feedbackData.filter(r=>r.grade>=60).length;
  const avgG=avg(grades);
  $('#dash-total').textContent=total;$('#dash-avg').textContent=avgG;$('#dash-pass').textContent=passing;
  $('#dash-pct').textContent=total?Math.round(passing/total*100)+'%':'—';
  const students=[...new Set(feedbackData.map(r=>r.studentName))];
  $('#dash-students').textContent=students.length;
  // Recent
  const recent=[...feedbackData].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,6);
  const rlist=$('#recent-list');
  if(rlist)rlist.innerHTML=recent.map(r=>`
    <div class="r-row"><div><div class="rr-name">${r.studentName}</div><div class="rr-sub">${r.homeworkTitle} · ${r.subject||'—'}</div></div>
    <div style="display:flex;align-items:center;gap:8px;flex-shrink:0"><span class="badge ${gradeClass(r.letterGrade)}">${r.letterGrade}</span><span class="tdm">${since(r.date)}</span></div></div>`).join('');
  renderDistChart('dash-dist');
}

function renderDistChart(cid){
  const c=document.getElementById(cid);if(!c)return;
  const counts={A:0,B:0,C:0,D:0,F:0};
  feedbackData.forEach(r=>counts[r.letterGrade]=(counts[r.letterGrade]||0)+1);
  const maxV=Math.max(1,...Object.values(counts));
  const colors={A:'linear-gradient(90deg,#34d399,#22d3ee)',B:'linear-gradient(90deg,#22d3ee,#60a5fa)',C:'linear-gradient(90deg,#fbbf24,#fb923c)',D:'linear-gradient(90deg,#fb923c,#f87171)',F:'linear-gradient(90deg,#f87171,#e11d48)'};
  c.innerHTML=['A','B','C','D','F'].map(g=>`
    <div class="dist-bar"><span class="dist-lbl" style="color:${gradeColor(g)}">${g}</span>
    <div class="dist-track"><div class="dist-fill" style="width:${Math.round(counts[g]/maxV*100)}%;background:${colors[g]}"></div></div>
    <span class="dist-count">${counts[g]}</span></div>`).join('');
}

/* ─── ANALYTICS ─── */
function renderAnalytics(){
  const grades=feedbackData.map(r=>r.grade);
  const n=grades.length;
  if(!n){$('#analytics-body').innerHTML='<div class="empty"><i class="fas fa-chart-bar"></i><p>No data yet</p></div>';return}
  const hi=Math.max(...grades);const lo=Math.min(...grades);const me=median(grades);const av2=avg(grades);const std=stddev(grades);
  const pass=feedbackData.filter(r=>r.grade>=60).length;
  $('#an-high').textContent=hi;$('#an-low').textContent=lo;$('#an-med').textContent=me;
  $('#an-avg').textContent=av2;$('#an-std').textContent=std;$('#an-pass').textContent=Math.round(pass/n*100)+'%';
  renderDistChart('an-dist');
  // Top 5 students
  const smap={};feedbackData.forEach(r=>{if(!smap[r.studentName])smap[r.studentName]=[];smap[r.studentName].push(r.grade)});
  const topStudents=Object.entries(smap).map(([nm,gs])=>({nm,avg:avg(gs)})).sort((a,b)=>b.avg-a.avg).slice(0,5);
  const tlist=$('#top-performers');
  if(tlist)tlist.innerHTML=topStudents.map((s,i)=>`
    <div class="p-row"><span class="p-rank">${['🥇','🥈','🥉','4.','5.'][i]}</span>
    <div style="display:flex;align-items:center;gap:8px;flex:1"><div class="sc-ava" style="width:30px;height:30px;font-size:11px;border-radius:50%;background:linear-gradient(135deg,var(--s3),var(--s4));display:flex;align-items:center;justify-content:center;font-weight:800;color:var(--t2)">${initials(s.nm)}</div><span style="font-weight:700;font-size:13.5px">${s.nm}</span></div>
    <span class="badge ${gradeClass(gradeStr(s.avg))}">${s.avg}</span></div>`).join('');
  // Subject breakdown
  const subj={};feedbackData.forEach(r=>{if(!subj[r.subject])subj[r.subject]=[];subj[r.subject].push(r.grade)});
  const sjlist=$('#subj-list');
  if(sjlist)sjlist.innerHTML=Object.entries(subj).sort((a,b)=>avg(b[1])-avg(a[1])).map(([s,gs])=>`
    <div class="s-row"><span style="font-weight:700;font-size:13.5px">${s}</span>
    <div style="display:flex;align-items:center;gap:10px"><span class="badge bgr">${gs.length} submitted</span>
    <span class="badge ${gradeClass(gradeStr(avg(gs)))}">${avg(gs)} avg</span></div></div>`).join('');
  // Grade trends over time
  const trendEl=$('#grade-trend');
  if(trendEl){
    const sorted=[...feedbackData].sort((a,b)=>new Date(a.date)-new Date(b.date)).slice(-10);
    const w=trendEl.clientWidth||340,h=130;const pts=sorted.map(r=>r.grade);
    if(pts.length>1){
      const mn=Math.min(...pts)-10,mx=Math.max(...pts)+10;
      const toX=(i)=>10+i*(w-20)/(pts.length-1);
      const toY=(v)=>h-10-(v-mn)/(mx-mn)*(h-20);
      const path=pts.map((v,i)=>(i===0?'M':'L')+toX(i)+','+toY(v)).join(' ');
      const area=`M${toX(0)},${h} `+pts.map((v,i)=>(i===0?'L':'L')+toX(i)+','+toY(v)).join(' ')+` L${toX(pts.length-1)},${h} Z`;
      trendEl.innerHTML=`<svg viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;overflow:visible">
        <defs><linearGradient id="tg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#00d4aa" stop-opacity=".3"/><stop offset="100%" stop-color="#00d4aa" stop-opacity="0"/></linearGradient></defs>
        <path d="${area}" fill="url(#tg)"/>
        <path d="${path}" stroke="#00d4aa" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        ${pts.map((v,i)=>`<circle cx="${toX(i)}" cy="${toY(v)}" r="4" fill="#00d4aa" stroke="#090c13" stroke-width="2"/>`).join('')}
      </svg>`;
    }
  }
}

/* ─── STUDENTS ─── */
function renderStudents(){
  const smap={};
  feedbackData.forEach(r=>{
    if(!smap[r.studentName])smap[r.studentName]={name:r.studentName,grades:[],subjects:new Set(),titles:[]};
    smap[r.studentName].grades.push(r.grade);
    smap[r.studentName].subjects.add(r.subject||'General');
    smap[r.studentName].titles.push(r.homeworkTitle);
  });
  const students=Object.values(smap).sort((a,b)=>avg(b.grades)-avg(a.grades));
  const grid=$('#student-grid');if(!grid)return;
  if(!students.length){grid.innerHTML=`<div class="empty" style="grid-column:1/-1"><i class="fas fa-users"></i><p>No students yet</p></div>`;return}
  grid.innerHTML=students.map(s=>{
    const avgS=avg(s.grades);const best=Math.max(...s.grades);
    return `<div class="student-card" onclick="viewStudentDetail('${s.name}')">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">
        <div class="sc-ava">${initials(s.name)}</div>
        <div><div class="sc-name">${s.name}</div><div class="sc-meta">${s.subjects.size} subject${s.subjects.size!==1?'s':''} · ${s.grades.length} submission${s.grades.length!==1?'s':''}</div></div>
        <span class="badge ${gradeClass(gradeStr(avgS))}" style="margin-left:auto">${gradeStr(avgS)}</span>
      </div>
      <div class="pbar"><div class="pfill" style="width:${avgS}%"></div></div>
      <div class="sc-stats"><div><div class="sc-sv">${avgS}</div><div class="sc-sl">Average</div></div><div><div class="sc-sv">${best}</div><div class="sc-sl">Best</div></div></div>
    </div>`;
  }).join('');
}

function viewStudentDetail(name){
  const entries=feedbackData.filter(r=>r.studentName===name);if(!entries.length)return;
  const grades=entries.map(r=>r.grade);
  $('#sdm-name').textContent=name;$('#sdm-sub').textContent=`${entries.length} submission${entries.length!==1?'s':''}`;
  $('#sdm-avg').textContent=avg(grades);$('#sdm-best').textContent=Math.max(...grades);$('#sdm-low').textContent=Math.min(...grades);
  $('#sdm-list').innerHTML=entries.sort((a,b)=>new Date(b.date)-new Date(a.date)).map(r=>`
    <div class="r-row"><div><div class="rr-name">${r.homeworkTitle}</div><div class="rr-sub">${r.subject||'—'} · ${r.date}</div></div>
    <span class="badge ${gradeClass(r.letterGrade)}">${r.letterGrade} · ${r.grade}</span></div>`).join('');
  openModal('studentModal');
}

/* ─── RUBRIC ─── */
function renderRubric(){
  const total=rubCriteria.reduce((s,c)=>s+(c.score!==null?c.score:0),0);
  const maxTotal=rubCriteria.reduce((s,c)=>s+c.max,0);
  const pct=Math.round(total/maxTotal*100);
  $('#rub-total').textContent=total;$('#rub-max').textContent=maxTotal;$('#rub-pct').textContent=pct+'%';
  $('#rub-pbar').style.width=pct+'%';
  const grid=$('#rub-grid');if(!grid)return;
  grid.innerHTML=rubCriteria.map((c,ci)=>{
    const steps=[];for(let i=0;i<=c.max;i+=Math.ceil(c.max/5))steps.push(i);if(steps[steps.length-1]!==c.max)steps.push(c.max);
    return `<div class="rubric-card"><div class="rc-name">${c.name}</div><div class="rc-max">Max: ${c.max} pts</div>
      <div class="rc-scores">${steps.map(s=>`<button class="rs-btn${c.score===s?' sel':''}" onclick="selectRubricScore(${ci},${s})">${s}</button>`).join('')}</div>
      ${c.score!==null?`<div class="rc-sel"><i class="fas fa-check-circle"></i> ${c.score} pts selected</div>`:''}</div>`;
  }).join('');
}
function selectRubricScore(ci,score){rubCriteria[ci].score=score;renderRubric()}
function applyRubricToGrade(){
  const hasMissing=rubCriteria.some(c=>c.score===null);
  if(hasMissing){toast('Score all criteria first','error');return}
  const total=rubCriteria.reduce((s,c)=>s+c.score,0);
  const max=rubCriteria.reduce((s,c)=>s+c.max,0);
  const g=Math.round(total/max*100);
  navigate('grade',document.querySelector('.nav-item[data-page="grade"]'));
  $('#f-grade').value=g;onGradeInput();
  toast(`Rubric score ${total}/${max} → Grade ${g} applied`,'success');
}
function resetRubric(){rubCriteria.forEach(c=>c.score=null);renderRubric()}

/* ─── LEADERBOARD ─── */
function renderLeaderboard(){
  const smap={};
  feedbackData.forEach(r=>{if(!smap[r.studentName])smap[r.studentName]={name:r.studentName,grades:[],subs:0};smap[r.studentName].grades.push(r.grade);smap[r.studentName].subs++});
  const sorted=Object.values(smap).map(s=>({...s,avg:avg(s.grades)})).sort((a,b)=>b.avg-a.avg);
  const maxAvg=sorted[0]?.avg||1;
  const list=$('#lb-list');if(!list)return;
  const medals=['🥇','🥈','🥉'];
  list.innerHTML=sorted.map((s,i)=>`
    <div class="lb-row">
      <span class="lbrank ${i===0?'gold':i===1?'silver':i===2?'bronze':''}">${medals[i]||i+1}</span>
      <div class="lb-ava">${initials(s.name)}</div>
      <div style="flex:1;min-width:0"><div class="lb-name">${s.name}</div><div class="lb-sub">${s.subs} submission${s.subs!==1?'s':''}</div></div>
      <div class="lb-bar"><div class="lb-fill" style="width:${Math.round(s.avg/maxAvg*100)}%"></div></div>
      <span class="badge ${gradeClass(gradeStr(s.avg))}" style="margin-left:10px;flex-shrink:0">${s.avg}</span>
    </div>`).join('');
}

/* ─── ASSIGNMENTS ─── */
function renderAssignments(){
  const assMap={};
  feedbackData.forEach(r=>{
    if(!assMap[r.homeworkTitle])assMap[r.homeworkTitle]={title:r.homeworkTitle,subject:r.subject||'General',grades:[],submissions:0};
    assMap[r.homeworkTitle].grades.push(r.grade);assMap[r.homeworkTitle].submissions++;
  });
  const list=Object.values(assMap).sort((a,b)=>b.submissions-a.submissions);
  const grid=$('#ass-grid');if(!grid)return;
  const uniqueStudents=[...new Set(feedbackData.map(r=>r.studentName))].length;
  grid.innerHTML=list.map(a=>{
    const avgA=avg(a.grades);const pct=Math.round(a.submissions/uniqueStudents*100);
    return `<div class="assign-card">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px">
        <div><div class="assign-title">${a.title}</div><div class="assign-meta"><span class="badge bgr">${a.subject}</span></div></div>
        <span class="badge ${gradeClass(gradeStr(avgA))}">${avgA} avg</span>
      </div>
      <div class="assign-progress-lbl"><span>${a.submissions} submitted</span><span>${pct}% completion</span></div>
      <div class="pbar"><div class="pfill" style="width:${pct}%"></div></div>
    </div>`;
  }).join('');
}

/* ─── PROFILE ─── */
function renderProfile(){
  const nm=localStorage.getItem('gg_name')||'Teacher';
  const em=localStorage.getItem('gg_email')||'teacher@school.edu';
  const sc=localStorage.getItem('gg_school')||'Westbrook Academy';
  const bi=localStorage.getItem('gg_bio')||'Dedicated educator passionate about student growth.';
  const av2=initials(nm);
  $('#pf-av').textContent=av2;$('#pf-name').textContent=nm;$('#pf-email').innerHTML=`<i class="fas fa-envelope"></i> ${em}`;
  $('#pf-role').innerHTML=`<i class="fas fa-graduation-cap"></i> Lead Educator <span class="badge bt2" style="font-size:10px">Verified</span>`;
  const total=feedbackData.length;const avgA=avg(feedbackData.map(r=>r.grade));
  const students=[...new Set(feedbackData.map(r=>r.studentName))].length;
  $('#pf-total').textContent=total;$('#pf-avg').textContent=avgA||'—';$('#pf-students').textContent=students;
  $('#pfi-name').textContent=nm;$('#pfi-email').textContent=em;$('#pfi-school').textContent=sc;$('#pfi-bio').textContent=bi;
  // Activity
  const recent=[...feedbackData].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,5);
  const al=$('#act-list');
  if(al)al.innerHTML=recent.map(r=>`
    <div class="act-item"><div class="act-dot ad-t"><i class="fas fa-check"></i></div>
    <div><div class="act-text">Graded <strong>${r.studentName}</strong> on ${r.homeworkTitle}</div>
    <div class="act-time"><i class="fas fa-clock"></i> ${since(r.date)}</div></div></div>`).join('');
}
function switchProfileTab(tab){
  $$('.p-tab').forEach(t=>{t.classList.toggle('active',t.dataset.tab===tab)});
  $$('.p-tab-content').forEach(t=>{t.classList.toggle('active',t.dataset.tab===tab)});
}
function openEditProfile(){
  $('#epm-name').value=localStorage.getItem('gg_name')||'';
  $('#epm-email').value=localStorage.getItem('gg_email')||'';
  $('#epm-school').value=localStorage.getItem('gg_school')||'';
  $('#epm-bio').value=localStorage.getItem('gg_bio')||'';
  openModal('editProfileModal');
}
function saveProfile(){
  const nm=$('#epm-name').value.trim();const em=$('#epm-email').value.trim();
  if(!nm||!em){toast('Name and email required','error');return}
  localStorage.setItem('gg_name',nm);localStorage.setItem('gg_email',em);
  localStorage.setItem('gg_school',$('#epm-school').value.trim());
  localStorage.setItem('gg_bio',$('#epm-bio').value.trim());
  closeModal('editProfileModal');renderProfile();initUser();toast('Profile updated!','success');
}

/* ─── EXPORT / IMPORT ─── */
function exportData(){const b=new Blob([JSON.stringify(feedbackData,null,2)],{type:'application/json'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`grader-genie-${new Date().toISOString().slice(0,10)}.json`;a.click();toast('Data exported (JSON)','success')}
function exportCSV(){
  const hdr='ID,Student,Assignment,Subject,Grade,Letter,Feedback,Date';
  const rows=feedbackData.map(r=>`${r.id},"${r.studentName}","${r.homeworkTitle}","${r.subject||''}",${r.grade},${r.letterGrade},"${(r.feedback||'').replace(/"/g,'""')}",${r.date||''}`);
  const b=new Blob([[hdr,...rows].join('\n')],{type:'text/csv'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`grader-genie-${new Date().toISOString().slice(0,10)}.csv`;a.click();toast('Data exported (CSV)','success');
}
function importData(ev){
  const f=ev.target.files[0];if(!f)return;
  const rd=new FileReader();
  rd.onload=e=>{try{const d=JSON.parse(e.target.result);if(Array.isArray(d)){feedbackData=d;nextId=Math.max(...d.map(r=>r.id||0))+1;renderTable();syncFilters();updateSuggestions();toast(`Imported ${d.length} records`,'success')}else toast('Invalid format','error')}catch{toast('Could not parse file','error')}};
  rd.readAsText(f);
}

/* ─── USER / LOGOUT ─── */
function initUser(){
  const nm=localStorage.getItem('gg_name')||'Educator';const em=localStorage.getItem('gg_email')||'';
  const a=$('#sb-av');const n=$('#sb-name');const r=$('#sb-role');
  if(a)a.textContent=initials(nm);if(n)n.textContent=nm;if(r)r.textContent='Lead Educator';
}
function logout(){localStorage.removeItem('gg_loggedIn');window.location.href='index.html'}

/* ─── INIT ─── */
(function init(){
  initUser();updateSuggestions();
  renderDashboard();
  // Set up submit handlers
  const ss=$('#sub-search');if(ss)ss.addEventListener('input',e=>{filterAssignment=e.target.value;renderTable()});
  const fa=$('#filter-assignment');if(fa)fa.addEventListener('change',e=>{filterAssignment=e.target.value;pageCurrent=1;renderTable()});
  const fs=$('#filter-subject');if(fs)fs.addEventListener('change',e=>{filterSubject=e.target.value;pageCurrent=1;renderTable()});
  const fg=$('#filter-grade');if(fg)fg.addEventListener('change',e=>{filterGrade=e.target.value;pageCurrent=1;renderTable()});
})();
