import setText, { appendText } from "./results.mjs";

export function timeout() {
    const wait = new Promise((resolve) => {// Promise only takes an executor function as an argument ... The executor function takes an argument called a resolve funnction 
        //^ we will call resolve when our promise is ready to be fulfilled
        setTimeout(() => {
            resolve("Timeout..."); //anything passed inside our resolve function will be our return value
        }, 1500)
    })
    // ^ we now have a promise that will call resolve, which will settle the state to fulfilled, and then call our then function
    wait.then((text) => { setText(text) }) //our wait promise returns the text that is in the resolve function
}

export function interval() { // once a promise is settled, its state cannot be changed ... the setInterval function keeps on running but the state doesn't change
    let counter = 0;
    const wait = new Promise((resolve) => {
        setInterval(() => { //setInterval is same as setTimout, but this one fires repeatedly after the interval we tell
            console.log("Interval") //the console will show the counter run after every 1.5s
            resolve(`Timeout...${++counter}`);
        }, 1500)
    })
    wait.then((text) => { setText(text) })
        .finally(() => { appendText(`Done ${counter}`) })
}

export function clearIntervalChain() {
    let counter = 0;
    let interval; //a variable introduced to stop the interval in finally block
    const wait = new Promise((resolve) => {
        interval = setInterval(() => {
            console.log("Interval")
            resolve(`Timeout...${++counter}`);
        }, 1500)
    })
    wait.then((text) => { setText(text) })
        .finally(() => { clearInterval(interval) }) //by doing this, the interval will only run once
}

export function xhr() {
    let request = new Promise((resolves, rejected) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "http://localhost:3000/users/7");
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolves(xhr.responseText); // calling resolve will fulfil our promise
            }
            else {
                rejected(xhr.statusText)
            }
        }
        xhr.onerror = () => rejected("Request Failed")
        xhr.send()
    });
    request.then(result => setText(result))
        // .catch( onfailed ) //we have to attach a callback .. so we can also do it like this
        .catch((reason) => setText(reason))

    function onfailed(reason) {
        setText(reason)
    }
}

export function allPromises() {
    // axios are built on promises ... so all these 3 variables below are promises 
    let categories = axios.get("http://localhost:3000/itemCategories")
    let statuses = axios.get("http://localhost:3000/orderStatuses")
    let userTypes = axios.get("http://localhost:3000/userTypes")

    // we want to fireup all these promises at once asyncronously, and then also know when all these are finised executing
    Promise.all([categories, statuses, userTypes])   //this will queue all them up and wait for them to finish
        .then(([cat, stat, type]) => {   //attach "then" function to "all" function ... rather than a single argument, this "then" has an array as a result, in the same order in which we had our promises
            setText("")

            appendText(JSON.stringify(cat.data)); //remember these are axios objects, so we have to access the data property to see data
            appendText(JSON.stringify(stat.data));
            appendText(JSON.stringify(type.data));
        })
        .catch((reason) => { setText(reason) })
} //in this function, even if the first promise fails, the others wont execute becaus the promise will be fulfilled

export function allSettled() { // in this function, lets write a code so that even if a promise fails, the others might execute

    let categories = axios.get("http://localhost:30001/itemCategories") //failing this one deliberately by writing wrong port no... the other promises will still execute 
    let statuses = axios.get("http://localhost:3000/orderStatuses")
    let userTypes = axios.get("http://localhost:3000/userTypes")

    Promise.allSettled([categories, statuses, userTypes]) //here is the difference ... we are using "allSettled" instead of "all"
        .then((values) => {
            let results = values.map((v) => {  //create a new array called results from the values array by following the callback function instructions
                if (v.status === 'fulfilled') { //v: status & value (if fulfilled) ... //v: status & reason (if rejected)
                    return `FULFILLED: ${JSON.stringify(v.value.data[0])} `
                } else {
                    return `REJECTED: ${v.reason.message} `;
                }
            })
            setText(results)
        }).catch(reasons => setText(reasons))
}

export function race() {
    setText("not implemented")
    // Promise.race simply returns the fastest of the promises and stops executing ... the fastest promise can fulfil or reject, it doesn't matter
}

// "npm run dev" : our instance of local api is on port3000 ...
// "npm run secondary" : our instance of local api is now on port3001 ...

// promises are now old syntax ... now programmers use async/await
// we can declare any declared or undeclared function async, and its return value will be wrapped inside a promise that's returned. 