import axios from "axios";


// Login - get user token

class DatabaseMethods {
    static getCart() {
        return new Promise((resolve, reject) => {
            axios
            .get("/api/checkout/process", { headers: { 'Authorization': `${localStorage.getItem('jwtToken')}`}})
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

    static getGenerateBill() {
        return new Promise((resolve, reject) => {
            axios
            .get(`/api/checkout/generate`, { headers: { 'Authorization': `${localStorage.getItem('jwtToken')}`}})
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

    static getOrders() {
        return new Promise((resolve, reject) => {
            axios
            .get(`/api/checkout/orders`, { headers: { 'Authorization': `${localStorage.getItem('jwtToken')}`}})
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

    static getInvoiceDetails(invoiceNumber) {
        return new Promise((resolve, reject) => {
            axios.get(`/api/checkout/orders/${invoiceNumber}`, { headers: { 'Authorization': `${localStorage.getItem('jwtToken')}`}})
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