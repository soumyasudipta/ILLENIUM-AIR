import axios from "axios";


// Login - get user token

class DatabaseMethods {

    // Search Product
    static searchCart(productToSearch) {
        return new Promise((resolve, reject) => {
            axios
            .get(`/api/customer/cart/add?productid=${productToSearch}`, { headers: { 'Authorization': `${localStorage.getItem('jwtToken')}`}})
            .then(res => {
                const data = res.data
                resolve(
                    data.map(get => ({
                        ...get
                    }))
                )
            })
            .catch((err)=>{
                reject(err)
            })
        })
    }

    // Add Product to Cart
    static addToCart(productID) {
        return new Promise((resolve, reject) => {
            axios
            .get(`/api/customer/cart/add?productid=${productID}`, { headers: { 'Authorization': `${localStorage.getItem('jwtToken')}`}})
            .then(res => {
                const data = res.data
                resolve(
                    data.map(get => ({
                        ...get
                    }))
                )
            })
            .catch((err)=>{
                reject(err)
            })
        })
    }

    // Read Cart
    static getCart() {
        return new Promise((resolve, reject) => {
            axios
            .get("/api/customer/cart", { headers: { 'Authorization': `${localStorage.getItem('jwtToken')}`}})
            .then(res => {
                const data = res.data
                resolve(
                    data.map(get => ({
                        ...get
                    }))
                )
            })
            .catch((err)=>{
                reject(err)
            })
        })
    }

    // Update Cart
    static updateCart(productID, updateQuantity) {
        return new Promise((resolve, reject) => {
            axios
            .get(`/api/customer/cart/update?productid=${productID}&quantity=${updateQuantity}`, { headers: { 'Authorization': `${localStorage.getItem('jwtToken')}`}})
            .then(res => {
                const data = res.data
                resolve(
                    data.map(get => ({
                        ...get
                    }))
                )
            })
            .catch((err)=>{
                reject(err)
            })
        })
    }

    // Generate Invoice
    static createInvoice() {
        return new Promise((resolve, reject) => {
            axios
            .get(`/api/checkout/invoice/generate`, { headers: { 'Authorization': `${localStorage.getItem('jwtToken')}`}})
            .then(res => {
                const data = res.data
                resolve(
                    data.map(get => ({
                        ...get
                    }))
                )
            })
            .catch((err)=>{
                reject(err)
            })
        })
    }

    // Read Orders
    static getOrders() {
        return new Promise((resolve, reject) => {
            axios
            .get(`/api/checkout/invoice`, { headers: { 'Authorization': `${localStorage.getItem('jwtToken')}`}})
            .then(res => {
                const data = res.data
                resolve(
                    data.map(get => ({
                        ...get
                    }))
                )
            })
            .catch((err)=>{
                reject(err)
            })
        })
    }

    // Read Individual Invoice Details
    static getInvoiceDetails(invoiceNumber) {
        return new Promise((resolve, reject) => {
            axios.get(`/api/checkout/invoice/${invoiceNumber}`, { headers: { 'Authorization': `${localStorage.getItem('jwtToken')}`}})
                .then(res => {
                    const data = res.data
                    resolve(
                        data.map(get => ({
                            ...get
                        }))
                    )
                })
                .catch((err)=>{
                    reject(err)
                })
        })
    }
}

export default DatabaseMethods