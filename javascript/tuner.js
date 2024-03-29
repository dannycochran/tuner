(function() {
  var Tuner, frequencies, root,
    __hasProp = {}.hasOwnProperty;

  frequencies = {
    'A0': 27.5,
    'A1': 55,
    'A2': 110,
    'A3': 220,
    'A4': 440,
    'A5': 880,
    'A6': 1760,
    'A7': 3520.00,
    'A#0': 29.1352,
    'A#1': 58.2705,
    'A#2': 116.541,
    'A#3': 233.082,
    'A#4': 466.164,
    'A#5': 932.328,
    'A#6': 1864.66,
    'A#7': 3729.31,
    'B0': 30.8677,
    'B1': 61.7354,
    'B2': 123.471,
    'B3': 246.942,
    'B4': 493.883,
    'B5': 987.767,
    'B6': 1975.53,
    'B7': 3951.07,
    'C1': 32.7032,
    'C2': 65.4064,
    'C3': 130.813,
    'C4': 261.626,
    'C5': 523.251,
    'C6': 1046.50,
    'C7': 2093,
    'C8': 4186.01,
    'C#1': 34.6478,
    'C#2': 69.2957,
    'C#3': 138.591,
    'C#4': 277.183,
    'C#5': 554.365,
    'C#6': 1108.73,
    'C#7': 2217.46,
    'D1': 36.7081,
    'D2': 73.4162,
    'D3': 146.832,
    'D4': 293.665,
    'D5': 587.330,
    'D6': 1174.66,
    'D7': 2349.32,
    'D#1': 38.8909,
    'D#2': 77.7817,
    'D#3': 155.563,
    'D#4': 311.127,
    'D#5': 622.254,
    'D#6': 1244.51,
    'D#7': 2489.02,
    'E1': 41.2034,
    'E2': 82.4069,
    'E3': 164.814,
    'E4': 329.628,
    'E5': 659.255,
    'E6': 1318.51,
    'E7': 2637.02,
    'F1': 43.6563,
    'F2': 87.3071,
    'F3': 174.614,
    'F4': 349.228,
    'F5': 698.456,
    'F6': 1396.91,
    'F7': 2793.83,
    'F#1': 46.2493,
    'F#2': 92.4986,
    'F#3': 184.997,
    'F#4': 369.994,
    'F#5': 739.989,
    'F#6': 1479.98,
    'F#7': 2959.96,
    'G1': 48.9994,
    'G2': 97.9989,
    'G3': 195.998,
    'G4': 391.995,
    'G5': 783.991,
    'G6': 1567.98,
    'G7': 3135.96,
    'G#1': 51.9131,
    'G#': 103.826,
    'G#3': 207.652,
    'G#4': 415.305,
    'G#5': 830.609,
    'G#6': 1661.22,
    'G#7': 3322.44
  };

  Tuner = function() {
    var audioContext, buffer, bufferFillSize, bufferFiller, canvas, context, error, fft, fftSize, gauss, hp, i, lp, sampleRate, success;
    window.AudioContext = (function() {
      return window.AudioContext || window.mozAudioContext || window.webkitAudioContext || window.msAudioContext || window.oAudioContext;
    })();
    if (!window.AudioContext) {
      alert('THIS TUNER REQUIRES THE LATEST BUILD OF CHROME CANARY (23/09/2012) ON MAC WITH "Web Audio Input" ENABLED IN chrome://flags.');
    }
    navigator.getUserMedia = (function() {
      return navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
    })();
    if (!navigator.getUserMedia) {
      alert('THIS TUNER REQUIRES THE LATEST BUILD OF CHROME CANARY (23/09/2012) ON MAC WITH "Web Audio Input" ENABLED IN chrome://flags.');
    }
    audioContext = new AudioContext();
    sampleRate = audioContext.sampleRate;
    fftSize = 8192;
    fft = new FFT(fftSize, sampleRate / 4);
    buffer = (function() {
      var _i, _results;
      _results = [];
      for (i = _i = 0; 0 <= fftSize ? _i < fftSize : _i > fftSize; i = 0 <= fftSize ? ++_i : --_i) {
        _results.push(0);
      }
      return _results;
    })();
    bufferFillSize = 2048;
    bufferFiller = audioContext.createJavaScriptNode(bufferFillSize, 1, 1);
    bufferFiller.onaudioprocess = function(e) {
      var b, input, _i, _j, _ref, _ref1, _results;
      input = e.inputBuffer.getChannelData(0);
      for (b = _i = bufferFillSize, _ref = buffer.length; bufferFillSize <= _ref ? _i < _ref : _i > _ref; b = bufferFillSize <= _ref ? ++_i : --_i) {
        buffer[b - bufferFillSize] = buffer[b];
      }
      _results = [];
      for (b = _j = 0, _ref1 = input.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; b = 0 <= _ref1 ? ++_j : --_j) {
        _results.push(buffer[buffer.length - bufferFillSize + b] = input[b]);
      }
      return _results;
    };
    gauss = new WindowFunction(DSP.GAUSS);
    lp = audioContext.createBiquadFilter();
    lp.type = lp.LOWPASS;
    lp.frequency = 8000;
    lp.Q = 0.1;
    hp = audioContext.createBiquadFilter();
    hp.type = hp.HIGHPASS;
    hp.frequency = 20;
    hp.Q = 0.1;
    success = function(stream) {
      var display, getPitch, maxPeakCount, maxPeaks, maxTime, noiseCount, noiseThreshold, process, render, src;
      maxTime = 0;
      noiseCount = 0;
      noiseThreshold = -Infinity;
      maxPeaks = 0;
      maxPeakCount = 0;
      try {
        src = audioContext.createMediaStreamSource(stream);
        src.connect(lp);
        lp.connect(hp);
        hp.connect(bufferFiller);
        bufferFiller.connect(audioContext.destination);
        process = function() {
          var b, bufferCopy, diff, downsampled, firstFreq, freq, interp, left, noiseThrehold, note, p, peak, peaks, q, right, s, secondFreq, spectrumPoints, thirdFreq, upsampled, x, _i, _j, _k, _l, _len, _m, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
          bufferCopy = (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = buffer.length; _i < _len; _i++) {
              b = buffer[_i];
              _results.push(b);
            }
            return _results;
          })();
          gauss.process(bufferCopy);
          downsampled = [];
          for (s = _i = 0, _ref = bufferCopy.length; _i < _ref; s = _i += 4) {
            downsampled.push(bufferCopy[s]);
          }
          upsampled = [];
          for (_j = 0, _len = downsampled.length; _j < _len; _j++) {
            s = downsampled[_j];
            upsampled.push(s);
            upsampled.push(0);
            upsampled.push(0);
            upsampled.push(0);
          }
          fft.forward(upsampled);
          if (noiseCount < 10) {
            noiseThreshold = _.reduce(fft.spectrum, (function(max, next) {
              if (next > max) {
                return next;
              } else {
                return max;
              }
            }), noiseThreshold);
            noiseThrehold = noiseThreshold > 0.001 ? 0.001 : noiseThreshold;
            noiseCount++;
          }
          spectrumPoints = (function() {
            var _k, _ref1, _results;
            _results = [];
            for (x = _k = 0, _ref1 = fft.spectrum.length / 4; 0 <= _ref1 ? _k < _ref1 : _k > _ref1; x = 0 <= _ref1 ? ++_k : --_k) {
              _results.push({
                x: x,
                y: fft.spectrum[x]
              });
            }
            return _results;
          })();
          spectrumPoints.sort(function(a, b) {
            return b.y - a.y;
          });
          peaks = [];
          for (p = _k = 0; _k < 8; p = ++_k) {
            if (spectrumPoints[p].y > noiseThreshold * 5) {
              peaks.push(spectrumPoints[p]);
            }
          }
          if (peaks.length > 0) {
            for (p = _l = 0, _ref1 = peaks.length; 0 <= _ref1 ? _l < _ref1 : _l > _ref1; p = 0 <= _ref1 ? ++_l : --_l) {
              if (peaks[p] != null) {
                for (q = _m = 0, _ref2 = peaks.length; 0 <= _ref2 ? _m < _ref2 : _m > _ref2; q = 0 <= _ref2 ? ++_m : --_m) {
                  if (p !== q && (peaks[q] != null)) {
                    if (Math.abs(peaks[p].x - peaks[q].x) < 5) {
                      peaks[q] = null;
                    }
                  }
                }
              }
            }
            peaks = (function() {
              var _len1, _n, _results;
              _results = [];
              for (_n = 0, _len1 = peaks.length; _n < _len1; _n++) {
                p = peaks[_n];
                if (p != null) {
                  _results.push(p);
                }
              }
              return _results;
            })();
            peaks.sort(function(a, b) {
              return a.x - b.x;
            });
            maxPeaks = maxPeaks < peaks.length ? peaks.length : maxPeaks;
            if (maxPeaks > 0) {
              maxPeakCount = 0;
            }
            peak = null;
            firstFreq = peaks[0].x * (sampleRate / fftSize);
            if (peaks.length > 1) {
              secondFreq = peaks[1].x * (sampleRate / fftSize);
              if ((1.4 < (_ref3 = firstFreq / secondFreq) && _ref3 < 1.6)) {
                peak = peaks[1];
              }
            }
            if (peaks.length > 2) {
              thirdFreq = peaks[2].x * (sampleRate / fftSize);
              if ((1.4 < (_ref4 = firstFreq / thirdFreq) && _ref4 < 1.6)) {
                peak = peaks[2];
              }
            }
            if (peaks.length > 1 || maxPeaks === 1) {
              if (!(peak != null)) {
                peak = peaks[0];
              }
              left = {
                x: peak.x - 1,
                y: Math.log(fft.spectrum[peak.x - 1])
              };
              peak = {
                x: peak.x,
                y: Math.log(fft.spectrum[peak.x])
              };
              right = {
                x: peak.x + 1,
                y: Math.log(fft.spectrum[peak.x + 1])
              };
              interp = 0.5 * ((left.y - right.y) / (left.y - (2 * peak.y) + right.y)) + peak.x;
              freq = interp * (sampleRate / fftSize);
              _ref5 = getPitch(freq), note = _ref5[0], diff = _ref5[1];
              display.draw(note, diff,freq);
            }
          } else {
            maxPeaks = 0;
            maxPeakCount++;
            if (maxPeakCount > 20) {
              display.clear();
            }
          }
        };
      } catch (e) {
        error(e);
      }
      getPitch = function(freq) {
        var diff, key, minDiff, note, val;
        minDiff = Infinity;
        diff = Infinity;
        for (key in frequencies) {
          if (!__hasProp.call(frequencies, key)) continue;
          val = frequencies[key];
          if (Math.abs(freq - val) < minDiff) {
            minDiff = Math.abs(freq - val);
            diff = freq - val;
            note = key;
          }
        }
        return [note, diff];
      };
      
      var notesArray = [];
      
      display = {
        draw: function(note, diff,freq) {
          var displayStr;
          note = note.replace(/[0-9]*/g, '');          
          notesArray.push(note.replace('#','sharp')); 
          // take most frequent of last three notes and return it to user, need to optimize this for frequency too
          if (notesArray.length>=3) {				
			    var modeMap = {};
			    var mode = notesArray[0], maxCount = 1;
			    for(var i = 0; i < notesArray.length; i++)
			    {
			    	var modeFinder = notesArray[i];
			    	if(modeMap[modeFinder] == null)
			    		modeMap[modeFinder] = 1;
			    	else
			    		modeMap[modeFinder]++;	
			    	if(modeMap[modeFinder] > maxCount)
			    	{
			    		mode = modeFinder;
			    		maxCount = modeMap[modeFinder];
			    	}
			    }
			globals.callPaperTuner(mode,freq,diff); // calls function in paperTuner
			globals.startAnimate=1;
			notesArray = [];
          }
        }
      };
      return setInterval(process, 100);
    };
    
    error = function(e) {
      console.log(e);
      console.log('ARE YOU USING CHROME CANARY (23/09/2012) ON A MAC WITH "Web Audio Input" ENABLED IN chrome://flags?');
      return alert('ERROR: CHECK ERROR CONSOLE');
    };
    return navigator.getUserMedia({
      audio: true
    }, success, error);
  };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.Tuner = Tuner;

}).call(this);
