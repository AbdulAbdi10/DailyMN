'use strict';
const $=s=>document.querySelector(s);
let posts=[],topic='All',limit=8;
$('#year').textContent=new Date().getFullYear();
$('#today').textContent=new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric',timeZone:'America/Chicago'}).toUpperCase();
function el(tag,className,text){const n=document.createElement(tag);if(className)n.className=className;if(text!==undefined)n.textContent=text;return n;}
function render(){
 const q=$('#search').value.trim().toLocaleLowerCase();
 const found=posts.filter(p=>(topic==='All'||p.topic===topic)&&(!q||(p.title+' '+p.body+' '+p.date).toLocaleLowerCase().includes(q)));
 $('#entries').replaceChildren();$('#entry-count').textContent=found.length+' '+(found.length===1?'entry':'entries');
 $('#status').textContent=found.length?'':posts.length?'No entries match your search.':'Your journal begins here. Add your first entry using the writing page.';
 found.slice(0,limit).forEach(p=>{
  const article=el('article','entry');article.id='entry-'+p.date;const date=Digest.dateParts(p.date);
  const aside=el('div','entry-date');const time=el('time');time.dateTime=p.date;time.append(el('div','date-day',date.day),el('div','date-month',date.month));aside.append(time,el('div','date-weekday',date.weekday));
  const content=el('div');if(p.sample)content.append(el('div','sample-label','Sample entry · replace with your own writing'));
  content.append(el('div','topic',p.topic));const heading=el('h3');const link=el('a',null,p.title);link.href='#'+article.id;heading.append(link);content.append(heading);
  const body=el('div','entry-body');p.body.split(/\n\s*\n/).forEach(text=>body.append(el('p',null,text)));content.append(body);
  const count=Digest.wordCount(p.body);const meta=el('div','entry-meta');meta.append(el('span',null,count+' words'),el('span',null,Math.max(1,Math.ceil(count/200))+' min read'));content.append(meta);article.append(aside,content);$('#entries').append(article);
 });$('#more').hidden=found.length<=limit;
}
$('.filters').addEventListener('click',event=>{const b=event.target.closest('button[data-topic]');if(!b)return;topic=b.dataset.topic;limit=8;document.querySelectorAll('.filters button').forEach(n=>{const on=n===b;n.classList.toggle('selected',on);n.setAttribute('aria-pressed',String(on));});render();});
$('#search').addEventListener('input',()=>{limit=8;render();});$('#more').addEventListener('click',()=>{limit+=8;render();});
fetch('entries.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Could not load entries.');return r.json();}).then(data=>{posts=Digest.validate(data);if(location.hash.startsWith('#entry-'))limit=posts.length;render();if(location.hash.startsWith('#entry-'))document.getElementById(location.hash.slice(1))?.scrollIntoView();}).catch(()=>{$('#status').textContent='The journal could not be loaded. Refresh to try again. If you opened index.html directly, use GitHub Pages or a local web server so entries.json can load.';});
