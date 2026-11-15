// v0.93 procedural map layout: seeded density field with belts and voids; dev test runs unaffected.
const fs=require('fs'),path=require('path'),assert=require('assert');
assert(fs.existsSync(path.join(__dirname,'vendor/simplex-noise-4.0.3/simplex.js'))&&fs.existsSync(path.join(__dirname,'vendor/simplex-noise-4.0.3/LICENSE')));
const prefix=fs.readFileSync(path.join(__dirname,'TEST-EQUIPMENT.cjs'),'utf8').split('assert.equal(run("defs.filter')[0];
eval(prefix+`
run('mapFieldInit(12345)');let grid=[];for(let y=-40;y<40;y++)for(let x=-40;x<40;x++)grid.push(run('mapDensity('+x*300+','+y*300+')'));
assert(grid.every(d=>d>=0&&d<=1),'density in range');let dense=grid.filter(d=>d>.68).length/grid.length,empty=grid.filter(d=>d<.12).length/grid.length;assert(dense>.08&&empty>.08,'belts and voids both exist '+dense+' '+empty);
let a=run('mapDensity(5000,-3000)');run('mapFieldInit(12345)');assert.equal(run('mapDensity(5000,-3000)'),a,'same seed, same map');run('mapFieldInit(999)');assert.notEqual(run('mapDensity(5000,-3000)'),a,'new seed, new map');
fresh();run("s.dev={test:true};mapField.noise=null");assert.equal(run('mapDensity(0,0)'),.5,'test runs keep the uniform layout');
console.log('PASS map noise: bounded density, belts and voids, per-seed layouts, test runs unchanged');
`);
