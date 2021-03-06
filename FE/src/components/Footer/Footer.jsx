import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "./Footer.css";

class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <div className="row w-75">
          <div className="col-sm-3 ">
            <div className="footer-title">Buy</div>
            <NavLink className="footer-item"
              to={"/payment"}
              exact
            >
              <div className="footerItem">Terms of payment</div>
            </NavLink>
            <NavLink to={"/delivery"} className="footer-item"
              exact>
              <div className="footerItem">Delivery</div>
            </NavLink>
          </div>
          <div className="col-sm-3 ">
            <div className="footer-title">About us</div>
            <NavLink
              to={"/info"}
              exact
              className="footer-item"
            >
              <div className="footerItem">Company Info</div>
            </NavLink>
          </div>
          <div className="col-sm-3 ">
            <div className="footer-title">Social Media </div>
            <a
              href="http://www.facebook.com"
              target="blank"
              className="footer-item"
            >
              <div className="footerItem">Facebook</div>
            </a>
          </div>
        </div>

        <div>
          <ul className="social">
            
            <li><a href="/vimeo.com" data-original-title="Vimeo">
              <i className="fab fa-vimeo-v" />
            </a></li>
            <li><a href="/twitter.com" data-original-title="Twitter">
              <i className="fab fa-twitter" />
            </a></li>
            <li ><a href="https://www.facebook.com/analytics/739055393195866/overview?since=1575514800000&until=1575601200000&range_type=LAST_24_HOURS&__aref_src=new_entity_selector&force_desktop=1&user_id=100005701865130" data-original-title="Facebook">
              <i className="fab fa-facebook-f" />
            </a></li>
            <li><a href="/google.com" data-original-title="Google +">
              <i className="fab fa-google-plus-g" />
            </a></li>
            <li><a href="/linkedin.com" data-original-title="Linkedin">
              <i className="fab fa-linkedin-in" />
            </a></li>
            <li><a href="/pinterest.com" data-original-title="Pinterest">
              <i className="fab fa-pinterest-p" />
            </a></li>
          </ul>

        </div>
      </div>
    );
  }
}

export default Footer;
