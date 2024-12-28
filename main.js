const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const connectButton = document.getElementById('connectButton');
const peerIdInput = document.getElementById('peerId');
const connectToPeerIdInput = document.getElementById('connectToPeerId');

let localStream;
let peer;

// Get the local media stream
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        localStream = stream;
        localVideo.srcObject = stream;

        // Initialize PeerJS
        peer = new Peer();

        // Display the peer ID
        peer.on('open', id => {
            peerIdInput.value = id;
        });

        // Handle incoming calls
        peer.on('call', call => {
            call.answer(localStream); // Answer the call with the local stream
            call.on('stream', remoteStream => {
                remoteVideo.srcObject = remoteStream;
            });
        });
    })
    .catch(error => {
        console.error('Error accessing media devices.', error);
    });

// Handle the connect button click
connectButton.addEventListener('click', () => {
    const peerId = connectToPeerIdInput.value;
    const call = peer.call(peerId, localStream); // Initiate a call to the other peer
    call.on('stream', remoteStream => {
        remoteVideo.srcObject = remoteStream;
    });
});