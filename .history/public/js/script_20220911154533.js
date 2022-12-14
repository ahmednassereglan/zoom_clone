const { Socket } = require("socket.io");

// include video config
const videoGrid = document.getElementById('video_grid');
const myVideo = document.createElement('video');
myVideo.muted = true ;

let myVideoStream 
navigator.mediaDevices.getUserMedia({
    video: true ,
    audio: true
}).then(stream => {
    myVideoStream = stream
    addVideoStream(myVideo,stream)
})

const addVideoStream = (video, stream) => {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    videoGrid.append(video);
}

// socket io
var socket = io();
socket.emit('join-room');