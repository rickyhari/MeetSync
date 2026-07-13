import RemoteVideoTile from "./RemoteVideoTile";
import styles from "../styles/videoComponent.module.css";

export default function ConferenceGrid({
  videos,
  gridColumns,
  participantNames,
  mediaStates,
}) {
  return (
    <div
      className={styles.conferenceView}
      style={{
        gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
      }}
    >
      {videos.map((video) => (
        <RemoteVideoTile
          key={video.socketId}
          video={video}
          participantName={participantNames[video.socketId]}
          mediaState={mediaStates[video.socketId]}
        />
      ))}
    </div>
  );
}
