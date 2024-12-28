const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const connectButton = document.getElementById('connectButton');
const peerIdInput = document.getElementById('peerId');
const connectToPeerIdInput = document.getElementById('connectToPeerId');

let localStream;
let peer;

// Function to generate a short random ID
function generateShortId(length = 6) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// Get the local media stream, including audio
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        localStream = stream;
        localVideo.srcObject = stream;

        // Generate a short peer ID
        const shortId = generateShortId();
        
        // Initialize PeerJS with the short ID
        peer = new Peer(shortId);

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

        // Handle PeerJS errors
        peer.on('error', (err) => {
            console.error('Peer error:', err);
            Swal.fire({
                title: 'Error',
                text: 'Error accessing media devices, Please check the Peer ID and try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
    })
    .catch(error => {
        console.error('Error accessing media devices.', error);
        Swal.fire({
            title: 'Error',
            text: 'Error accessing media devices.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    });

// Handle the connect button click
connectButton.addEventListener('click', () => {
    const peerId = connectToPeerIdInput.value.trim();
    if (peerId === "") {
        Swal.fire({
            title: 'Error',
            text: 'Please enter a valid Peer ID.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    // Check if the peer exists before making the call
    const conn = peer.connect(peerId);
    conn.on('open', () => {
        const call = peer.call(peerId, localStream);
        
        call.on('stream', remoteStream => {
            remoteVideo.srcObject = remoteStream;
        });

        call.on('error', (err) => {
            console.error('Call error:', err);
            Swal.fire({
                title: 'Error',
                text: 'Failed to connect to the peer. Please check the Peer ID and try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });

        call.on('close', () => {
            Swal.fire({
                title: 'Connection Closed',
                text: 'The connection to the peer has been closed.',
                icon: 'info',
                confirmButtonText: 'OK'
            });
        });
    });

    conn.on('error', (err) => {
        console.error('Connection error:', err);
        Swal.fire({
            title: 'Error',
            text: 'Invalid Peer ID. Please check the Peer ID and try again.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    });
});

// Show SweetAlert instruction popup on page load
window.addEventListener('load', () => {
    Swal.fire({
        title: 'Welcome to PeerJS Video Call!',
        text: 'To start a video call, copy your Peer ID and share it with your friend. Once they enter your Peer ID, the call will automatically connect.',
        icon: 'info',
        confirmButtonText: 'Got it!'
    });
});