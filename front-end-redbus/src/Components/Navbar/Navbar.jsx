import React from "react";
import styles from "./Navbar.module.css";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { RiArrowDropDownLine } from "react-icons/ri";
import { MdAccountCircle } from "react-icons/md";
import { Link, useHistory } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import {
  loginSuccess,
  loginFailure,
  logout,
  addCustomerMongo,
} from "../../Redux/auth/actions";

const Navbar = () => {
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const dispatch = useDispatch();
  const history = useHistory();

  const { isLoggedIn, currentCustomer } = useSelector(
    (state) => state.authReducer
  );

  const handleLogout = () => {
    dispatch(logout());
    history.push("/");
  };

  return (
    <div className={styles.Navbar}>
      {/* LEFT */}
      <div className={styles.leftSide_header}>
        <img
          src="https://www.redbus.in/i/59538b35953097248522a65b4b79650e.png"
          alt="logo"
          onClick={() => history.push("/")}
        />
      </div>

      {/* RIGHT */}
      <div className={styles.rightSide_header}>
        
        {/* USER ICON + NAME */}
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={(e) => setAnchorEl2(e.currentTarget)}
        >
          <MdAccountCircle style={{ fontSize: "30px", color: "white" }} />

          {currentCustomer && (
            <span style={{ color: "white", marginLeft: "6px" }}>
              {currentCustomer.name}
            </span>
          )}
        </div>

        {/* MENU */}
        <Menu
          anchorEl={anchorEl2}
          open={Boolean(anchorEl2)}
          onClose={() => setAnchorEl2(null)}
        >
          {currentCustomer ? (
            <>
              <MenuItem>
                <Link to="/my-profile">My Profile</Link>
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </>
          ) : (
            <MenuItem>
              <GoogleLogin
                onSuccess={(res) => {
                  const user = jwtDecode(res.credential);

                  dispatch(loginSuccess(user));
                  dispatch(addCustomerMongo(user));
                }}
                onError={() => dispatch(loginFailure("Login failed"))}
              />
            </MenuItem>
          )}
        </Menu>
      </div>
    </div>
  );
};

export default Navbar;