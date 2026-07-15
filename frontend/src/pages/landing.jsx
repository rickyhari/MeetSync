import React from "react";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";
export default function LandingPage() {
  const router = useNavigate();
  return (
    <div className="landingPageContainer">
      <nav>
        <div className="navHeader">
          <img src="/logo.png" alt="MeetSync logo" />
          <h2>MeetSync</h2>
        </div>
        <div className="navlist">
          <p onClick={() => router("/guest")}>Join as Guest</p>

          <p onClick={() => router("/auth", { state: { tab: "signup" } })}>Register</p>

          <p onClick={() => router("/auth", { state: { tab: "signin" } })}>Login</p>
        </div>
      </nav>

      <div className="landingMainContainer">
        <div className="landingText">
          <h1>
            <span style={{ color: "#FF9839" }}>Connect.</span>
            <br />
            Collaborate.
            <br />
            Meet.
          </h1>

          <p>
            Video meetings, screen sharing and real-time chat — all in one
            place.
          </p>
          <Link to="/auth" className="getStartedBtn">
            Get Started
          </Link>
        </div>
        <div className="landingImage">
          <img src="/mobile.png" alt="" />
        </div>
      </div>
    </div>
  );
}
