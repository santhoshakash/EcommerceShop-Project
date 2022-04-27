import { Navigate, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import { logoutcall } from "./API/imageApi";
import { Usercontext } from "../context/Authcontext";
import axios from "axios";
export const AdminHeader = () => {
  const { values, setvalues } = useContext(Usercontext);
  const [userId, setuserId] = useState();
  const [userInfo, setUserInfo] = useState();
  const [logged, setlogged] = useState(false);

  const navigate = useNavigate();

  const validate = async () => {
    const { data } = await axios.get("/user/sessions");
    console.log(data);

    if (data.loggedIn) {
      setlogged(true);
    }
  };

  const logoutHandler = async (e) => {
    e.preventDefault();
    await logoutcall();
    navigate("/");
  };

  useEffect(() => {
    validate();
  }, []);

  console.log(logged);

  return (
    <header className="header bg-white" id="header">
      <div className="container">
        <div className="page-header">
          <div className="header-left">
            <div className="logo-image">
              <Link to="/admindashboard">
                <img
                  src="/images/wigo-logo-img.png"
                  style={{ width: "70", height: "36" }}
                  alt="Wigo Store"
                  itemProp="logo"
                />
              </Link>
            </div>
          </div>
          <div className="header-right">
            <div className="header-items">
              <>
                {" "}
                <span className="sign-in">
                  <svg width="22px" height="22px" viewBox="-1 -1 21 20">
                    <g
                      transform="translate(0.968750, -0.031250)"
                      stroke="none"
                      strokeWidth="1"
                      fill="currentColor"
                      fillRule="nonzero"
                    >
                      <path d="M9,7.5 C10.704,7.5 12.086,6.157 12.086,4.5 C12.086,2.843 10.704,1.5 9,1.5 C7.296,1.5 5.914,2.843 5.914,4.5 C5.914,6.157 7.296,7.5 9,7.5 Z M9,9 C6.444,9 4.371,6.985 4.371,4.5 C4.371,2.015 6.444,0 9,0 C11.556,0 13.629,2.015 13.629,4.5 C13.629,6.985 11.556,9 9,9 Z M1.543,18 L0,18 L0,15 C0,12.377 2.187,10.25 4.886,10.25 L14.143,10.25 C16.273,10.25 18,11.929 18,14 L18,18 L16.457,18 L16.457,14 C16.457,12.757 15.421,11.75 14.143,11.75 L4.886,11.75 C3.04,11.75 1.543,13.205 1.543,15 L1.543,18 Z"></path>
                    </g>
                  </svg>

                  <div className="head-link bg-white" onClick={logoutHandler}>
                    {/* <Link className="main-menu-link" to="/">Login</Link> */}
                    <Link to="">
                      <span className="main-menu-link">Logout</span>
                    </Link>
                  </div>
                </span>
              </>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
