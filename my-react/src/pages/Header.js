import { Link, useHistory, useNavigate } from "react-router-dom";
// import { logout, session } from "../Redux/Actions/userActions";
import { useContext, useEffect, useState } from "react";

import { Usercontext } from "../context/Authcontext";
import axios from "axios";

export const Header = () => {
  const { values, setdata } = useContext(Usercontext);
  const [userId, setuserId] = useState();
  const [userInfo, setUserInfo] = useState(false);
  const [logged, setlogged] = useState(false);
  // const dispatch = useDispatch()
  const navigate = useNavigate();

  useEffect(() => {
    if (values) {
      setuserId(values._id);
      setUserInfo(values);
      // console.log(values);
    }
  }, []);

  const validate = async () => {
    const { data } = await axios.get("/user/sessions");

    if (data.loggedIn) {
      setlogged(true);
    }
  };

  useEffect(() => {
    validate();
  }, []);

  const logoutCall = async () => {
    const result = await axios.post("/api/users/logout");

    setUserInfo(false);
  };

  const logoutHandler = async () => {
    await logoutCall();
    navigate("/");
  };
  return (
    <header className="header bg-white" id="header">
      <div className="container">
        <div className="page-header">
          <div className="header-left">
            <div className="logo-image">
              {!logged && (
                <Link to="/">
                  <img
                    src="/images/wigo-logo-img.png"
                    style={{ width: "70", height: "36" }}
                    alt="Wigo Store"
                    itemProp="logo"
                  />
                </Link>
              )}

              {logged && (
                <Link to="/collections">
                  <img
                    src="/images/wigo-logo-img.png"
                    style={{ width: "70", height: "36" }}
                    alt="Wigo Store"
                    itemProp="logo"
                  />
                </Link>
              )}
            </div>{" "}
            {logged && (
              <div className="header-menu">
                <nav className="navigation">
                  <ul>
                    <li>
                      <Link to="/collections">Collections</Link>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
          <div className="header-right">
            <div className="header-items">
              {logged ? (
                <>
                  <div className="header-menu">
                    {/* <nav className="navigation">
                    <ul>
                      <li><Link to="/collections">Collections</Link></li>
                    </ul>
                  </nav> */}
                  </div>
                  <span className="cart-link">
                    <Link to="/cart">
                      <svg width="24px" height="24px" viewBox="0 -2 37 35">
                        <g
                          transform="translate(0.500000, 0.500000)"
                          stroke="none"
                          fill="currentColor"
                          fillRule="nonzero"
                        >
                          <path d="M0.2,11 L9.5,29 L26.4,29 L35.7,11 L0.2,11 Z M24.5,26 L11.5,26 L4.8,14 L31.2,14 L24.5,26 L24.5,26 Z M18.5,3 C22.7,3 25.5,6.3 25.5,8.5 L28.5,8.5 C28.5,4.5 24.2,0 18.5,0 C12.8,0 8.5,4.5 8.5,8.5 L11.5,8.5 C11.5,6.3 14.3,3 18.5,3 Z"></path>
                        </g>
                      </svg>
                    </Link>
                  </span>
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
                    <div className="head-link bg-white">
                      <Link
                        className="main-menu-link"
                        to={`/myorders/${userId}`}
                      >
                        My Orders
                      </Link>
                      <Link
                        to=""
                        className="main-menu-link"
                        onClick={logoutHandler}
                      >
                        Log Out
                      </Link>
                    </div>
                  </span>
                </>
              ) : (
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

                    <div className="head-link bg-white">
                      <Link className="main-menu-link" to="/">
                        Login
                      </Link>
                      <Link className="main-menu-link" to="/signup">
                        Register
                      </Link>
                    </div>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
