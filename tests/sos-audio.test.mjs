import test from 'node:test';
import assert from 'node:assert/strict';
import { AudioAdapter } from '../src/adapters/platform.js';

class FakeAudioParam {
  constructor(){this.values=[];}
  setValueAtTime(value,at){this.values.push({value,at});}
  exponentialRampToValueAtTime(value,at){this.values.push({value,at,ramp:true});}
  cancelScheduledValues() {}
}
class FakeOscillator {
  constructor(){this.frequency=new FakeAudioParam();this.type='sine';this.onended=null;this.started=false;this.stopped=false;}
  connect(){return this;}
  disconnect(){}
  start(){this.started=true;}
  stop(){this.stopped=true;queueMicrotask(()=>this.onended?.());}
}
class FakeGain {
  constructor(){this.gain=new FakeAudioParam();}
  connect(){return this;}
  disconnect(){}
}
let currentFakeContext;
class FakeAudioContext {
  constructor(){this.state='suspended';this.currentTime=1;this.destination={};this.oscillators=[];currentFakeContext=this;}
  async resume(){this.state='running';}
  createOscillator(){const node=new FakeOscillator();this.oscillators.push(node);return node;}
  createGain(){return new FakeGain();}
}

test('SOS audio adapter unlocks on user gesture and starts a repeating two-note bell alarm',async()=>{
  const originalWindow=globalThis.window;
  globalThis.window={AudioContext:FakeAudioContext};
  try{
    assert.equal(await AudioAdapter.prepare(),true,'audio context should resume during pointerdown/click');
    assert.equal(await AudioAdapter.startSosAlarm(),true,'SOS alarm should start when audio is available');
    assert.equal(AudioAdapter.isSosAlarmPlaying(),true);
    assert.equal(currentFakeContext.oscillators.length,4,'two bell notes each use a fundamental and overtone oscillator');
    const frequencies=currentFakeContext.oscillators.map(osc=>osc.frequency.values[0]?.value);
    assert.ok(frequencies.includes(880),'first bell note is scheduled');
    assert.ok(frequencies.includes(1174.66),'second bell note is scheduled');
    assert.ok(currentFakeContext.oscillators.every(osc=>osc.started),'all bell oscillators start');
    await AudioAdapter.stopSosAlarm();
    assert.equal(AudioAdapter.isSosAlarmPlaying(),false,'alarm should stop on mute/acknowledge/resolve');
  } finally {
    AudioAdapter.stopSosAlarm();
    if(originalWindow===undefined)delete globalThis.window;else globalThis.window=originalWindow;
  }
});

test('SOS audio adapter safely falls back when Web Audio is not supported',async()=>{
  const originalWindow=globalThis.window;
  globalThis.window={};
  try {
    assert.equal(await AudioAdapter.prepare(),false);
    assert.equal(await AudioAdapter.startSosAlarm(),false);
    assert.equal(AudioAdapter.isSosAlarmPlaying(),false);
  } finally {
    if(originalWindow===undefined)delete globalThis.window;else globalThis.window=originalWindow;
  }
});
