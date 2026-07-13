import { Badge, IconButton } from "@mui/material";
import styles from "../styles/videoComponent.module.css";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import ChatIcon from "@mui/icons-material/Chat";

export default function MeetingControls({
  video,
  handleVideo,
  handleEndCall,
  audio,
  handleAudio,
  screenAvailable,
  handleScreen,
  screen,
  newMessages,
  showModal,
  setModal,
  setNewMessages,
}) {
  return (
    <div className={styles.buttonContainers}>
      <IconButton onClick={handleVideo} sx={{ color: "white" }}>
        {video === true ? <VideocamIcon /> : <VideocamOffIcon />}
      </IconButton>
      <IconButton onClick={handleEndCall} sx={{ color: "red" }}>
        <CallEndIcon />
      </IconButton>
      <IconButton onClick={handleAudio} sx={{ color: "white" }}>
        {audio === true ? <MicIcon /> : <MicOffIcon />}
      </IconButton>

      {screenAvailable === true ? (
        <IconButton onClick={handleScreen} sx={{ color: "white" }}>
          {screen === true ? (
            <ScreenShareIcon />
          ) : (
            <StopScreenShareIcon />
          )}
        </IconButton>
      ) : (
        <></>
      )}

      <Badge badgeContent={newMessages} max={999} color="secondary">
        <IconButton
          onClick={() => {
            setModal(!showModal);
            setNewMessages(0);
          }}
          sx={{ color: "white" }}
        >
          <ChatIcon />{" "}
        </IconButton>
      </Badge>
    </div>
  );
}
