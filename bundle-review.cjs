const fs=require('fs');
const data=s=>'data:text/javascript;base64,'+Buffer.from(s).toString('base64');
const core=data(fs.readFileSync('vendor/three-0.187.0/three.core.js','utf8'));
const three=data(fs.readFileSync('vendor/three-0.187.0/three.module.js','utf8').replaceAll("'./three.core.js'",JSON.stringify(core)));
const authored=data(fs.readFileSync('vanguard-model.js','utf8'));
const moduleURL=path=>data(fs.readFileSync(path,'utf8').replace("new URL('./vendor/three-0.187.0/three.module.js', import.meta.url).href",JSON.stringify(three)).replace("'./vanguard-model.js'",JSON.stringify(authored)));
const ship=moduleURL('ship3d-v1100.js'),before=moduleURL('ship3d-baseline.js');
let html=fs.readFileSync('ship-review.html','utf8').replace("'./ship3d-v1100.js'",JSON.stringify(ship)).replace("'./ship3d-baseline.js'",JSON.stringify(before)).replace("await(await fetch('./ship-review-records.json')).json()",fs.readFileSync('ship-review-records.json','utf8'));
fs.writeFileSync('ship-review-standalone.html',html);
