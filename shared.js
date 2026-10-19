(function(root){
'use strict';
const topics=['Minneapolis','Minnesota','World'];
function wordCount(text){return text.trim()?text.trim().split(/\s+/u).length:0;}
function validDate(s){if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;const d=new Date(s+'T12:00:00Z');return !isNaN(d)&&d.toISOString().slice(0,10)===s;}
function validate(data){
 if(!Array.isArray(data))throw Error('The entries file must contain a JSON array.');
 const seen=new Set();
 return data.map(p=>{
  if(!p||!validDate(p.date)||typeof p.title!=='string'||!p.title.trim()||typeof p.body!=='string'||!p.body.trim()||!topics.includes(p.topic))throw Error('Each entry needs a valid date, title, body, and topic (Minneapolis, Minnesota, or World).');
  if(seen.has(p.date))throw Error('Only one entry is allowed per date: '+p.date);seen.add(p.date);
  return {date:p.date,title:p.title.trim(),topic:p.topic,body:p.body.trim(),...(p.sample===true?{sample:true}:{})};
 }).sort((a,b)=>b.date.localeCompare(a.date));
}
function dateParts(date){const d=new Date(date+'T12:00:00');return {day:d.getDate(),month:d.toLocaleDateString('en-US',{month:'long',year:'numeric'}),weekday:d.toLocaleDateString('en-US',{weekday:'long'}),full:d.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})};}
const api={topics,wordCount,validate,dateParts};root.Digest=api;
if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
