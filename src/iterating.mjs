import setText, { appendText } from './results.mjs';

// async/await is syntactic sugar on top of promises

export async function get() {
    const { data } = await axios.get("http://localhost:3000/orders/1")
    //^we dont need a separate version of async/await for axios, because we know the axios returns a promise... we will simply use await
    // await must be used inside of an async function

    setText(JSON.stringify(data))
}

export async function getCatch() { //we'll catch errors by using try..block instead of catch function in this async/await method
    try {
        const { data } = await axios.get("http://localhost:3000/orders/123") //error because there is no order 123
        setText(JSON.stringify(data))
    } catch (error) {
        setText(error)
    }
}

export async function chain() { 
    //these two calls will be sequential 
    const { data } = await axios.get("http://localhost:3000/orders/1") //error because there is no order 123
    const {data: address} = await axios.get(`http://localhost:3000/addresses/${data.shippingAddress}`) // make a second API call
    //     ^^^^^^^^^^^^^ destructure the data from axios but rename it as address

    setText(JSON.stringify(address))
    console.log(typeof address)
}

export async function concurrent() {
    //in this example, we'll learn concurrency with async/await
    // below 2 consts are promises... and promises are eager ... meaning they'll kick off instantly .. both start at same time
    const orderStatus = axios.get("http://localhost:3000/orderStatuses")
    const orders = axios.get("http://localhost:3000/orders")
    
    setText("")

    //down below, the program will wait for "order:statuses" before moving on to "data:order"
    const {data: statuses}  = await orderStatus;  //destructure data from returned object but name it as statuses
    const {data: order}     = await orders;  //destructure data from returned object but name it as orders

    appendText(JSON.stringify(statuses))
    appendText(JSON.stringify(order[0]))
}

export async function parallel() { //in this example, the promises are handled in the order they get settled
    setText("")

    await Promise.all( [ // since we are awaiting Promise.all, the parallel function wont end until all our promises are done
        ( async ()=> { //call an anonymous function and make it async
            const {data} = await axios.get("http://localhost:3000/orderStatuses")
            appendText(JSON.stringify(data));
        })(), //the "()" at end executes this anonymous function

        ( async ()=> { //call an anonymous function and make it async
            const {data} = await axios.get("http://localhost:3000/orders")
            appendText(JSON.stringify(data));
        })()

    ] )
}