import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import DatabaseMethods from '../../routes/routes'

class Details extends Component {

  constructor() {
    super();
    this.state = {
      order : []
    };
  }

  async getInvoiceDetails() {

    const data = await DatabaseMethods.getInvoiceDetails(this.props.match.params.id)

    if(data[0]['code'] === 200) {
      const order = data[0]['result'].map((u) => {
        
        return(
          <div className="col s12">
            <h5>Invoice ID : {u._id}</h5>
            <h6>{u.payment === true ? <p>Bill Paid</p> : <p>Please Show the Invoice ID to the Cashier and Pay the bill.</p>}</h6>
            <table className="highlight centered responsive-table">
                <thead>
                    <tr>
                        <td>Product ID</td>
                        <td>Product Name</td>
                        <td>Quantity</td>
                        <td>Price</td>
                        <td>Total Price</td>
                    </tr>
                </thead>
                <tbody>
                    {u.items.map((item) => {
                        return(
                            <tr>
                                <td>{item.product}</td>
                                <td>{item.name}</td>
                                <td>{item.quantity}</td>
                                <td>&#x20B9; {item.price}</td>
                                <td>&#x20B9; {item.totalprice}</td>
                            </tr>
                        )
                    })}
                </tbody>
                <thead>
                    <tr>
                        <td></td>
                        <td></td>
                        <td>Total Quantity</td>
                        <td></td>
                        <td>Grand Total</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                        <td></td>
                        <td>{u.totalitems}</td>
                        <td></td>
                        <td>&#x20B9; {u.totalprice}</td>
                    </tr>
                </tbody>
            </table>
          </div>
        )
      })

      this.setState({
        order
      })

    } else {
        const order  = (<div><h3>Invoice Not Found</h3></div>)

        this.setState({
            order
          })
    }
  }

  componentDidMount() {
    this.getInvoiceDetails()
  }

  render() {
    
    return (
      <div className="container">
          <div className="row">
            <div className="col s8">
                <Link to="/orders" className="btn-flat waves-effect">
                    <i className="material-icons left">keyboard_backspace</i>all invoice
                </Link>
            </div>
        </div>
        
        <div className="row">
          <div className="landing-copy col s12 center-align">
            {this.state.order}
          </div>
        </div>
      </div>
    );
  }
}
    
Details.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});
    
export default connect(
    mapStateToProps
)(Details);
