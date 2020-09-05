import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import Webcam from 'react-webcam'

class Customer extends Component {

    state = {
        imageData: null,
        image_name: "",
        saveImage: false
    }

    setRef = (webcam) => {
        this.webcam = webcam
    }

    capture = () => {
        const imageSrc = this.webcam.getScreenshot()
        this.setState({
            imageData: imageSrc
        })
    }

    render() {
        
        const videoConstraints = {
            facingMode: { exact: "environment" }
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
                        {/* <div>
                            <p style={{ wordBreak: "break-word" }} id="text"></p>
                        </div> */}
                    </div>
                </div>
            </div>
        )
    }
}

Customer.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});
  
export default connect(
    mapStateToProps
)(Customer);
