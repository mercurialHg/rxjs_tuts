/*
 **
 **
 **  Observables from events
 **
 **
 **
 */

const Rx = rxjs;
const btn = $("#btn"),
    input = $("#input")

/// fromEvent --- creates an Observable from DOM Events, or 
/// Node.js EventEmitter events or others.
const btnStream$ = Rx.fromEvent(btn, "click");

btnStream$.subscribe(
    (e) => {
        console.log(e.target.offsetHeight)
    },
    (err) => {
        console.error("error in stream")
    },
    () => {
        console.log("completed")
    }
);


/// creates observable from dom events registered on the #input object
/// seems it works with jquery
/// inputStream$ capteaza orice event de pe elem "input"  --- sau le inglobeaza in sine ca o colectie de "lucruri" de care se pot atasa niste observatori
/// in cazul specific al eventurilor de DOM, nu e vba de o colectie in sine, ci de o colectie care contine un singur event
/// (?) how does fromEvent work internally
/// (?) what kind of error can appear from a stream of DOM events
/// (?) is the "complete" parameter necessary in this case? Why / Why not? 
/// --- dom events like click don't have a "complete" state, like a HTTP request or traversing an array
/// --- also, a "complete" state is not relevant as they inform the browser a user action has already completed
/// --- a click event is not a process with a start and an end, at least from the perspective of the part of the brojser JS interfaces with

const inputStream$ = Rx.fromEvent(input, "keyup");

inputStream$.subscribe(
    (e) => {
        console.log(e.currentTarget.value)
    },
    (err) => {
        console.error("error in stream")
    },
    () => {
        console.log("completed")
    }
);

$("#fromEvents").hide()


/**************/
/****Array*****/
/**************/

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const numbers$ = Rx.from(numbers);
/// following code executes immediately, although in a weird way: see comments
numbers$.subscribe(
    value => {
        // console.log(value);
        // throw new Error("fuck") --- if uncomment, 
        // 1) why does it iterate through all array
        // 2) why does this throw after iteration and "complete" callbacks
    },
    err => {
        console.error(err, "______")
    },
    (complete) => { /// complete param is undefined
        // console.log("completed", complete)
    }
)

/// create DOM elements from list

const books = [{
        title: "book title 1",
        author: "author1"
    },
    {
        title: "book title 2",
        author: "author2"
    },
    {
        title: "book title 3",
        author: "author3"
    },
]

/// observable created 
// const books$ = Rx.from(books)
// const $list = $("#fromArrays ul")
// /// subscription - in this case, execution is immediate
// /// subscribed "success" callback (first) executes for each item in the stream (the array of objects)
// books$.subscribe(
//     post => {
//         console.log(post);
//         $list.append(`<li> "<strong>${post.title}</strong>" - ${post.author} </li>`)
//     }
// )

/************ Using Set data structure **************/
// const set = new Set(["hello", 44, {title: "My title"}])
// const set$ = Rx.from(set)

// set$.subscribe(
//     setItem => {
//         console.log(setItem);
//     }
// )

/************ Using Map data structure **************/

// const map = new Map([1,2], [3,4], [5, 6])
// const set$ = Rx.from(set)

// set$.subscribe(
//     setItem => {
//         console.log(setItem);
//     }
// )

/************ Create Observer from scratch **************/

// /// create an observable referenced through 'source$'
// const source$ = Rx.Observable.create((observer) => {
//     /// seems 'observer' param is an instance of "Subscription" class
//     console.log("Creating Observable, observer param = \n", observer);


// })

// /// the Observable triggers an 
// source$.subscribe(
//     next => {
//         console.log(next)
//     },
//     err => {
//         console.log(err)
//     },
//     complete => {
//         console.log("completed")
//     }
// )


/************ Test **************/

const arr_num = [1, 2, 3, 4]

const arr_num$ = new Rx.from(arr_num);
const observer1 = {
    next: (value) => { /// called for each item inside stream
        console.log(value)
    },
    error: (error) => { /// catches errors abd interruts stream
        console.log("found Error: \n", error)
    },
    complete: () => {
        console.log("completed")
    }
}


// arr_num$.subscribe(observer1)

/************ Create Observer from scratch rewrite **************/

const {Observable} = Rx;

const fromScratch$ = new Observable(subscriber => { 
    /// why is this a subscriber object?  
    /// shouldn't the subscriber receive updates when stream changes/arrives, and not generate a stream?
    subscriber.next(1); /// add to stream 
    subscriber.next(2); /// add to stream
    subscriber.next(3); /// add to stream
    setTimeout(() => {
        subscriber.next(4);
        subscriber.complete();
        subscriber.next("5?"); /// will this tun after complete? Nope!!!
    }, 1000);
});

const { catchError } = Rx.operators;


const fromScratch2$ = Observable.create(subscriber => {
    subscriber.next(1);
    subscriber.next(2);
    subscriber.next(3);
    // throw new Error("test error")
    subscriber.error(new Error("something went wrong")) 
    /// code exec ends here --- if caught, ends here, but stream will complete;
    /// but immediately, not after timeout
    setTimeout(() => {
        subscriber.next(4);
        subscriber.next(5);
        subscriber.next(6);
        subscriber.next(7);
        subscriber.complete();
    }, 3000);
});

fromScratch$
    .pipe(
        catchError(err => {
            console.log(Rx.of(err));
            return Rx.of(new Error("text")) 
            /// respect the chain --- must return a specific type of object 
            /// to next method in chain (here: .subscribe)
        })
    )
    .subscribe(observer1)