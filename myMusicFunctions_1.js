// RBW 8-5-2024  - Had to cast the toneOnTime in the Play Harmonics function using "+" (the unary plus operator)
// RBW 8-2-2024  - file is now myMusicFunctions_1.js
//                 Will now have control over the amplitude of each tone.
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
function playNoteOrChord() { // arguments (tone or chord time, freq1, A1, freq2, A2 ...) // RBW 8-2-2024 added A1, A2... for amplitude control
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
  for(let freq=1; freq < (arguments.length); freq+=2) { // RBW 8-2-2024 - skip over the tone's amplitude value to get to the next tone's frequency value
    Amplitude = arguments[freq+1]; // RBW 8-2-2024 - get the amplitude (1 for full amplitude, 0 for zero amplitude) for this tone
    for (i = 0; i < sineWaveArray.length; i++) {
      // add in this tone's sample to the array and scale it down so that the maximum value in the array does not exceed 1.0
      sineWaveArray[i] += (Math.sin( (i/sampleRate) * 2 * Math.PI * arguments[freq])) * Amplitude / (arguments.length - 1); // RBW 8-2-2-24 - added Amplitude
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
  var A = 1; // RBW 8-2-2024
  for(let toneFreq=2; toneFreq < (arguments.length); toneFreq++) {
    playNoteOrChord(arguments[0],arguments[toneFreq], A); // play the next note in the scale -- RBW 8-2-2024 added the amplitude
    await sleep(1000*(arguments[0]+arguments[1])); // wait for the tone (plus its off-time) to end before proceeding
  }
  //window.location.reload(); // 8-11-2022 - reloading the page solved the repeating-scales-don't-always-work-properly issue
}
////////////////////////////////////////////////
async function playHarmonics(event) { // see the call to asleep() below
  const maxToneOnTime = 5; // seconds
  const maxToneOffTime = 5; // seconds


  // RBW 5-8-2024 - For some UNKNOWN reason, when the ON time is retrieved from a user-defined box in the GUI, the value must be cast to a number using "+" (the unary plus operator).
  //                Otherwise, when the ON time is added to the OFF time, the ON time used is TEN TIMES the retrieved value. Very weird!
  toneOnTime = +arguments[0];
  toneOffTime = +arguments[1];




  if (toneOnTime > maxToneOnTime) {
    alert('The tone-on time has exceeded its limit');
    return;
  }
  if (toneOffTime > maxToneOffTime) {
    alert('The tone-off time has exceeded its limit');
    return;
  }
  //const harmonicImage = ['gwd-img-1e0m','gwd-img-okcl','gwd-img-1lbf','gwd-img-kcsp','gwd-img-131r','gwd-img-p29w','gwd-img-1780','gwd-img-1c1d'];

  // RBW 8-2-2024 - Had to 'file-import assets' for the eight .png files,
  //                then look at the .html file to get the corresponding 'gwd-image-*' names (use the first one listed for each of the 8 images)
  //                finally Library - and drag the 8 images to the workspace. Must also resize them and make them 'invisible'.


  // RBW 8-7-2024 -- this is copied from the version2.html file




  //<gwd-image source="assets/1c50h.png" scaling="stretch" id="1c50h" class="gwd-image-1wyv gwd-image-v164"></gwd-image>
  //<gwd-image source="assets/2c50h.png" scaling="stretch" id="2c50h" class="gwd-image-1n9x gwd-image-1tfr"></gwd-image>
  //<gwd-image source="assets/8c50h.png" scaling="stretch" id="8c50h" class="gwd-image-1371 gwd-image-c8gg"></gwd-image>
  //<gwd-image source="assets/7c50h.png" scaling="stretch" id="7c50h" class="gwd-image-129n gwd-image-1a0d"></gwd-image>
  //<gwd-image source="assets/6c50h.png" scaling="stretch" id="6c50h" class="gwd-image-7t3h gwd-image-ash2"></gwd-image>
  //<gwd-image source="assets/5c50h.png" scaling="stretch" id="5c50h" class="gwd-image-15f7 gwd-image-17lg"></gwd-image>
  //<gwd-image source="assets/4c50h.png" scaling="stretch" id="4c50h" class="gwd-image-1ovu gwd-image-12rl"></gwd-image>
  //<gwd-image source="assets/3c50h.png" scaling="stretch" id="3c50h_1" class="gwd-image-1iv4 gwd-image-h0dw"></gwd-image>




// RBW 8-2-2024 - it apparently doesn't matter whether the first "gwd-image-xxxx" entry or the second entry is used
  const harmonicImage = ['gwd-image-1wyv','gwd-image-1n9x','gwd-image-1iv4','gwd-image-1ovu','gwd-image-15f7','gwd-image-7t3h','gwd-image-129n','gwd-image-1371']; // using first in list
 // const harmonicImage = ['gwd-image-qa0u','gwd-image-1vdz','gwd-image-1ypc','gwd-image-45qf','gwd-image-yqa9','gwd-image-1bcd','gwd-image-1j1a','gwd-image-1ip1']; // using the second in the list

  var startFreq = 110;
  var A = 1; // RBW 8-2-2024 - play the tone at full amplitude
  // play each harmonic and enable the corresponding image
  for(let harmonic=0; harmonic < 8; harmonic++) {

    playNoteOrChord(toneOnTime,startFreq * (harmonic + 1), A ); // play the harmonic (8-2-2024 added Amplitude)

    // make the wave image for this harmonic visible
    document.getElementsByClassName(harmonicImage[harmonic])[0].style.visibility = 'visible';

    await sleep(1000*(toneOnTime + toneOffTime)); // wait for the tone (plus its off-time) to end before proceeding

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
// function sleep(ms) {
//   let end, start, startTime, endTime;
//   start = new Date();
//   end = new Date();
//   startTime = start.getTime();
//   endTime = end.getTime();
//   while ( startTime < (endTime + ms) ){
//     start = new Date();
//     startTime = start.getTime();
//   }
// }
// // // // // // //
// // // // // // //
*/


////////////////////////////////////////////////
// end of code
////////////////////////////////////////////////




