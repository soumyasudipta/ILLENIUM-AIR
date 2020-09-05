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
      billID: null
    };
  }

  cartLayout(data) {
    if(data[0]['code'] === 200) {
      const cart = data[0]['result'].map((u) => 
                    <tbody>
                      <tr>
                        <td>{u.product}</td>
                        <td>{u.name}</td>
                        <td>{u.quantity}</td>
                        <td>
                          <input type="button" onClick={() => this.updateCartData(u.product,1)} value="&uarr;"/><br></br>
                          <input type="button" onClick={() => this.updateCartData(u.product,-1)} value="&darr;"/><br></br>
                        </td>
                        <td>&#x20B9;{u.price}</td>
                        <td>&#x20B9;{u.totalprice}</td>
                      </tr>
                    </tbody>)

      this.setState({
        cart
      })
    }
  }

  async updateCartData(productID, updateQuantity) {
    const data = await DatabaseMethods.updateCart(productID, updateQuantity)

    this.cartLayout(data)
  }

  async getCartData() {
    const data = await DatabaseMethods.getCart()

    this.cartLayout(data)
  }

  componentDidMount() {
    this.getCartData()
  }

  render() {
    const { user } = this.props.auth;

    return (
      <div style={{ height: "75vh" }} className="container">
          <div style={{ marginTop: "4rem" }} className="row">
            <div className="col s8">
                <Link to="/dashboard" className="btn-flat waves-effect">
                    <i className="material-icons left">keyboard_backspace</i> dashboard
                </Link>
            </div>
        </div>
        <div className="row">
          <div className="landing-copy col s12 center-align">
            <h4>
              <b>Hey there,</b> {user.name.split(" ")[0]}
            </h4>
            <div className="col s12">
              <table>
                <thead>
                  <tr>
                    <td>Product ID</td>
                    <td>Name</td>
                    <td>Quantity</td>
                    <td></td>
                    <td>Price</td>
                    <td>Total</td>
                  </tr>
                </thead>
                {this.state.cart}
              </table>
            </div>
              <Link to="/generate"
              style={{
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                marginTop: "1rem"
            }}
              className="btn btn-large waves-effect waves-light hoverable blue accent-3"> Generate Bill</Link>
          </div>
        </div>
      </div>
    );
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
