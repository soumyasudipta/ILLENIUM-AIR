import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import DatabaseMethods from '../../routes/routes'

class Checkout extends Component {

  constructor() {
    super();
    this.state = {
      orders : []
    }
  }

  async updateCartData(productID, updateQuantity) {
    const update = (await DatabaseMethods.updateCart(productID, updateQuantity))

    if(update[0]['code'] === 200)
      this.getCartData()

    console.log(update)
  }

  async getCartData() {

    const data = (await DatabaseMethods.getOrders())

    console.log(data)

    if(data[0]['code'] === 200) {
      const orders = data[0]['result'].map((u) => {
        const date = new Date(u.date).toISOString()

        return(
        <div className="card-panel hoverable">
          <Link to={`/orders/${u._id}`}
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

      this.setState({
        orders
      })

    } else {
      const orders = (<div><h3>No Orders Found</h3></div>)
    
      this.setState({
        orders
      })
    }
  }

  componentDidMount() {
    this.getCartData()
  }

  render() {

    return (
      <div style={{ height: "75vh" }} className="container">
          <div className="row">
            <div className="col s8">
                <Link to="/dashboard" className="btn-flat waves-effect">
                    <i className="material-icons left">keyboard_backspace</i>Dashboard
                </Link>
            </div>
        </div>
        <div className="row">
          <div className="landing-copy col s12 center-align">
            {this.state.orders}
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
