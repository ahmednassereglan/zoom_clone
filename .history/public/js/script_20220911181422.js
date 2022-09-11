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
 
// socket io config
const socket = io('/');
socket.emit('join-room' , ROOM_ID);
socket.on('user-connected' , () => {
    // console.log('user connected');
    connectToNewUser();
})

const connectToNewUser = () => {
    // socket.emit('join-room' , ROOM_ID);
    // myVideo.play();
    // myVideoStream.play();
    // myVideo.muted = true;
    // myVideoStream.muted = true
    console.log('New user connected');
}


// peer js config
var peer = new Peer();