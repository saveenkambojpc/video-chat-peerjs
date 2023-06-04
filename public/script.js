const socket = io('/')
const myPeer = new Peer(undefined, {
    host: "/",
    port: 3001
});

const videoGrid = document.getElementById('video-grid')

const myVideo = document.createElement('video')
myVideo.muted = true

navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: true
})
    .then(stream => {
        addVideoStream(myVideo, stream)

        myPeer.on('call', call => {
            call.answer(stream)
        })

        socket.on('user-connected', userId => {
            connectToNewUser(userId, stream)
        })
    })

myPeer.on('open', clientId => {

    socket.emit('join-room', ROOM_ID, clientId)
})



function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)

}

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)

    const video = document.createElement('video')

    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
        video.remove()
    })

}