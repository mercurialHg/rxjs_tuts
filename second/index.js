
// from: https://gist.github.com/staltz/868e7e9bc2a7b8c1f754

const axios = require("axios");
const Rx = require("rxjs");
const {
  Observable,
  map,
  flatMap
} = Rx;
const {
  log
} = console;

//////////// everything is a stream ////////////

const urlSingle = 'https://jsonplaceholder.typicode.com/posts/';
const urlSingle_bad = 'https://sonplaceholder.typicode.com/posts/';
const urlList = [
  'https://jsonplaceholder.typicode.com/posts/1',
  'https://jsonplaceholder.typicode.com/posts/2',
  'https://jsonplaceholder.typicode.com/posts/3',
]

const urlList_bad = [
  'https://jsonplaceholder.typicode.com/posts/1',
  'https://jsonplaceholder.typicode.com/pots/2',
  'https://jsonplaceholder.typicode.com/pots/3',
]

var requestStream$_single = Rx.of(urlSingle);
var requestStream$_bad = Rx.of(urlSingle_bad);
var requestStream$_list = Rx.from(urlList);
var requestStream$_list_bad = Rx.from(urlList_bad);


var requestMetaStream$ = requestStream$_list_bad.pipe(
  map(
    /// for each item in stream, does something to each
    /// axios.get(...) returns a promise
    /// Rx.from creates observable from promise
    /// map behaviour: 
    /// transforms the items emitted by an Observable into Observables
    requestUrl => { 
      var axios_promise_observable  = Rx.from(axios.get(requestUrl)) /// from === fromPromise (deprecated)
      return axios_promise_observable
    } 
  )
)

var requestMetaStream$ = requestStream$_list_bad.pipe(
  flatMap(
    /// for each item in stream, does something
    /// axios.get(...) returns a promise
    /// Rx.from creates observable from promise
    /// flatMap behaviour: 
    /// transforms the items emitted by an Observable into Observables, then flatten the emissions from those into a single Observable
    requestUrl => Rx.from(axios.get(requestUrl)) 
  )
)

requestMetaStream$.subscribe({
  next: next => {
    console.log("next: success")
  },
  error: err => {
    console.log("error: has error")
  },
})