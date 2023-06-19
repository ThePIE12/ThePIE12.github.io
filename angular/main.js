function formatTime(timeInSeconds) {
    var minutes = Math.floor(timeInSeconds / 60);
    var seconds = Math.floor(timeInSeconds % 60);
    
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    
    return minutes + ':' + seconds;
}

function adjustVolume() {
    songAPlayer.volume = Math.max(0, Math.min(1, (1 - volumeSlider.value * 0.5))) * masterVolumeSlider.value;
    songBPlayer.volume = Math.max(0, Math.min(1, (volumeSlider.value * 0.5))) * masterVolumeSlider.value;
    
    let mixPercentage = volumeSlider.value * 50;
    if(volumeSlider.value < 1){
        mixStatus.textContent = "Mix Status: " + (100 - mixPercentage).toFixed(0) + "% A, " + mixPercentage.toFixed(0) + "% B";
    } else {
        mixStatus.textContent = "Mix Status: " + (100 - mixPercentage).toFixed(0) + "% A, " + mixPercentage.toFixed(0) + "% B";
    }
}

window.onload = function() {
    var songAInput = document.getElementById('songAInput');
    var songBInput = document.getElementById('songBInput');
    var songAPlayer = document.getElementById('songAPlayer');
    var songBPlayer = document.getElementById('songBPlayer');
    var volumeSlider = document.getElementById('volumeSlider');
    var playButton = document.getElementById('playButton');
    var pauseButton = document.getElementById('pauseButton');
    var mixLeftButton = document.getElementById('mixLeftButton');
    var mixCenterButton = document.getElementById('mixCenterButton');
    var mixRightButton = document.getElementById('mixRightButton');
    var mixStatus = document.getElementById('mixStatus');
    var songADuration = 0;
    var songBDuration = 0;
    var maxDuration = 0;
    var longestPlayer;
    var seekerSlider = document.getElementById('seekerSlider');

    mixLeftButton.onclick = function() {
        volumeSlider.value = 0;
        adjustVolume();
    }

    mixCenterButton.onclick = function() {
        volumeSlider.value = 1;
        adjustVolume();
    }

    mixRightButton.onclick = function() {
        volumeSlider.value = 2;
        adjustVolume();
    }


    songAInput.onchange = function(e) {
        var file = e.target.files[0];
        songAPlayer.src = URL.createObjectURL(file);
        songAPlayer.onloadedmetadata = function() {
            songADuration = songAPlayer.duration;
            maxDuration = Math.max(songADuration, songBDuration);
            seekerSlider.max = maxDuration;
            if(songADuration >= songBDuration){
                longestPlayer = songAPlayer;
                longestPlayer.ontimeupdate = function() {
                    if (!seekerSlider.dragging) {
                        seekerSlider.value = longestPlayer.currentTime;
                        document.getElementById('seekerStatus').textContent = formatTime(longestPlayer.currentTime) + ' / ' + formatTime(maxDuration);
                    }
                };
            }
        }
        // Update the volume according to the sliders
        songAPlayer.volume = (1 - volumeSlider.value * 0.5) * masterVolumeSlider.value;
    }

    songBInput.onchange = function(e) {
        var file = e.target.files[0];
        songBPlayer.src = URL.createObjectURL(file);
        songBPlayer.onloadedmetadata = function() {
            songBDuration = songBPlayer.duration;
            maxDuration = Math.max(songADuration, songBDuration);
            seekerSlider.max = maxDuration;
            if(songBDuration > songADuration){
                longestPlayer = songBPlayer;
                longestPlayer.ontimeupdate = function() {
                    if (!seekerSlider.dragging) {
                        seekerSlider.value = longestPlayer.currentTime;
                        document.getElementById('seekerStatus').textContent = formatTime(longestPlayer.currentTime) + ' / ' + formatTime(maxDuration);
                    }
                };
            }
        }
        
        // Update the volume according to the sliders
        songBPlayer.volume = (volumeSlider.value * 0.5) * masterVolumeSlider.value;
    }
    
    seekerSlider.oninput = function() {
        var seekValue = parseFloat(this.value);
        document.getElementById('seekerStatus').textContent = formatTime(seekValue) + ' / ' + formatTime(maxDuration);

        if(seekValue <= songADuration){
            songAPlayer.currentTime = seekValue;
        } else if(!songAPlayer.paused){
            songAPlayer.pause();
        }
        
        if(seekValue <= songBDuration){
            songBPlayer.currentTime = seekValue;
        } else if(!songBPlayer.paused){
            songBPlayer.pause();
        }
    };
    
    volumeSlider.onchange = volumeSlider.oninput = function() {
        var mixValue = parseFloat(this.value);
        songAPlayer.volume = Math.max(1 - 0.5 * mixValue, 0) * masterVolumeSlider.value;
        songBPlayer.volume = Math.max(0.5 * mixValue, 0) * masterVolumeSlider.value;
        adjustVolume();
    };

    var masterVolumeSlider = document.getElementById('masterVolumeSlider');

    masterVolumeSlider.oninput = function() {
        var masterVolume = parseFloat(this.value);
        songAPlayer.volume = Math.max(1 - 0.5 * volumeSlider.value, 0) * masterVolume;
        songBPlayer.volume = Math.max(0.5 * volumeSlider.value, 0) * masterVolume;
    };


    playButton.onclick = function() {
        songAPlayer.play();
        songBPlayer.play();
    };

    pauseButton.onclick = function() {
        songAPlayer.pause();
        songBPlayer.pause();
    };
}
