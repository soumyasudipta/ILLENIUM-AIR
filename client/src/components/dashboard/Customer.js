import React, { Component} from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import Webcam from 'react-webcam'

class Customer extends Component {
    constructor() {
        super();
        this.state = {
            imageData : null,
            processPrediction: false,
            model: null
        }
      }

    async componentDidMount() {
        // Load Tensorflow model when component Mounted
        
        // Uncomment it
        // let model = await tf.loadLayersModel('model.json')
        // this.setState({ model })

        // Run check every one sec
        setInterval(() => {
            if (this.state.processPrediction === false) { 
                this.capture() 
            }
        }, 1000);
      }

    setRef = (webcam) => {
        this.webcam = webcam
    }

    capture = async () => {
        // Set processprediction to true to stop getting additional data
        this.setState({processPrediction : true})
        
        // Get Image from camera
        const imageDataFromCamera = this.webcam.getScreenshot()
        this.setState({ imageData: imageDataFromCamera })

        // Create an image of jpeg type from base64 string
        let image = new Image()
        image.src = imageDataFromCamera

        // get result after resizing the image
        let result = await this.imageToDataUri(image, 160, 160)
        console.log(result)

        // Prediction
        let prediction = null
        // let prediction = this.state.model.predict(tf.browser.fromPixels(result))

        // Check prediction then set state or create dialog
        if (prediction === null || prediction === undefined) {
            this.setState({processPrediction : false})
        } else {

            // Do some task
            this.setState({processPrediction : false})
        }

    }

    imageToDataUri = (img, width, height) => {

        // create an off-screen canvas
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d');
    
        // set its dimension to target size
        canvas.width = width;
        canvas.height = height;
    
        // draw source image into the off-screen canvas:
        ctx.drawImage(img, 0, 0, width, height);
    
        // encode image to data-uri with base64 version of compressed image
        return canvas.toDataURL('image/jpeg', 1.0)
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
