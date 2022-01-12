import setText, {appendText, showWaiting, hideWaiting} from "./results.mjs";

export function get() {
    axios.get("http://localhost:3000/orders/1") //axios is a popular HTTP request Libraries
    .then( // execute then if the request succeeds
        ({data}) => { // destructure the data that is passed back
            setText(JSON.stringify(data)) //display the data in the result box
        }
    )
}

export function getCatch() {
    axios.get("http://localhost:3000/orders/123") 
    .then( 
        ({data}) => { // destructure the data that is passed back
            setText(JSON.stringify(data)) //display the data in the result box
        })
        .catch(err => setText(err)) //catch executes when a request is failed ... catch also needs a function ... error is the only input we have for catch block
}

export function chain() { //promises can be chained together
    axios.get("http://localhost:3000/orders/1").then( ({data}) => {
        return axios.get(`http://localhost:3000/addresses/${data.shippingAddress}`)  //get the city info and return it in a promise
        //^ the "then" block returns a promise .. whatever value we return gets wrapped up in that promise. That means we can add another then block to our first Then ... and so on ... we can get a chain like this
        // note: The settled functions, "then" and "catch",  both return promises
    })
    .then(
        ({data}) => {setText(`City: ${data.city}`)} //this "then" function reads the info passed on from first "then"'s returned promise
        //note that this "then" could also return something can be read in the next "then"
    )
}

export function chainCatch() {
    axios.get("http://localhost:3000/orders/1").then( ({data}) => {
        return axios.get(`http://localhost:3000/addresses/${data.shippingAddress}`)
    })
    .then(
        ({data}) => {setText(`City: ${data.city}`)}
    )
    .catch(err => setText(err)) //add error anywhere above in chain and this catch function will catch it
}

//sometimes we need to run a code when the promise settles .. we basically dont care if it succeeds (then block) or fails (catch block)
export function final() {
    showWaiting()
    axios.get("http://localhost:3000/orders/1").then( ({data}) => {
        return axios.get(`http://localhost:3000/addresses/${data.shippingAddress}`)
    })
    .then(
        ({data}) => {setText(`City: ${data.city}`)}
    )
    .catch(err => setText(err))
    .finally( () => { //finally function will run once all the above code gets executed (once the promise settles) ...
        setTimeout( () => {
            hideWaiting();
        }, 1500 )
        appendText(" -- completely done --")
    })
}