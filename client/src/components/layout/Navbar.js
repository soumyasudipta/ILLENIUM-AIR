import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import M from "materialize-css/dist/js/materialize.min.js";
import "materialize-css/dist/css/materialize.min.css";

class Navbar extends Component {

  // Logout Function
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  componentDidMount() {
    // Initiate Navbar
    var elem = document.querySelector(".sidenav");
        M.Sidenav.init(elem, {
            edge: "left",
            inDuration: 250
        });
  }

  showNavbarMethods() {

  }

  showNavbarMethodsMobile() {
    
  }


  render() {

    const { user } = this.props.auth;

    return (
      <div>
      { user.email !== undefined ? (
        <div>
          <nav className="navbar-extended z-depth-0 white">
            <div className="nav-wrapper">
              {/* Branding */}
              <a href="/#" style={{ fontFamily: "monospace", fontSize:"1.5rem" }} className=" brand-logo center black-text">
                  ILLENIUM AI
              </a>
              
              <a href="# " data-target="mobile-demo" className="sidenav-trigger black-text">
                <i className="material-icons">menu</i>
              </a>

              <ul id="nav-mobile" className="right hide-on-med-and-down">
                <li><a href="/checkout" className="black-text"><i className="material-icons">shopping_cart</i></a></li>
                <li><a href="# " className="black-text" onClick={this.onLogoutClick}>Signout</a></li>
              </ul>
            </div>
          </nav>
          <ul className="sidenav" id="mobile-demo">
            <li><a href="/checkout"><i className="material-icons">shopping_cart</i>   Cart</a></li>
            <li><a href="# " onClick={this.onLogoutClick}><i className="material-icons">exit_to_app</i>  Signout</a></li>
          </ul>
        </div>
        ) :
        (<div>
          <nav className="navbar-extended z-depth-0 white">
            <div className="nav-wrapper">
              {/* Branding */}
              <a href="/#" style={{ fontFamily: "monospace", fontSize:"1.5rem" }} className=" brand-logo center black-text">
                  ILLENIUM AI
              </a>
              
              <a href="# " data-target="mobile-demo" className="sidenav-trigger black-text">
                <i className="material-icons">menu</i>
              </a>

            </div>
          </nav>
          <ul className="sidenav" id="mobile-demo">
            <li><a href="/login">Login</a></li>
            <li><a href="/register">Register</a></li>
          </ul>
        </div>)}
      </div>
    )
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Navbar);