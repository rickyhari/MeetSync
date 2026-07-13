import { IconButton } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import styles from "../styles/videoComponent.module.css";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";

export default function Lobby({
  localVideoref,
  video,
  videoAvailable,
  handleVideo,
  audio,
  audioAvailable,
  handleAudio,
  username,
  setUsername,
  connect,
}) {
  return (
    <div className={styles.lobbyContainer}>
      <header className={styles.lobbyHeader}>
        <h1 className={styles.lobbyTitle}>MeetSync</h1>
        <p className={styles.lobbyMeetingCode}>
          Meeting:{" "}
          <span>
            {window.location.pathname.replace(/^\//, "") || "meeting"}
          </span>
        </p>
      </header>

      <div className={styles.lobbyCard}>
        <div className={styles.lobbyPreview}>
          <video
            className={styles.lobbyVideo}
            ref={localVideoref}
            autoPlay
            muted
          ></video>
          <div className={styles.lobbyMediaControls}>
            <IconButton
              onClick={handleVideo}
              disabled={!videoAvailable}
              className={`${styles.lobbyMediaButton} ${
                video ? styles.lobbyMediaButtonActive : ""
              }`}
              aria-label={video ? "Turn camera off" : "Turn camera on"}
            >
              {video === true ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>

            <IconButton
              onClick={handleAudio}
              disabled={!audioAvailable}
              className={`${styles.lobbyMediaButton} ${
                audio ? styles.lobbyMediaButtonActive : ""
              }`}
              aria-label={audio ? "Mute microphone" : "Unmute microphone"}
            >
              {audio === true ? <MicIcon /> : <MicOffIcon />}
            </IconButton>
          </div>
          <p className={styles.lobbyPreviewLabel}>Preview</p>
        </div>

        <div className={styles.lobbyForm}>
          <h2>Join Meeting</h2>
          <p>Enter your username to join the meeting.</p>

          <TextField
            fullWidth
            id="lobby-username"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
            className={styles.lobbyInput}
            autoFocus
            sx={{
              "& .MuiInputLabel-root": {
                color: "rgba(255,255,255,0.7)",
              },
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && username.trim()) {
                connect();
              }
            }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={connect}
            disabled={!username.trim()}
            className={styles.lobbyJoinBtn}
          >
            Join Meeting
          </Button>
        </div>
      </div>
    </div>
  );
}
