import React, { Component } from "react";

class Error extends Component {
    constructor() {
        super()
        this.state = {
            customers: []
        }
    }

    render() {
        return (
            <div class="container">
                <h1>Error. Not Found!!!</h1>
            </div>
        )
    }
}

export default Error;
