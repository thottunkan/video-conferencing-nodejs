const socket = io("/");
const vgrid = document.getElementById("video-grid");
const gridcontainer = document.getElementById("grid-container");
const griditem = document.getElementById("grid-item");
const peers = [];
var currentPeer;
var remotePeer;
var username = '';
const peer = new Peer(undefined, {
  host: "/",
  port: "3001",
  path: "/"

});

const myvideo = document.createElement("video");
myvideo.muted = true;
var mediaStream;
username = prompt("Type your name....");
if (username == undefined) {
  location.replace("about:blank");
}
if (username == '') {
  location.replace("about:blank");
}
navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: true,
  })
  .then((stream) => {
    alert("got video stream click ok...");
    mediaStream = stream;
    addVideoStream(myvideo, stream);
    peer.on("call", (call) => {
      call.answer(stream);
      currentPeer = call.peerConnection;
      const video = document.createElement("video");
      call.on("stream", (uservideostream) => {
        addVideoStream(video, uservideostream);
        remotePeer = call.peerConnection;
      });
    });

    socket.on("user-connected", (userid, username) => {
      console.log("user connected", userid);
      $.notify(`${username} Connected`, { position: " right center" });
      connectToNewUser(userid, stream);


    });
  });

socket.on("user-disconnected", (userid, username) => {
  if (peers[userid]) {
    peers[userid].close();
    $.notify(`${username} Disonnected`, { position: "right middle" });
  }
});



//invokes when the peer server is initilized 
peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id, username);
});

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  // vgrid.append(video);
  griditem.append(video);
  gridcontainer.append(griditem);

}

function connectToNewUser(userid, stream) {
  const call = peer.call(userid, stream);
  const video = document.createElement("video");
  call.on("stream", (uservideostream) => { //when user answerd 
    addVideoStream(video, uservideostream);
  });
  call.on("close", () => {
    video.remove();
  });
  peers[userid] = call;
}

