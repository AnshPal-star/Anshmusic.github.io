console.log("Let's write JavaScript")
let songs;
let currFolder;
function secondsToMinutes(seconds) {
    if (isNaN(seconds) || seconds <0){
        return "00:00";
    }
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  
  // Pad with leading zeros if necessary
  const formattedMins = String(mins).padStart(2, '0');
  const formattedSecs = String(secs).padStart(2, '0');

  return `${formattedMins}:${formattedSecs}`;
}


// Example usage:
console.log(secondsToMinutes(12));   // Output: "00:12"
console.log(secondsToMinutes(75));   // Output: "01:15"
console.log(secondsToMinutes(3600)); // Output: "60:00"

let currentSongs = new Audio();
async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${folder}/`);
    let response = await a.text();
    console.log(response);

    // Create a temporary element to parse HTML
    let div = document.createElement("div");
    div.innerHTML = response;

    // Get all anchor tags (this is what a directory listing usually returns)
    let links = div.getElementsByTagName("a");
    songs = [];

    for (let index = 0; index < links.length; index++) {
        const element = links[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }


    //   show all the songs in the playlists
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> 
                        <img class="invert" src="music.svg" alt="">
                        <div class="songinfo">
                            <div> ${song.replaceAll("%20", " ")} </div>
                            <div>Ansh</div>
                        </div>
                        <div class="playnow">
                          
                       <img class="invert" src="play.svg" alt="">
                        </div>
                       </li>`;
    }
    //Attach an event listner to each songs
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {

            playmusic(e.querySelector(".songinfo").firstElementChild.innerHTML.trim("%20"))
        })
    })
  return songs
}

const playmusic = (track) => {
    currentSongs.src =` /${currFolder}/` + track
    currentSongs.play()
    play.src = "pause.svg"
    document.querySelector(".info").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"


}

async function displayAlbums() {
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardcontainer = document.querySelector(".cardcontainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) { 
            let folder = e.href.split("/").slice(-1)[0]
            // Get metedata of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json();
            console.log(response)
            cardcontainer.innerHTML = cardcontainer.innerHTML + `<div  data-folder="${folder}" class="card ">
                        <div class="play"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%"
                                height="100%">
                                <!-- Green circular background -->
                                <circle cx="12" cy="12" fill="green" />

                                <!-- Black icon -->
                                <path  
                                    d="M13.852,6.287 L13.941,6.337 C15.573,7.265 16.857,7.994 17.771,8.662 C18.691,9.334 19.372,10.037 19.616,10.963 C19.795,11.643 19.795,12.357 19.616,13.037 C19.372,13.963 18.691,14.666 17.771,15.339 C16.857,16.006 15.573,16.735 13.941,17.663 L13.852,17.713 C12.275,18.61 11.033,19.315 10.023,19.744 C9.005,20.177 8.077,20.397 7.175,20.141 C6.513,19.953 5.909,19.597 5.424,19.107 C4.764,18.441 4.5,17.522 4.374,16.415 C4.25,15.317 4.25,13.879 4.25,12.05 L4.25,11.95 C4.25,10.121 4.25,8.683 4.374,7.585 C4.5,6.478 4.764,5.559 5.424,4.893 C5.909,4.403 6.513,4.047 7.175,3.859 C8.077,3.603 9.005,3.823 10.023,4.256 C11.033,4.685 12.275,5.391 13.852,6.287 Z M9.436,5.636 C8.514,5.244 7.984,5.189 7.584,5.302 C7.171,5.419 6.794,5.642 6.489,5.949 C6.192,6.249 5.979,6.747 5.865,7.753 C5.751,8.757 5.75,10.11 5.75,12 C5.75,13.89 5.751,15.243 5.865,16.247 C5.979,17.253 6.192,17.751 6.489,18.051 C6.794,18.358 7.171,18.581 7.584,18.698 C7.984,18.811 8.514,18.756 9.436,18.364 C10.357,17.972 11.524,17.311 13.155,16.384 C14.842,15.426 16.05,14.738 16.886,14.127 C17.724,13.515 18.056,13.072 18.165,12.655 C18.278,12.226 18.278,11.774 18.165,11.345 C18.056,10.929 17.724,10.485 16.886,9.873 C16.05,9.262 14.842,8.574 13.155,7.616 C11.524,6.689 10.357,6.028 9.436,5.636 Z" />
                            </svg>
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${response.tittle}</h2>
                        <p>${response.description}</p>
                    </div>`
        }
    }


    //add load the playlist whenever the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log(item.target, item.currentTarget.dataset)
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
           playmusic(songs[0])

        })

    })

}
async function main() {
    //get list of all songs
    await getSongs("songs/ncs");
    // console.log(songs);
    playmusic(songs[0], true)

    // display all the album on the  page
    displayAlbums()
    //Attach an Event listner to play,previous and next
    play.addEventListener("click", () => {
        if (currentSongs.paused) {
            currentSongs.play()
            play.src = "pause.svg"
        }
        else {
            currentSongs.pause()
            play.src = "play.svg"
        }
    })

    //Listen for time update event
    currentSongs.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutes(currentSongs.currentTime)}/${secondsToMinutes(currentSongs.duration)} `
        document.querySelector(".circle").style.left = (currentSongs.currentTime / currentSongs.duration) * 100 + "%";
    })
    //add an event listner to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSongs.currentTime = ((currentSongs.duration) * percent) / 100
    })

    //Add an Event listner for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    //Add an Event listner for close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    //Add an Event listner to previous and next
    previous.addEventListener("click", () => {
        console.log("Previous Clicked")
        let index = songs.indexOf(currentSongs.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playmusic(songs[index - 1])
        }
    })
    //Add an Event listner to previous and next
    next.addEventListener("click", () => {
        console.log("Next Clicked")

        let index = songs.indexOf(currentSongs.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1])
        }
    })
    //add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",
        (e) => {
            console.log("Setting volume to", e.target.value, "/100")
            currentSongs.volume = parseInt(e.target.value) / 100
        })

         //Attach an Event listner to mute and unmute
         document.querySelector(".volume>img").addEventListener("click", e=>{
            console.log(e.target)
            if(e.target.src.includes("volume.svg")){
               e.target.src = e.target.src.replace("volume.svg","mute.svg")
                currentSongs.volume = 0;
                document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
            }
            else{
                e.target.src = e.target.src.replace("mute.svg","volume.svg")
                currentSongs.volume = .30;
                document.querySelector(".range").getElementsByTagName("input")[0].value = 30;
            }
         })
         


}

main();;