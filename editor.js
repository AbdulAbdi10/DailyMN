'use strict';
const $=s=>document.querySelector(s);let posts=[],ready=false,dirty=false;
const fields=['title','date','topic','body','sample'];const key='daily-digest-mn-draft-v1';
$('#date').value=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
function status(text){$('#editor-status').textContent=text;}
function preview(){
 const date=$('#date').value;$('#preview-date').textContent=Digest.validate&&/^\d{4}-\d{2}-\d{2}$/.test(date)?Digest.dateParts(date).full:'';
 $('#preview-title').textContent=$('#title').value||'Your title goes here';$('#preview-topic').textContent=$('#topic').value;$('#preview-body').textContent=$('#body').value||'Your daily summary will appear here as you write.';
 $('#word-count').textContent=Digest.wordCount($('#body').value)+' words · aim for around 300';
 $('#save').textContent=posts.some(p=>p.date===date)?'Update this date':'Add to journal';
}
function saveDraft(){const draft={};fields.forEach(id=>draft[id]=id==='sample'?$('#'+id).checked:$('#'+id).value);try{localStorage.setItem(key,JSON.stringify(draft));}catch{}preview();}
function list(){
 $('#saved-entries').replaceChildren();$('#download').disabled=!ready;$('#save').disabled=!ready;$('#remove-samples').disabled=!ready||!posts.some(p=>p.sample);
 posts.forEach(p=>{const row=document.createElement('div');row.className='saved-entry';const text=document.createElement('span');text.textContent=p.date+' · '+p.title+(p.sample?' [sample]':'');const button=document.createElement('button');button.textContent='Edit';button.type='button';button.addEventListener('click',()=>{if($('#body').value.trim()&&!confirm('Replace the current draft with this entry?'))return;fields.forEach(id=>{if(id==='sample')$('#sample').checked=!!p.sample;else $('#'+id).value=p[id];});saveDraft();$('#title').focus();window.scrollTo({top:0,behavior:'smooth'});});row.append(text,button);$('#saved-entries').append(row);});preview();
}
async function load(){
 if(dirty&&!confirm('Discard journal changes that have not been downloaded?'))return;
 try{const r=await fetch('entries.json',{cache:'no-store'});if(!r.ok)throw Error();posts=Digest.validate(await r.json());ready=true;dirty=false;list();status('Loaded '+posts.length+' existing entries. Add today’s entry, then download the complete updated file.');}
 catch{status('Could not load entries.json. Import your latest file above. For a brand-new journal, choose “Start an empty journal.” Existing unsaved entries, if any, have been kept.');}
}
$('#reload').addEventListener('click',load);
$('#import').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{const next=Digest.validate(JSON.parse(await file.text()));if(dirty&&!confirm('Replace the journal changes that have not been downloaded?'))return;posts=next;ready=true;dirty=false;list();status('Imported '+posts.length+' entries.');}catch(error){status('Import failed: '+error.message);}finally{e.target.value='';}});
$('#new-journal').addEventListener('click',()=>{if(!confirm('Start an empty journal file? Downloading and uploading it later will replace the public journal.'))return;posts=[];ready=true;dirty=true;list();status('Empty journal ready. Add your first entry.');});
fields.forEach(id=>$('#'+id).addEventListener('input',saveDraft));
$('#entry-form').addEventListener('submit',event=>{event.preventDefault();if(!ready)return;const entry={date:$('#date').value,title:$('#title').value,topic:$('#topic').value,body:$('#body').value,...($('#sample').checked?{sample:true}:{})};try{Digest.validate([entry]);const exists=posts.some(p=>p.date===entry.date);if(exists&&!confirm('Replace the existing entry for '+entry.date+'?'))return;posts=Digest.validate([...posts.filter(p=>p.date!==entry.date),entry]);dirty=true;list();status('Entry added to this journal file. Click “Download entries.json”, then upload it to GitHub to publish.');}catch(error){status(error.message);}});
$('#clear').addEventListener('click',()=>{if($('#body').value.trim()&&!confirm('Clear this draft? Your journal entries will remain.'))return;$('#title').value='';$('#body').value='';$('#sample').checked=false;saveDraft();});
$('#remove-samples').addEventListener('click',()=>{if(!confirm('Remove all sample entries from the file you will download?'))return;posts=posts.filter(p=>!p.sample);dirty=true;list();status('Samples removed. Download and upload the updated file to publish.');});
$('#download').addEventListener('click',()=>{if(!ready)return;const blob=new Blob([JSON.stringify(Digest.validate(posts),null,2)+'\n'],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='entries.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);dirty=false;status('Download requested. Upload the downloaded file to your GitHub repository root, keeping its name exactly entries.json. This page has not published anything.');});
window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue='';}});
try{const draft=JSON.parse(localStorage.getItem(key)||'null');if(draft)fields.forEach(id=>{if(id==='sample')$('#sample').checked=draft[id]===true;else if(typeof draft[id]==='string')$('#'+id).value=draft[id];});}catch{}
preview();load();
