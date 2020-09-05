import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import DatabaseMethods from '../../routes/routes'

class Generate extends Component {

  constructor() {
    super();
    this.state = {
      bill: [],
      billID: null
    };
  }

  async generateBill() {
    const data = (await DatabaseMethods.getGenerateBill())

    console.log(data)
    if(data[0]['code'] === 200) {
      console.log(data[0]['result']['items'])
    }

    if(data[0]['code'] === 200) {
      const bill = data[0]['result']['items'].map((u) => 
        <tbody>
          <tr>
            <td>{u.product}</td>
            <td>{u.name}</td>
            <td>{u.quantity}</td>
            <td>&#x20B9;{u.price}</td>
            <td>&#x20B9;{u.totalprice}</td>
          </tr>
        </tbody>
      )

      const billID = data[0]['result']['_id']

      this.setState({
        billID,
        bill
      })

      console.log(bill)
    }
  }


  componentDidMount() {
    this.generateBill()
  }

  render() {
    const { user } = this.props.auth;

    return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="row">
          <div className="landing-copy col s12 center-align">
            <h4>
              <b>Hey there,</b> {user.name.split(" ")[0]}
            </h4>
            <p>Show this bill number to the cashier and pay the bill</p>
              <p>{this.state.billID}</p>
              <div className="col s12">
                <table>
                  <thead>
                    <tr>
                      <td>Product ID</td>
                      <td>Name</td>
                      <td>Quantity</td>
                      <td>Price</td>
                      <td>Total</td>
                    </tr>
                  </thead>
                  {this.state.bill}
                </table>
              </div>
          </div>
        </div>
      </div>
    );
  }
}
    
Generate.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});
    
export default connect(
    mapStateToProps
)(Generate);
