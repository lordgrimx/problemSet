import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const data=JSON.parse(await readFile(new URL('../data/roadmap.json',import.meta.url)));
test('12 weeks have the requested frequency, duration and unique task IDs',()=>{
 assert.equal(data.weeks.length,12);const ids=new Set();
 for(const w of data.weeks){assert.equal(w.tasks.length,12);for(const [cat,n] of Object.entries({js:3,leetcode:3,security:3,lab:1,ds:1,ml:1})){const tasks=w.tasks.filter(t=>t.category===cat);assert.equal(tasks.length,n);assert.equal(new Set(tasks.map(t=>t.day)).size,n)}
 for(const t of w.tasks){assert.ok(!ids.has(t.id));ids.add(t.id);assert.ok(t.day>=0&&t.day<=6);assert.ok(t.steps.length>=2);assert.equal(new URL(t.url).protocol,'https:');if(t.category==='js')assert.ok(t.minutes>=30&&t.minutes<=60)}
 for(let d=0;d<7;d++){const minutes=w.tasks.filter(t=>t.day===d).reduce((n,t)=>n+t.minutes,0);assert.ok(minutes>0&&minutes<=100)}
 }
 assert.equal(ids.size,144);
});
