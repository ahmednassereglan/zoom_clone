// include video config
const videoGrid = document.getElementById('video_grid');
const myVideo = document.createElement('video');
myVideo.muted = true ;

// socket io && peerjs connection  config
const socket = io('/');
var peer = new Peer(undefined,{
    path: 'peerjs',
    host: '/',
    port: '3030'
});

let myVideoStream 
navigator.mediaDevices.getUserMedia({
    video: true ,
    audio: true
}).then(stream => {
    myVideoStream = stream
    addVideoStream(myVideo,stream)
    
    socket.on('user-connected' , (userId) => {
        // console.log('user connected');
        connectToNewUser(userId , stream);
    })
})




peer.on('open',id => {
    socket.emit('join-room' , ROOM_ID, id);
    console.log('Success join-room', ROOM_ID, id);
    
})

// Function
const connectToNewUser = (userId,stream) => {
    console.log(`New user connected \n his id is ${userId}`);
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
       addVideoStream(video,userVideoStream)
    });
}
const addVideoStream = (video, stream) => {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    videoGrid.append(video);
}


