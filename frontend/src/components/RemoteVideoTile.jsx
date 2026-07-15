import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import styles from "../styles/videoComponent.module.css";

export default function RemoteVideoTile({
  video,
  participantName,
  mediaState,
}) {
  return (
    <div className={styles.remoteVideoTile}>
      <video
        className={styles.remoteVideo}
        data-socket={video.socketId}
        ref={(ref) => {
          if (ref && video.stream && ref.srcObject !== video.stream) {
            ref.srcObject = video.stream;
          }
        }}
        autoPlay
        playsInline
      ></video>

      <div className={styles.remoteParticipantName}>
        {participantName || "Participant"}
      </div>

      <div className={styles.remoteStatusIcons}>
        {mediaState?.audio === false && (
          <MicOffIcon className={styles.remoteStatusIcon} />
        )}
        {mediaState?.video === false && (
          <VideocamOffIcon className={styles.remoteStatusIcon} />
        )}
      </div>
    </div>
  );
}
