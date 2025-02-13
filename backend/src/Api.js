const express = require('express');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const cors = require('cors');
const { getPaths } = require('./Options');
const { flights, getFlight, calculateAirTimeFlights } = require('./Flight');

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config({ path: './.env' });

host = '127.0.0.1'

// get arg0 as the host
if (process.argv.length > 2) {
    host = process.argv[2];
}

app.get('/getflight', (req, res) => {
    const query = req.query;
    const flightid = query.flightid;
    // check if all parameters are present
    if (!flightid) {
        res.status(400).send('Missing parameters: flightid: ' + flightid);
        return;
    }

    const flight = getFlight(parseInt(flightid));
    if (flight) {
        res.status(200).send({ status: 'success', data: flight });
    } else {
        res.status(404).send({ status: 'error', data: 'Flight not found' });
    }
});

app.get('/generateoptions', (req, res) => {
    const query = req.query;
    const source = query.source; // e.g YYZ
    const destination = query.destination; // e.g. YYC
    const numberofstops = query.numberofstops; // e.g. 1
    const departuredate = query.departuredate; // e.g. 2021-05-01
    const returndate = query.returndate; // e.g. 2021-05-01
    // check if all parameters are present
    if (!source || !destination || !numberofstops || !departuredate) {
        res.status(400).send('Missing parameters: source: ' + source + ', destination: ' + destination + ', numberofstops: ' + numberofstops + ', departuredate: ' + departuredate + ', returndate: ' + returndate);
        return;
    }
    let data = {};
    console.log('Source: ' + source + ', Destination: ' + destination + ', Number of stops: ' + numberofstops + ', Departure date: ' + departuredate + ', Return date: ' + returndate);
    const departPaths = getPaths(flights, source, destination, parseInt(numberofstops), departuredate, departuredate);
    data = { departPaths };
    console.log('Departure paths: ' + departPaths.length);
    if(returndate != null) {
        const returnPaths = getPaths(flights, destination, source, parseInt(numberofstops), returndate, returndate);
        data = { departPaths, returnPaths };
        console.log('Return paths: ' + returnPaths.length);
    }
    res.status(200).send({ status: 'success', data: data });
});

app.get('/calculateairtime', (req, res) => {
    const query = req.query;
    let flightids = query.flightids;
    // check if all parameters are present
    if (!flightids) {
        res.status(400).send('Missing parameters: flightids: ' + flightids);
        return;
    }
    flightids = JSON.parse(flightids);


    let flights = []
    for (let i = 0; i < flightids.length; i++) {
        flights.push(getFlight(flightids[i]));
    }
    let totalairtime = calculateAirTimeFlights(flights);
    res.status(200).send({ status: 'success', data: totalairtime });
});

app.get('/generatereceipt', (req, res) => {
    const query = req.query;
    let departureflightids = query.departureflightids;
    let returnflightids = query.returnflightids;
    const name = query.name;
    const email = query.email;
    // check if all parameters are present
    if(!departureflightids || !returnflightids || !name || !email) {
        res.status(400).send('Missing parameters: departureflightids: ' + departureflightids + ', returnflightids: ' + returnflightids + ', name: ' + name + ', email: ' + email);
        return;
    }

    departureflightids = JSON.parse(departureflightids);
    if(returnflightids != 'null') {
        returnflightids = JSON.parse(returnflightids);
    }

    console.log('Departure flight ids: ' + departureflightids);
    console.log('Return flight ids: ' + returnflightids);

    deptflights = [];
    for (let i = 0; i < departureflightids.length; i++) {
        deptflights.push(getFlight(departureflightids[i]));
    }

    returnflights = [];
    if(returnflightids != 'null') {
        for (let i = 0; i < returnflightids.length; i++) {
            returnflights.push(getFlight(returnflightids[i]));
        }
    }

    // for each flight, put air time
    for (let i = 0; i < deptflights.length; i++) {
        deptflights[i].airtime = calculateAirTimeFlights([deptflights[i]]);
    }

    if(returnflightids != 'null') {
        for (let i = 0; i < returnflights.length; i++) {
            returnflights[i].airtime = calculateAirTimeFlights([returnflights[i]]);
        }
    }



    let obj = {
        status: 'success',
        data: {
            name,
            email,
            departureflights: {
                flights: deptflights,
                totalairtime: calculateAirTimeFlights(deptflights),
            },
            returnflights: returnflightids != null ? {
                flights: returnflights,
                totalairtime: calculateAirTimeFlights(returnflights),
            } : null,
            totalairtime: calculateAirTimeFlights(deptflights) + (returnflightids != null ? calculateAirTimeFlights(returnflights) : 0),
        }
    }
    res.status(200).send(obj);
});

const server = app.listen(3001, host, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`API listening at http://${host}:${port}`);
});