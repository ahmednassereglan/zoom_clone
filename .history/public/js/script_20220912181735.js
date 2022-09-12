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
    audio: true
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


// chat section

let text = $('input')
let namePerson = $('#name_chat_message');
namePerson.html(Math.random().toString(36).substring(2, 9));
// console.log(namePerson[0].innerHTML)
$('html').keydown((e) => { 
    if(e.which == 13 && text.val().length !== 0) {
        socket.emit('message', text.val(), namePerson[0].innerHTML);
        text.val('');
    }
});

socket.on('createMessage' , (message , myName) => {
    $('#chat_messages').append(`<li class="message"><small style="color:lightblue">${myName}</small><br><b>${message}</b></li>`)
    scrollToButton();
    
})



// Function

// let scrollToButton = () => {
//     $('html').scrollTop($('#chat_messages').offset().top);
// }

// let scrollToButton = () => { 
//     $('html').scrollTop($('#chat_messages')
//     );
// }

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

const scrollToButton = () => {
    let d = $('.main__chat_window');
    d.scrollTop(d.prop('scrollHeight'));
}

const muteUnmute = () =>{
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled = false ;
        setUnmuteButton();
    }else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setMuteButton = () =>{
    const html = `
        <i class="fas fa-microphone"></i>
        <span>Mute</span>
    `
    document.querySelector('.main__mute_btn').innerHTML = html;
}

const setUnmuteButton = () =>{
    const html = `
        <i class="unmute fas fa-microphone-slash"></i>
        <span>Unmute</span>
    `
    document.querySelector('.main__mute_btn').innerHTML = html;
}


const playStop = () =>{
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled = false ;
        setPlayVideo();
    }else{
        setStopVideo();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

const setPlayVideo = () =>{
    const html = `
        <i class="fas fa-video"></i>
        <span>Play Video</span>
    `
    document.querySelector('.main__stop_btn').innerHTML = html;
}

const setStopVideo = () =>{
    const html = `
        <i class="unmute fas fa-video-slash"></i>
        <span>Stop Video</span>
    `
    document.querySelector('.main__stop_btn').innerHTML = html;
}












$("#btn__chat").click(function(){
        $(".main__right").toggleClass("main__right_dis");
        $(".main__left").toggleClass("main__left_flx");
    });

// $("#btn__chat").click(function(){
//     $(".main__right").removeClass("main__right_dis");
//     $(".main__right").addClass("dis_none");
//     $(".main__left").removeClass("main__left_flx");
//     $(".main__left").addClass("flx_dis");
// });








