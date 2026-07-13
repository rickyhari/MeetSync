import React, { useContext, useState } from "react";
import withAuth from "../utils/withAuth";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { Button, IconButton, TextField } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import { AuthContext } from "../contexts/AuthContext";

export function HomeComponent({ guest = false }) {
  let navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");

  const { addToUserHistory } = useContext(AuthContext);
  let handleJoinVideoCall = async () => {
    if (!guest) {
      await addToUserHistory(meetingCode);
    }
    navigate(`/${meetingCode}`);
  };

  return (
    <>
      <div className="navBar">
        <div style={{ display: "flex", alignItems: "center" }}>
          {guest ? <h2>MeetSync - Guest</h2> : <h2>MeetSync</h2>} 
        </div>

        {!guest && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Button
              variant="contained"
              startIcon={<RestoreIcon />}
              onClick={() => navigate("/history")}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              History
            </Button>

            <Button
              variant="outlined"
              onClick={() => {
                sessionStorage.removeItem("token");
                // sessionStorage.clear();
                navigate("/auth");
              }}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Logout
            </Button>
          </div>
        )}
      </div>

      <div className="meetContainer">
        <div className="leftPanel">
          <div>
            <h2>Enter a meeting code below to join your meeting.</h2>
            <br />
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
              <TextField
                onChange={(e) => setMeetingCode(e.target.value)}
                id="outlined-basic"
                label="Meeting Code"
                variant="filled"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleJoinVideoCall();
                  }
                }}
              />
              <Button onClick={handleJoinVideoCall} variant="contained">
                Join
              </Button>
            </div>
          </div>
        </div>
        <div className="rightPanel">
          <img srcSet="/logo3.png" alt="" />
        </div>
      </div>
    </>
  );
}

export default withAuth(HomeComponent);
