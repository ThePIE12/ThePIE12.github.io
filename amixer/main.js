function formatTime(timeInSeconds) {
    var minutes = Math.floor(timeInSeconds / 60);
    var seconds = Math.floor(timeInSeconds % 60);
    
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    
    return minutes + ':' + seconds;
}

window.onload = function() {
    var songAInput = document.getElementById('songAInput');
    var songBInput = document.getElementById('songBInput');
    var songAPlayer = document.getElementById('songAPlayer');
    var songBPlayer = document.getElementById('songBPlayer');
    var volumeSlider = document.getElementById('volumeSlider');
    var playButton = document.getElementById('playButton');
    var pauseButton = document.getElementById('pauseButton');
    var songADuration = 0;
    var songBDuration = 0;
    var maxDuration = 0;
    var longestPlayer;
    var seekerSlider = document.getElementById('seekerSlider');

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
    
    volumeSlider.oninput = function() {
        var mixValue = parseFloat(this.value);
        songAPlayer.volume = Math.max(1 - 0.5 * mixValue, 0) * masterVolumeSlider.value;
        songBPlayer.volume = Math.max(0.5 * mixValue, 0) * masterVolumeSlider.value;
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
