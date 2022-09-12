// import
const socket = io('/');

// include video config
const videoGrid = document.getElementById('video_grid');
const myVideo = document.createElement('video');
myVideo.muted = true ;

// Peer Config
var peer = new Peer(undefined,{
    path: 'peerjs',
    host: '/',
    port: '3030'
});

// create my video&audio and stream it in screen
let myVideoStream 
navigator.mediaDevices.getUserMedia({
    video: true ,
    audio: false
}).then(stream => {
    myVideoStream = stream 
    addVideoStream(myVideo,stream);

    peer.on('call', (call) => {
        call.answer(stream); // Answer the call with an A/V stream.
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
        addVideoStream(video,userVideoStream)
        })
      })
    
    socket.on('user-connected' , (userId) => {
        console.log('user connected');
        connectToNewUser(userId , stream);
    })
})


// connection config
peer.on('open',id => {
    socket.emit('join-room' , ROOM_ID, id );
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


// chat section

let text = $('input')
// let namePerson = document.getElementById("name_chat_message");
// namePerson.innerHTML = Math.random().toString(36).substring(2, 9);
let namePerson = $('#name_chat_message');
namePerson.html(Math.random().toString(36).substring(2, 9));
console.log(namePerson[0].innerHTML)
$('html').keydown((e) => { 
    if(e.which == 13 && text.val().length !== 0) {
        console.log(text);
        console.log(text.val());
        socket.emit('message', text.val(), namePerson[0].innerHTML);
        text.val('');
    }
});

socket.on('createMessage' , (message , myName) => {
    console.log('this is coming from server' , message , myName);
    $('#chat_messages').append(`<li class="message"><small>${myName}</small><br><b>${message}</b></li>`)

})


