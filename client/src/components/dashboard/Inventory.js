import React from 'react';

class Inventory extends React.Component {
    constructor() {
        super()
        this.state = {
            customers: []
        }
    }

    componentDidMount() {
        fetch('/api/customers')
        .then(res => res.json())
        .then(customer => this.setState({customer}, () => console.log('Customers fetched..', customer)))
    }

    render() {
        return (
            <div>
            <h1>Inventory</h1>
            </div>
        )
    }
}

export default Inventory;
