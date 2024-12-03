 var endpoint = "http://localhost:3000/";

// some alternate endpoints that you can experiment with are below.
// var endpoint = "http://localhost:3000/myroute";
// var endpoint = "http://localhost:3000/readfile";
// var endpoint = "http://localhost:3000/writefile";


// Example of calling an endpoint with fetch
 
function callMyAPI() {
    fetch(endpoint)
        .then(res => res.text()) //extract text and pass it downstream
        .then(res => { //post extracted text to the client
            document.getElementById("data").textContent = res; //show result
        });
}



