

let currSong = new Audio();

function secondsToMinutesSeconds(seconds){
    if(isNaN(seconds) || seconds<0){
        return "invalid";
    }
    const minutes = Math.floor(seconds/60);
    const remainingSeconds = Math.floor(seconds%60);

    const formattedMinutes = String(minutes).padStart(2,'0');
    const formattedSeconds = String (remainingSeconds).padStart(2,'0');

    return `${formattedMinutes} : ${formattedSeconds}`
}

async function getSongs(){
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let response = await a.text();
    console.log(response);

    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName('a');
    console.log(as);

    let songs = [];
    for(let i = 0; i<as.length; i++){
        let element = as[i];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split('/songs/')[1])
        }
    }
    return songs
    
}

const playMusic = (track,pause = false)=>{
    currSong.src = "/songs/" + track
    if(!pause){
        currSong.play();
        play.classList.remove('fa-play')
        play.classList.add('fa-pause');
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function main(){
    
    
    let songs = await getSongs();
    playMusic(songs[0],true)
    console.log(songs)

    let songUL = document.querySelector(".songs-playlist").getElementsByTagName("ul")[0];

    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + 
        `<li> 
        <div class="music-container">
            <i class="fa-solid fa-music"></i>
            <div class="song-name">${song.replaceAll("%20"," ")}</div>
        </div>
        <div class="play-now"><i id="play2" class="fa-solid fa-play"></i></div> 
        </li>`;
    }

    // Attach event listner to each song
    Array.from(document.querySelector('.songs-playlist').getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click",element=>{
            playMusic(e.getElementsByTagName("div")[1].innerHTML.trim());
        })
    });

    // Attach event listner to play button
    play.addEventListener("click",()=>{
        if(currSong.paused){
            currSong.play();
            play.classList.remove('fa-play')
            play.classList.add('fa-pause');
        }
        else{
            currSong.pause();
            play.classList.remove('fa-pause');
            play.classList.add('fa-play')
        }
    })

    // Attach event listner to update time
    currSong.addEventListener("timeupdate",()=>{
        console.log(currSong.currentTime,currSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currSong.currentTime)} / ${secondsToMinutesSeconds(currSong.duration)} `
        document.querySelector(".seek-bar-circle").style.left = (currSong.currentTime)/(currSong.duration)*100 + "%";
    })

    document.querySelector('.seek-bar').addEventListener("click",(e)=>{
        let percent = (e.offsetX / e.target.getBoundingClientRect().width)*100;
        document.querySelector(".seek-bar-circle").style.left = percent + "%";
        currSong.currentTime = ((currSong.duration)*percent)/100;
    })

    document.querySelector(".hamberger").addEventListener("click",()=>{
        document.querySelector(".left").style.left = 0;
    })

    document.querySelector(".cross").addEventListener("click",()=>{
        document.querySelector(".left").style.left = -120+"%"
    })

}
main();