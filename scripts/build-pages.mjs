import {copyFile,mkdir,readFile,writeFile} from "node:fs/promises";
import {createHash} from "node:crypto";
const INK="https://splatoon3.ink/data/schedules.json";
const [now,expo]=await Promise.all([readFile("now.template.html","utf8"),readFile("index.template.html","utf8")]);
await Promise.all([mkdir("_site/now/assets/cache",{recursive:true}),mkdir("_site/spliveexpo/assets/cache",{recursive:true})]);
const cache={};
try{
  const r=await fetch(INK,{headers:{"User-Agent":"terunon/spla Pages build"}});
  if(!r.ok)throw Error("schedule "+r.status);
  const urls=new Set;
  const walk=v=>{if(Array.isArray(v))return v.forEach(walk);if(!v||typeof v!=="object")return;if(v.image?.url)urls.add(v.image.url);for(const x of Object.values(v))walk(x)};
  walk(await r.json());
  await Promise.all([...urls].map(async url=>{try{const image=await fetch(url);if(!image.ok)return;const name=createHash("sha256").update(url).digest("hex")+".png",buf=Buffer.from(await image.arrayBuffer());await Promise.all([writeFile("_site/now/assets/cache/"+name,buf),writeFile("_site/spliveexpo/assets/cache/"+name,buf)]);cache[url]="cache/"+name}catch{}}));
}catch(err){console.warn("画像キャッシュを更新できませんでした:",err.message)}
await Promise.all([
  writeFile("_site/now/index.html",now),
  writeFile("_site/spliveexpo/index.html",expo),
  copyFile("assets/spla-client.js","_site/now/assets/spla-client.js"),
  copyFile("assets/spla-client.js","_site/spliveexpo/assets/spla-client.js"),
  writeFile("_site/now/assets/image-cache.json",JSON.stringify(cache)),
  writeFile("_site/spliveexpo/assets/image-cache.json",JSON.stringify(cache)),
  copyFile("assets/Where.png","_site/now/assets/Where.png"),
  copyFile("assets/bankara-sunset.jpg","_site/spliveexpo/assets/bankara-sunset.jpg"),
  writeFile("_site/favicon.svg",'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="15" fill="#182437"/><circle cx="32" cy="32" r="18" fill="#d8ff3e"/></svg>'),
  writeFile("_site/index.html",'<!doctype html><meta http-equiv="refresh" content="0; url=./spliveexpo/"><title>すぷらいぶえきすぽ</title><a href="./spliveexpo/">すぷらいぶえきすぽへ移動</a>')
]);
console.log("画像キャッシュ:",Object.keys(cache).length,"件");