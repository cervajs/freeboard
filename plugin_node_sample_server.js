// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ freeboard.io-node.js                                               │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2014 Hugo Sequeira (https://github.com/hugocore)       │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Licensed under the MIT license.                                    │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Simple node.js and sockets.io server to test the node.js plugin.   │ \\
// └────────────────────────────────────────────────────────────────────┘ \\

/*
 * Configurations and helpers
 */
var namespace = '/cc';
var room = 'queues';
var refreshTimer = 2000;
var connectionscounter = 0;
var eventNames = ['showQueues', 'showAgentMissed'];
var serverport = 8989;

var ans1 = 0;
var miss1 = 0;
var ans2 = 0;
var miss2 = 0;
var sla = 0;
var ag = [0,0,0,0,0];

/*
 * Project dependencies
 */
var io = require('socket.io')(serverport);

/*
 * Collects data
 */

// Implement the methods to handle the new events
function newEventCallback(eventName, message) {

    // Construct the json object to be propagated
    /*
     var json = {
     "send_queues": [
     {
     queue: message.queue,
     answered: message.answered,
     missed: message.missed
     }]
     };
     */

    // Invokes propagation
    propagatesEvent(eventName, JSON.stringify(message));
}

// Connection to external data sources
function connectToExternalSources() {

    // Simulate the connection and new messages with a timer function
    setInterval(function () {



        // construct message
        var oneHourInMilis = 3600000;
        var message = {
            "header": [
                {
                    Name: "Name",
                    Answered: "Answered",
                    Missed: "Missed",
                    SLA: "SLA"

                }
            ],
            "data": [
                {
                    Name: "sales",
                    Answered: ans1 = ans1 + Math.floor(Math.random() * 5),
                    Missed: miss1 = miss1 + Math.floor(Math.random() * 2),
                    SLA: Math.floor(Math.random() * (100 - 70) + 70)
                },
                {
                    Name: "support",
                    Answered: ans2 = ans2 + Math.floor(Math.random() * 5),
                    Missed: miss2 = miss2 + Math.floor(Math.random() * 2),
                    SLA: Math.floor(Math.random() * (100 - 70) + 70)
                }
            ]
        };


        newEventCallback('showQueues', message);


        var oneHourInMilis = 3600000;
        var message = {
            "header": [
                {
                    Name: "Name",
                    Answered: "Answered"

                }
            ],
            "data": [
                {
                    Name: "Dzon Rambo",
                    Answered: ag[0] = ag[0] + Math.floor(Math.random() * 10)

                },
                {
                    Name: "Angelina Jolda",
                    Answered: ag[1] = ag[1] + Math.floor(Math.random() * 3)
                },
                {
                    Name: "Donald Dump",
                    Answered: ag[2] = ag[2] + Math.floor(Math.random() * 2)
                },
                {
                    Name: "Pretty Woman",
                    Answered: ag[3] = ag[3] + Math.floor(Math.random() * 3)
                },
                {
                    Name: "Chuck Norris",
                    Answered: ag[4] = ag[4] + Math.floor(Math.random() * 10)
                }
            ]
        };


        newEventCallback('agentsAnswered', message);


    }, refreshTimer);

}

/*
 * Data propagation
 */

// Propagates event through all the connected clients
function propagatesEvent(eventName, event) {
    if (connectionscounter > 0) {
        io.of(namespace).to(room).emit(eventName, event);
        console.log("New event propagated in: Namespace='%s' Room='%s' EventName='%s' Event='%s'", namespace, room, eventName, event);
    }
}

/*
 * Handle Sockets.io connections
 */

// Event handlers
io.of(namespace).on('connection', function (socket) {

    console.log("New client connected.");

    // Do some logic for every new connection
    connectionscounter++;

    // On subscribe events join client to room
    socket.on('subscribe', function (room) {
        socket.join(room);
        console.log("Client joined room: " + room);
    });

    // On disconnect events
    socket.on('disconnect', function (socket) {
        console.log("Client disconnect from rooms.");
        connectionscounter--;
    });

});

/*function puts(message) {
 console.log(message);
 }*/

/*
 *  Run
 */
console.log("Starting Node.js server with namespace='%s' and room='%s'", namespace, room);
connectToExternalSources();