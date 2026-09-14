import {copyFile,mkdir,readFile,writeFile} from "node:fs/promises";
const now=await readFile("now.template.html","utf8"),expo=await readFile("index.template.html","utf8");
await Promise.all([
  mkdir("_site/now/assets",{recursive:true}),
  mkdir("_site/spliveexpo/assets",{recursive:true}),
  writeFile("_site/now/index.html",now),
  writeFile("_site/spliveexpo/index.html",expo),
  copyFile("assets/spla-client.js","_site/now/assets/spla-client.js"),
  copyFile("assets/spla-client.js","_site/spliveexpo/assets/spla-client.js"),
  copyFile("assets/Where.png","_site/now/assets/Where.png"),
  copyFile("assets/bankara-sunset.jpg","_site/spliveexpo/assets/bankara-sunset.jpg"),
  copyFile("favicon.svg","_site/favicon.svg").catch(()=>writeFile("_site/favicon.svg",'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="15" fill="#182437"/><circle cx="32" cy="32" r="18" fill="#d8ff3e"/></svg>')),
  writeFile("_site/index.html",'<!doctype html><meta http-equiv="refresh" content="0; url=./spliveexpo/"><title>すぷらいぶえきすぽ</title><a href="./spliveexpo/">すぷらいぶえきすぽへ移動</a>')
]);