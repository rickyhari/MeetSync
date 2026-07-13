import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import styles from "../styles/videoComponent.module.css";
import Lobby from "../components/Lobby";
import ChatModal from "../components/ChatModal";
import MeetingControls from "../components/MeetingControls";
import LocalVideo from "../components/LocalVideo";
import ConferenceGrid from "../components/ConferenceGrid";

const server_url = "http://localhost:8000";

var connections = {};

const peerConfigConnections = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

export default function VideoMeetComponent() {
  var socketRef = useRef();
  let socketIdRef = useRef();

  let localVideoref = useRef();

  let [videoAvailable, setVideoAvailable] = useState(true);

  let [audioAvailable, setAudioAvailable] = useState(true);

  let [video, setVideo] = useState();

  let [audio, setAudio] = useState();

  let [screen, setScreen] = useState();

  let [showModal, setModal] = useState();

  let [screenAvailable, setScreenAvailable] = useState();

  let [messages, setMessages] = useState([]);

  let [message, setMessage] = useState("");

  let [newMessages, setNewMessages] = useState(0);

  let [askForUsername, setAskForUsername] = useState(true);

  let [username, setUsername] = useState("");

  const videoRef = useRef([]);

  let [videos, setVideos] = useState([]);

  const [participantNames, setParticipantNames] = useState({});

  const [mediaStates, setMediaStates] = useState({});

  const getPermissions = async () => {
    try {
      const videoPermission = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      const hasVideo = !!videoPermission;
      setVideoAvailable(hasVideo);
      setVideo(hasVideo);

      const audioPermission = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const hasAudio = !!audioPermission;
      setAudioAvailable(hasAudio);
      setAudio(hasAudio);

      if (navigator.mediaDevices.getDisplayMedia) {
        setScreenAvailable(true);
      } else {
        setScreenAvailable(false);
      }

      if (hasVideo || hasAudio) {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: hasVideo,
          audio: hasAudio,
        });
        if (userMediaStream) {
          window.localStream = userMediaStream;
          if (localVideoref.current) {
            localVideoref.current.srcObject = userMediaStream;
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("HELLO");
    getPermissions();
  }, []);

  let getUserMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    localVideoref.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      window.localStream.getTracks().forEach((track) => {
        connections[id].addTrack(track, window.localStream);
      });

      connections[id].createOffer().then((description) => {
        console.log(description);
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription }),
            );
          })
          .catch((e) => console.log(e));
      });
    }

    // Stream ke har track ke event(ended) ke saath callback register karna.
    // Browser us callback ko yaad rakhta hai. Jab future me us track ka ended event fire hota hai, browser automatically us callback ko execute kar deta hai.
    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setVideo(false);
          setAudio(false);

          try {
            let tracks = localVideoref.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoref.current.srcObject = window.localStream;

          for (let id in connections) {
            window.localStream.getTracks().forEach((track) => {
              connections[id].addTrack(track, window.localStream);
            });

            connections[id].createOffer().then((description) => {
              connections[id]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id,
                    JSON.stringify({ sdp: connections[id].localDescription }),
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        }),
    );
  };

  let silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();
    let dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };
  let black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    });
    canvas.getContext("2d").fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  let getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then(getUserMediaSuccess)
        // .then((stream) => {})
        .catch((e) => console.log(e));
    } else {
      try {
        let tracks = localVideoref.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      } catch (e) {}
    }
  };

  useEffect(() => {
    if (video !== undefined && audio !== undefined) {
      getUserMedia();
      if (socketRef.current) {
        socketRef.current.emit("media-status", {
          audio,
          video,
        });
      }
      console.log("SET STATE HAS ", video, audio);
    }
  }, [video, audio]);

  let gotMessageFromServer = (fromId, message) => {
    var signal = JSON.parse(message);

    if (fromId !== socketIdRef.current) {
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === "offer") {
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  connections[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      socketRef.current.emit(
                        "signal",
                        fromId,
                        JSON.stringify({
                          sdp: connections[fromId].localDescription,
                        }),
                      );
                    })
                    .catch((e) => console.log(e));
                })
                .catch((e) => console.log(e));
            }
          })
          .catch((e) => console.log(e));
      }

      if (signal.ice) {
        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e));
      }
    }
  };

  const addMessage = (data, sender, socketIdSender) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: sender, data: data, socketIdSender: socketIdSender },
    ]);
    if (socketIdSender !== socketIdRef.current) {
      setNewMessages((prevNewMessages) => prevNewMessages + 1);
    }
  };

  let connectToSocketServer = () => {
    socketRef.current = io.connect(server_url, { secure: false });

    socketRef.current.on("signal", gotMessageFromServer);

    socketRef.current.on("connect", () => {
      socketRef.current.emit(
        "join-call",
        window.location.href,
        username.trim(),
      );
      socketIdRef.current = socketRef.current.id;

      socketRef.current.on("chat-message", addMessage);

      socketRef.current.on("media-status-update", (socketId, mediaState) => {
        setMediaStates((prev) => ({
          ...prev,
          [socketId]: mediaState,
        }));
      });

      socketRef.current.on("user-left", (id) => {
        setVideos((videos) => videos.filter((video) => video.socketId !== id));
      });

      socketRef.current.on(
        "user-joined",
        (id, clients, usernames, mediaStates) => {
          // console.log("Usernames:", usernames);
          setParticipantNames(usernames);
          setMediaStates(mediaStates);

          clients.forEach((socketListId) => {
            connections[socketListId] = new RTCPeerConnection(
              peerConfigConnections,
            );
            // Wait for their ice candidate
            connections[socketListId].onicecandidate = function (event) {
              if (event.candidate != null) {
                socketRef.current.emit(
                  "signal",
                  socketListId,
                  JSON.stringify({ ice: event.candidate }),
                );
              }
            };

            // Wait for their video stream
            connections[socketListId].ontrack = (event) => {
              setVideos((prevVideos) => {
                const exists = prevVideos.find(
                  (v) => v.socketId === socketListId,
                );
                let updated;

                if (exists) {
                  updated = prevVideos.map((v) =>
                    v.socketId === socketListId
                      ? { ...v, stream: event.streams[0] }
                      : v,
                  );
                } else {
                  updated = [
                    ...prevVideos,
                    {
                      socketId: socketListId,
                      stream: event.streams[0],
                      autoplay: true,
                      playsinline: true,
                    },
                  ];
                }

                videoRef.current = updated;
                return updated;
              });
            };

            // Add the local video stream
            if (
              window.localStream !== undefined &&
              window.localStream !== null
            ) {
              let streamToSend = window.localStream;
              let tracks = [];

              // Real audio ho to wahi use karo, warna silent audio track
              if (streamToSend.getAudioTracks().length > 0) {
                tracks.push(...streamToSend.getAudioTracks());
              } else {
                tracks.push(silence());
              }

              // Real video ho to wahi use karo, warna black video track
              if (streamToSend.getVideoTracks().length > 0) {
                tracks.push(...streamToSend.getVideoTracks());
              } else {
                tracks.push(black());
              }

              streamToSend = new MediaStream(tracks);
              streamToSend.getTracks().forEach((track) => {
                connections[socketListId].addTrack(track, streamToSend);
              });
            } else {
              let blackSilence = (...args) =>
                new MediaStream([black(...args), silence()]);

              window.localStream = blackSilence();
              window.localStream.getTracks().forEach((track) => {
                connections[socketListId].addTrack(track, window.localStream);
              });
            }
          });

          if (id === socketIdRef.current) {
            for (let id2 in connections) {
              if (id2 === socketIdRef.current) continue;

              try {
                window.localStream.getTracks().forEach((track) => {
                  connections[id2].addTrack(track, window.localStream);
                });
              } catch (e) {}

              connections[id2].createOffer().then((description) => {
                connections[id2]
                  .setLocalDescription(description)
                  .then(() => {
                    socketRef.current.emit(
                      "signal",
                      id2,
                      JSON.stringify({
                        sdp: connections[id2].localDescription,
                      }),
                    );
                  })
                  .catch((e) => console.log(e));
              });
            }
          }
        },
      );
    });
  };

  let handleVideo = () => {
    setVideo(!video);
  };

  let handleAudio = () => {
    setAudio(!audio);
  };

  let getDisplayMediaSuccess = (stream) => {
    console.log("STEP 1: getDisplayMediaSuccess called");
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    localVideoref.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      window.localStream.getTracks().forEach((track) => {
        connections[id].addTrack(track, window.localStream);
      });

      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription }),
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setScreen(false);

          try {
            let tracks = localVideoref.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoref.current.srcObject = window.localStream;

          getUserMedia();
        }),
    );
  };

  let getDisplayMedia = () => {
    if (screen) {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({ video: true, audio: true })
          .then(getDisplayMediaSuccess)
          // .then((stream) => {})
          .catch((e) => console.log(e));
      }
    }
  };

  useEffect(() => {
    if (screen !== undefined) {
      getDisplayMedia();
    }
  }, [screen]);

  let handleScreen = () => {
    setScreen(!screen);
  };

  let handleEndCall = () => {
    try {
      let tracks = localVideoref.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    } catch (e) {}
    window.location.href = "/";
  };

  let sendMessage = () => {
    const text = message.trim();

    if (!text) return;

    socketRef.current.emit("chat-message", text, username);
    setMessage("");
  };

  let getMedia = () => {
    connectToSocketServer();
  };

  let connect = () => {
    setAskForUsername(false);
    getMedia();
  };

  const getGridColumns = (participantCount) => {
    if (participantCount <= 1) return 1;
    if (participantCount <= 4) return 2;
    return 3;
  };

  const gridColumns = getGridColumns(videos.length);

  return (
    <div>
      {askForUsername === true ? (
        <Lobby
          localVideoref={localVideoref}
          video={video}
          videoAvailable={videoAvailable}
          handleVideo={handleVideo}
          audio={audio}
          audioAvailable={audioAvailable}
          handleAudio={handleAudio}
          username={username}
          setUsername={setUsername}
          connect={connect}
        />
      ) : (
        <div className={styles.meetVideoContainer}>
          {showModal ? (
            <ChatModal
              messages={messages}
              socketIdRef={socketIdRef}
              message={message}
              setMessage={setMessage}
              sendMessage={sendMessage}
            />
          ) : (
            <></>
          )}

          <MeetingControls
            video={video}
            handleVideo={handleVideo}
            handleEndCall={handleEndCall}
            audio={audio}
            handleAudio={handleAudio}
            screenAvailable={screenAvailable}
            handleScreen={handleScreen}
            screen={screen}
            newMessages={newMessages}
            showModal={showModal}
            setModal={setModal}
            setNewMessages={setNewMessages}
          />

          <LocalVideo localVideoref={localVideoref} />

          <ConferenceGrid
            videos={videos}
            gridColumns={gridColumns}
            participantNames={participantNames}
            mediaStates={mediaStates}
          />
        </div>
      )}
    </div>
  );
}
