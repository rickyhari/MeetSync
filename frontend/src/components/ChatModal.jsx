import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import styles from "../styles/videoComponent.module.css";

export default function ChatModal({
  messages,
  socketIdRef,
  message,
  setMessage,
  sendMessage,
}) {
  return (
    <div className={styles.chatRoom}>
      <div className={styles.chatContainer}>
        <h1 className={styles.chatTitle}>Chat</h1>

        <div className={styles.chattingDisplay}>
          {messages.length !== 0 ? (
            messages.map((item, index) => {
              const isOwnMessage =
                item.socketIdSender === socketIdRef.current;

              return (
                <div
                  className={`${styles.chatMessageRow} ${
                    isOwnMessage
                      ? styles.ownMessageRow
                      : styles.remoteMessageRow
                  }`}
                  key={index}
                >
                  <div
                    className={`${styles.chatBubble} ${
                      isOwnMessage
                        ? styles.ownMessageBubble
                        : styles.remoteMessageBubble
                    }`}
                  >
                    <p className={styles.chatSender}>{item.sender}</p>
                    <p className={styles.chatText}>{item.data}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className={styles.emptyChatMessage}>No Messages Yet</p>
          )}
        </div>

        <div className={styles.chatInputArea}>
          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            id="outlined-basic"
            label="Enter Your chat"
            variant="outlined"
            size="small"
            fullWidth
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
          <Button variant="contained" onClick={sendMessage}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
