import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";
import HistoryIcon from "@mui/icons-material/History";
import CircularProgress from "@mui/material/CircularProgress";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { IconButton } from "@mui/material";
import withAuth from "../utils/withAuth";

function History() {
  const { getHistoryOfUser } = useContext(AuthContext);

  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  const routeTo = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getHistoryOfUser();
        setMeetings(Array.isArray(history) ? history : []);
      } catch {
        setMeetings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [getHistoryOfUser]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fb", p: { xs: 2, sm: 3 } }}>
      <Box
        sx={{
          maxWidth: 960,
          mx: "auto",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Meeting History
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View and rejoin your previous meetings.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<HomeIcon />}
          onClick={() => routeTo("/home")}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            color: "#ff9839",
            borderColor: "#ff9839",
          }}
        >
          Home
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : meetings.length !== 0 ? (
        <Box
          sx={{
            maxWidth: 960,
            mx: "auto",
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 2,
          }}
        >
          {meetings.map((e) => (
            <Card
              key={e._id}
              variant="outlined"
              sx={{
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "0.2s",
                "&:hover": {
                  boxShadow: 6,
                  borderColor: "#ff9839",
                },
              }}
            >
              <CardContent sx={{ pb: 1 }}>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  sx={{
                    mb: 2,
                    color: "#1f2937",
                    letterSpacing: "-0.5px",
                    overflowWrap: "anywhere",
                  }}
                >
                  {e.meetingCode}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "text.secondary",
                  }}
                >
                  <CalendarTodayOutlinedIcon sx={{ fontSize: 16 }} />

                  <Typography variant="body2">{formatDate(e.date)}</Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => routeTo(`/${e.meetingCode}`)}
                  sx={{ bgcolor: "#ff9839", "&:hover": { bgcolor: "#d97500" } }}
                >
                  Rejoin
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            maxWidth: 480,
            mx: "auto",
            textAlign: "center",
            py: 8,
            px: 2,
          }}
        >
          <HistoryIcon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No meetings yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Meetings you join from home will appear here.
          </Typography>
          <Button component={Link} to="/home" variant="outlined">
            Go to Home
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default withAuth(History);