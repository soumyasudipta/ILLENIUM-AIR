import React, { Component, useCallback } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import Webcam from 'react-webcam'

class Customer extends Component {
    constructor() {
        super();
        this.state = {
            imageData : null
        }
      }

    componentDidMount() {
        setInterval(() => this.capture(), 1000);
      }

    setRef = (webcam) => {
        this.webcam = webcam
    }

    capture = () => {
        const imageData = this.webcam.getScreenshot()
        this.setState({ imageData })
    }

    getLatestVideo = () => {
        // Return a base64 encoded string which can be converted to image
        // and put in the model to 
        return this.state.imageData
    }

    render() {

        const videoConstraints = {
            // facingMode: { exact: "environment" } // Use for Mobile
            facingMode: "user" // Use when in Development Mode
          };

        return (
            <div className="container">
                <div className="row">
                    <div className="col s8">
                        <Link to="/dashboard" className="btn-flat waves-effect">
                            <i className="material-icons left">keyboard_backspace</i> dashboard
                        </Link>
                    </div>
                </div>
                <div className="row">
                    <div className="landing-copy col s12 center-align">
                        <Webcam
                            id="camera"
                            audio={false}
                            ref={this.setRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={videoConstraints}
                            style={{width:"100%",margin:0,padding:0}}
                        
                        />
                    </div>
                    {/* <div>
                        <button onClick={this.getLatestVideo}>Log Image Data</button>
                    </div> */}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});
  
export default connect(
    mapStateToProps
)(Customer);
