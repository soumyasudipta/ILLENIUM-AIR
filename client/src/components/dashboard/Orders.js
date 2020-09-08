import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { Link } from 'react-router-dom'
import DatabaseMethods from '../../routes/routes'

class Checkout extends Component {
  constructor() {
    super();
    this.state = {
      orders : []
    }
  }

  // Update Cart Data
  async updateCartData(productID, updateQuantity) {
    const update = (await DatabaseMethods.updateCart(productID, updateQuantity))

    if(update[0]['code'] === 200)
      this.getCartData()
  }

  // Get Cart Data
  async getCartData() {

    const data = await DatabaseMethods.getOrders()
    let orders = []

    // Status OK
    if(data[0]['code'] === 200) {
      // Cart Empty
      if(data[0]['result'].length === 0) {
        orders = (
          <div style={{ marginTop: "30vh" }} className="container center-align">
            <div className="row">
              <div className="col s12">
                <div>
                  <i className="fa fa-file-text fa-4x" aria-hidden="true"></i>
                </div>
              </div>
              <div className="col s12">
                <h4>No Invoice Found!!!</h4>
                <h5>Please shop with Illenium AI</h5>
              </div>
            </div>
          </div>)
      } 

      // Cart has Elements
      else {
        orders = data[0]['result'].map((u) => {
          const date = new Date(u.date).toISOString()
  
          return(
            <div key={`${u._id}`} className={u.payment === true ? "card-panel hoverable green lighten-5" : "card-panel hoverable red lighten-5"}>
              <Link  to={`/orders/${u._id}`}
                    style = {{color:'#000000'}}>
                <div className="row" >
                  <div className="col s6 m3"><p><b>Invoice Id:</b> <br></br>{u._id}</p></div>
                  <div className="col s6 m3"><p><b>Date:</b> <br></br>{date.slice(0,10) + " " + date.slice(11,16)}</p></div>
                  <div className="col s6 m3"><p><b>Paid:</b> <br></br>{u.payment === true ? 'Yes' : 'No'}</p></div>
                  <div className="col s6 m3"><p><b>Total:</b> <br></br>&#x20B9; {u.totalprice}</p></div>
                </div>
              </Link>
            </div>)
        })
      }
    } 

    // Status Forbidden or Not Found
    else {
      orders = (
        <div style={{ height: "65vh" }}>
          <div className="row">
            <div className="col s12">
              <div>
                <i className="fa fa-chain-broken fa-4x" aria-hidden="true"></i>
              </div>
            </div>
            <div className="col s12">
              <h4>Snap!!!</h4>
              <h5>Something went wrong</h5>
            </div>
          </div>
        </div>) 
    }

    this.setState({
      orders
    })
  }

  componentDidMount() {
    // Load Cart Data While Loading
    this.getCartData()
  }

  render() {
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
            {this.state.orders}
          </div>
        </div>
      </div>
    )
  }
}
    
Checkout.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
})
    
export default connect(
    mapStateToProps
)(Checkout)
