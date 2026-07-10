import React from "react";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";
export default function LandingPage() {
  const router = useNavigate();
  return (
    <div className="landingPageContainer">
      <nav>
        <div className="navHeader">
          <h2>MeetSync</h2>
        </div>
        <div className="navlist">
          <p onClick={() => router("/guest")}>Join as Guest</p>

          <p onClick={() => router("/auth")}>Register</p>
          
          <div onClick={() => router("/auth")} role="button">
            <p>Login</p>
          </div>
        </div>
      </nav>

      <div className="landingMainContainer">
        <div className="landingText">
          <h1>
            <span style={{ color: "#FF9839" }}>Connect</span> with your loved
            Ones
          </h1>

          <p>Cover a distance with MeetSync</p>
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
