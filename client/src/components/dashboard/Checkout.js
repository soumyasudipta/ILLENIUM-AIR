import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import DatabaseMethods from '../../routes/routes'

class Checkout extends Component {

  constructor() {
    super();
    this.state = {
      cart: [],
      bill: [],
      billID: 0,
      totalPrice: 0,
      totalQuantity: 0
    };
  }

  cartLayout(data) {
    let cart = []

    if(data[0]['code'] === 200) {
      if(data[0]['result'].length === 0) {
        cart = (<div style={{ marginTop: "30vh" }} className="container center-align">
                  <div className="row">
                    <div className="col s12">
                      <div>
                        <i className="fa fa-shopping-cart fa-4x" aria-hidden="true"></i>
                      </div>
                    </div>
                    <div className="col s12">
                      <h4>No Items Found in Your Cart!!!</h4>
                      <h5>Please shop with Illenium AI</h5>
                    </div>
                  </div>
                </div>)
      } else {
        cart = (<div>
                  <div className="col s12">
                    <table>
                      <thead>
                        <tr>
                          <td>Name</td>
                          <td>Quantity</td>
                          <td></td>
                          <td>Price</td>
                          <td>Total</td>
                        </tr>
                      </thead>
                      { data[0]['result'].map((u) => {
                          this.state.totalPrice += u.totalprice
                          this.state.totalQuantity += u.quantity
                        return(
                          <tbody key={u.product}>
                            <tr>
                              <td>{u.name}</td>
                              <td>{u.quantity}</td>
                              <td>
                                <input className="green lighten-5" type="button" style={{border: 0, background: 'None'}} onClick={() => this.updateCartData(u.product,1)} value="&uarr;"/><br></br>
                                <input className="red lighten-5" type="button" style={{border: 0, background: 'None'}} onClick={() => this.updateCartData(u.product,-1)} value="&darr;"/><br></br>
                              </td>
                              <td>&#x20B9;{u.price}</td>
                              <td>&#x20B9;{u.totalprice}</td>
                            </tr>
                          </tbody>) }) }
                      <thead>
                        <tr>
                          <td></td>
                          <td>Total Quantity</td>
                          <td></td>
                          <td></td>
                          <td>Grand Total</td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td></td>
                          <td>{this.state.totalQuantity}</td>
                          <td></td>
                          <td></td>
                          <td>&#x20B9;{this.state.totalPrice}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <button onClick={() => this.createInvoice()}
                      style={{
                        width: "150px",
                        borderRadius: "3px",
                        letterSpacing: "1.5px",
                        marginTop: "1rem"
                    }}
                      className="btn btn-large waves-effect waves-light hoverable blue accent-3"> 
                    Generate Bill
                  </button>
                </div>)
      }
    } else {
        cart = (<div style={{ height: "65vh" }} className="container valign-wrapper">
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
      cart
    })
  }

  async updateCartData(productID, updateQuantity) {
    const data = await DatabaseMethods.updateCart(productID, updateQuantity)
    this.cartLayout(data)
  }

  async getCartData() {
    const data = await DatabaseMethods.getCart()
    this.cartLayout(data)
  }

  async createInvoice() {
    const data = await DatabaseMethods.createInvoice()
    window.location.href = `/orders/${data[0]['result']['_id']}`
  }

  componentDidMount() {
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
            {this.state.cart}
          </div>
        </div>
      </div>
    )
  }
}
    
Checkout.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});
    
export default connect(
    mapStateToProps
)(Checkout);
