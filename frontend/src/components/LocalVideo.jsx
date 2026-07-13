import styles from "../styles/videoComponent.module.css";

export default function LocalVideo({ localVideoref }) {
  return (
    <video
      className={styles.meetUserVideo}
      ref={(ref) => {
        localVideoref.current = ref;

        if (
          ref &&
          window.localStream &&
          ref.srcObject !== window.localStream
        ) {
          ref.srcObject = window.localStream;
        }
      }}
      autoPlay
      muted
    ></video>
  );
}
