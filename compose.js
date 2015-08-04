var fs = require('fs')
var SAMPLE_RATE = 44100
var VOLUME = 30

var header = require("waveheader");
// var tone = require("tonegenerator");

// var tone1 = tone(440, 2);
// var tone2 = tone(554.37, 2);
// var tone3 = tone(659.26, 2);

// // "playing" one tone at the time
// // note that at this time, our sound is just an array 
// // of gain values. By appending the raw PCM data for one after another,
// // we can play them in a sequence
// var res = [].concat(tone1);
// res = res.concat(tone2);
// res = res.concat(tone3);

// // By adding values of the tones for each sample,
// // we play them simultaneously, as a chord
// for(var i = 0; i < tone1.length; i++) {
//   res.push(tone1[i] + tone2[i] + tone3[i]);
// }

// // write to file (note conversion to buffer!)
// var writer = new fs.createWriteStream("A-major.wav");
// writer.write(header( 44100 * 8 )); // 44100 Hz * 8 seconds
// writer.write(new Buffer(res));
// writer.end();

var FREQUENCIES = {
    cis1 : -44, d1   : -43, dis1 : -42,  e1   : -41, f1   : -40,
    fis1 : -39, g1   : -38, gis1 : -37,  a1   : -36, ais1 : -35,
    b1   : -34, c2   : -33, cis2 : -32,  d2   : -31, dis2 : -30,
    e2   : -29, f2   : -28, fis2 : -27,  g2   : -26, gis2 : -25,
    a2   : -24, ais2 : -23, b2   : -22,  c3   : -21, cis3 : -20, 
    d3   : -19, dis3 : -18, e3   : -17,  f3   : -16, fis3 : -15, 
    g3   : -14, gis3 : -13, a3   : -12,  ais3 : -11, b3   : -10, 
    c4   : -9,  cis4 : -8,  d4   : -7,   dis4 : -6,  e4   : -5,  
    f4   : -4,  fis4 : -3,  g4   : -2,   gis4 : -1,  a4   : 0,
    ais4 : 1,   b4   : 2,   c5   : 3,    cis5 : 4,   d5   : 5, 
    dis5 : 6,   e5   : 7,   f5   : 8,    fis5 : 9,   g5   : 10,   
    gis5 : 11,  a5   : 12,  ais5 : 13,   b5   : 14,  c6   : 15,
    cis6 : 16,  d6   : 17,  dis6 : 18,   e6   : 19,  f6   : 20,
    fis6 : 21,  g6   : 22,  gis6 : 23
}

function generateCycle(cycle, volume) {
  var data = [];
  var tmp;
  for(var i = 0; i < cycle; i++) {
    tmp = volume * Math.sin((i/cycle) * Math.PI * 2);
    data[i] = Math.round(tmp);
  }
  return data;
}

function generatePause(sampleLength, volume){
  var data = [];
  for(var i = 0; i < length; i++) {
    data[i] = Math.round(0);
  }
  return data;
}

function note(name, duration){
  var value;
  if(name == 'n'){
    value = {
      freq: 0,
      duration: duration,
    }
  } else {
    value = {
      freq: frequencyOf(FREQUENCIES[name]),
      duration: duration,
    }
  }
  return value;
}

function tone(freq, lengthInSecs) {
  lengthInSecs = lengthInSecs || 2.0;
  var samplesLeft = lengthInSecs * SAMPLE_RATE;
  var volume = VOLUME;
  var ret = [];
  if (freq === 0) {
    ret = generateCycle(samplesLeft, volume);
  } else {
    freq = freq || 440;
    var cycle = Math.floor(SAMPLE_RATE/freq);
    var cycles = samplesLeft/cycle;
    for(var i = 0; i < cycles; i++) {
      ret = ret.concat(generateCycle(cycle, volume));
    }
  }

  return ret;
}

function frequencyOf(step) {
  var power = parseFloat(step) / 12.0
  return 440.0 * (Math.pow(2, power))
}


function compose(score) {
  var scoreLength = 0;
  var wavData = [];
  for (var i = 0; i <score.length; i++) {
    var freq = score[i].freq;
    var duration = score[i].duration;
    console.log(freq)
    console.log(duration)
    wavData =  wavData.concat(tone(freq, duration));
    scoreLength = scoreLength + duration;
  };

  console.log(scoreLength);

  var writer = new fs.createWriteStream("my_score.wav");
  writer.write(header( SAMPLE_RATE * scoreLength )); // 44100 Hz * 8 seconds
  writer.write(new Buffer(wavData));
  writer.end();
}



var score = [
              note('e5', 0.5), note('e5', 0.5), note('n', 0.5), note('e5', 0.5), note('n', 0.5), 
              note('c5', 0.5), note('e5', 0.5), note('n', 0.5), note('g5', 0.5), note('n', 0.5), 
              note('n', 0.5), note('n', 0.5), note('g4', 0.5)
            ]

compose(score);