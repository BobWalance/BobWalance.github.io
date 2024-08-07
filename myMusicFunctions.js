// RBW 8-13-2022 - Added frequency tables next to the 4 buttons.
//                 Harmonics images are all aligned and working properly. Scale button event code made simpler.
//                 Problem fixed thanks to 'I like Serena' on the Physics Forums. See async, setTimeout and Promise.
//
// RBW 8-12-2022 - Working on playHarmonics().

// The 'hidden' attribute in playHarmonics doesn't take effect until the whole button-click-event routine finishes. This is how Javascript works, unfortunately.

// RBW 8-11-2022 - Added window.location.reload(); at the end of playNoteSequence() and that seems to have fixed the issue
//                 of long scales not completing sometimes after they're replayed over-and-over.
// RBW 8-11-2022 - Cleaned up. Long scales don't complete sometimes. It seems to always work when the page is first loaded.
//                 Maybe there's a buffer that needs to be released.
// RBW 8-10-2022 - Tone sequences are working.
// RBW 8-10-2022 - There is now one sound sample array to feed the playSound() routine.

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//
// Add the following line the html file. It will associate this javascript file to it.
//   I put it after: </style> and just before: <script data-source="gwd_webcomponents_v1_min.js" data-version="2" data-exports-type="gwd_webcomponents_v1" src="gwd_webcomponents_v1_min.js"></script>
//  <script src="myMusicFunctions.js"></script>
//
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

/**
 * Play sound in browser
 * @param array - array of values from -1 to +1 representing sound
 * @param sampleRate - sampling rate to play with, e.g. 44100
 */
function playSound({
  array, sampleRate
}) {
  // We have to start with creating AudioContext
  const audioContext = new AudioContext({
    sampleRate
  });
  // create audio buffer of the same length as our array
  const audioBuffer = audioContext.createBuffer(1, array.length, sampleRate);
  // this copies our sine wave to the audio buffer
  audioBuffer.copyToChannel(array, 0);
  // some JavaScript magic to actually play the sound
  const source = audioContext.createBufferSource();
  source.connect(audioContext.destination);
  source.buffer = audioBuffer;
  source.start();
//  console.log('playing');
//  console.log(array);
}
////////////////////////////////////////////////
function playNoteOrChord() { // arguments (tone or chord time, freq1, freq2 ...)
  const sampleRate = 44100; // samples per second
  const maxToneTime = 5; // seconds
  
  if (arguments[0] > maxToneTime) {
    alert('The tone(s) time has exceeded its limit');
    return;
  }
  // create the array that holds the tone(s) samples  
  const sineWaveArray = new Float32Array(sampleRate * arguments[0]); // arguments[0] is the tone time
  // and clear the array
  for (let i = 0; i < sineWaveArray.length; i++) {
    sineWaveArray[i] = 0;
  }
  // create the tone samples for all of the frequencies requested
  for(let freq=1; freq < (arguments.length); freq++) {
    for (i = 0; i < sineWaveArray.length; i++) {
      // add in this tone's sample to the array and scale it down so that the maximum value in the array does not exceed 1.0
      sineWaveArray[i] += (Math.sin( (i/sampleRate) * 2 * Math.PI * arguments[freq])) / (arguments.length - 1);
    }
  }
  // now play the tone or chord
  playSound({
    array: sineWaveArray,
    sampleRate
  });

  // TEST - change something in the html file just to see if this works
  //<button id="button_1" class="gwd-button-4rgs">440Hz</button>
  //document.getElementById("button_1").innerHTML = "???";
}
////////////////////////////////////////////////
async function playScale(event) { // arguments (tone-on time, tone-off time, freq1, freq2 ...)
  const maxToneOnTime = 5; // seconds
  const maxToneOffTime = 5; // seconds
  if (arguments[0] > maxToneOnTime) {
    alert('The tone-on time has exceeded its limit');
    return;
  }
  if (arguments[1] > maxToneOffTime) {
    alert('The tone-off time has exceeded its limit');
    return;
  }
  // play each note of the scale
  for(let toneFreq=2; toneFreq < (arguments.length); toneFreq++) {
    playNoteOrChord(arguments[0],arguments[toneFreq]); // play the next note in the scale
    await sleep(1000*(arguments[0]+arguments[1])); // wait for the tone (plus its off-time) to end before proceeding
  }
  //window.location.reload(); // 8-11-2022 - reloading the page solved the repeating-scales-don't-always-work-properly issue
}
////////////////////////////////////////////////
async function playHarmonics(event) { // see the call to asleep() below
  const maxToneOnTime = 5; // seconds
  const maxToneOffTime = 5; // seconds
  if (arguments[0] > maxToneOnTime) {
    alert('The tone-on time has exceeded its limit');
    return;
  }
  if (arguments[1] > maxToneOffTime) {
    alert('The tone-off time has exceeded its limit');
    return;
  }
  const harmonicImage = ['gwd-img-1e0m','gwd-img-okcl','gwd-img-1lbf','gwd-img-kcsp','gwd-img-131r','gwd-img-p29w','gwd-img-1780','gwd-img-1c1d'];
  var startFreq = 110;
  // play each harmonic and enable the corresponding image
  for(let harmonic=0; harmonic < 8; harmonic++) {
    playNoteOrChord(arguments[0],startFreq * (harmonic + 1) ); // play the harmonic
    // make the wave image for this harmonic visible
    document.getElementsByClassName(harmonicImage[harmonic])[0].style.visibility = 'visible';
    await sleep(1000*(arguments[0]+arguments[1])); // wait for the tone (plus its off-time) to end before proceeding
    // make the wave image for the previous harmonic hidden now that this harmonic has finished playing
    document.getElementsByClassName(harmonicImage[harmonic])[0].style.visibility = 'hidden';
  }
}
////////////////////////////////////////////////
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/*
// // // // // // //
// // // // // // //
function sleep(ms) {
  let end, start, startTime, endTime;
  start = new Date();
  end = new Date();
  startTime = start.getTime();
  endTime = end.getTime();
  while ( startTime < (endTime + ms) ){
    start = new Date();
    startTime = start.getTime();
  }
}
// // // // // // //
// // // // // // //
*/


////////////////////////////////////////////////
// end of code
////////////////////////////////////////////////


