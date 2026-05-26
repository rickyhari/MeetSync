import React from "react";
import "../App.css";
import { Link } from "react-router-dom";
export default function LandingPage() {
  return (
    <div className="landingPageContainer">
      <nav>
        <div className="navHeader">
          <h2>MeetSync</h2>
        </div>
        <div className="navlist">
          <p>Join as Guest</p>
          <p>Register</p>
          <div role="button">
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
          <Link to="/home" className="getStartedBtn">
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
