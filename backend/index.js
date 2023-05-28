import {
    mongoCountCrimes,
    mongoFindDuplicate,
    mongoInsertOne,
    mongoQueryMultiple,
    mongoQueryOne
} from "./mongodb-functions.js";
import {scrapeLinks, scrapeWebsite} from "./puppeteer-functions.js";
import {geocodeLatLong} from "./geoapify.js";
import express from 'express';
const app = express();
import bodyParser from "body-parser";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(req, res, next) {
    res.send('Greetings!');
});

app.post('/api/endpoint', async function (req, res) {
    const data = req.body;
    const action = req.body.action;
    console.log(req.ip);
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date+' '+time;
    console.log(dateTime);
    console.log('Received data: ', data);
    let response = "No action received.";
    let result = "";

    switch(action) {
        case "queryMultipleMongo":
            try {
                result = await mongoQueryMultiple(req.body.input, req.body.mongoDatabase, req.body.mongoCollection);
            } catch(err) {
                console.log(err.message);
            }
            break;
        case "scrapeDFHD":
            result = "Number of entries added: ";
            let counter = 0;
            try {
                let linksToScrape = await scrapeLinks(req.body.input);
                let finalArray = [];
                for (let i in linksToScrape) {
                    if (linksToScrape[i][0].includes("aspx?id=")) {
                        finalArray.push(linksToScrape[i][0]);
                    }
                }
                for (let j in finalArray) {
                    try {
                        let linkResult = await mongoFindDuplicate("link", finalArray[j], req.body.mongoDatabase, req.body.mongoCollection);
                        console.log(linkResult);
                        if (linkResult == 0) {
                            console.log(finalArray[j]);
                            let name = await scrapeWebsite(finalArray[j], "#Main_PageDisplay1_lblCommonName");
                            let location = await scrapeWebsite(finalArray[j], "#Main_PageDisplay1_lblLocation");
                            let importance = await scrapeWebsite(finalArray[j], "#Main_PageDisplay1_lblHighlight");
                            let plaque = await scrapeWebsite(finalArray[j], ".clearleft.nomp span p");
                            if (location.length != 0) {
                                let coordinates = await geocodeLatLong(location[0]);
                                let longitude = coordinates.features[0].properties.lon;
                                let latitude = coordinates.features[0].properties.lat;
                                let data = {
                                    "link": finalArray[j],
                                    "name": name[0],
                                    "location": location[0],
                                    "latitude": latitude,
                                    "longitude": longitude,
                                    "importance": importance[0],
                                    "plaque": plaque[0],
                                };
                                console.log(data);
                                console.log(await mongoInsertOne(data, req.body.mongoDatabase, req.body.mongoCollection));
                            }
                            counter++;
                        }
                    } catch(err) {
                        console.log(err.message);
                    }

                }
            } catch(err) {
                console.log(err.message);
            }
            result += counter;
            break;
        case "countCrimes":
            try {
                result = await mongoCountCrimes(req.body.input, req.body.mongoDatabase, req.body.mongoCollection);
            } catch(err) {
                console.log(err.message);
            }
            break;
        case "geocode":
            try {
                let coordinates = await geocodeLatLong(req.body.input);
                let longitude = coordinates.features[0].properties.lon;
                let latitude = coordinates.features[0].properties.lat;
                result = {
                    "latitude": latitude,
                    "longitude": longitude
                }
            } catch(err) {
                console.log(err.message);
            }
            break;
    }

    response = JSON.stringify({
        "action": action,
        "result": result
    });
    console.log(response);
    res.send(response);
});

app.listen(3000, function() {
    console.log('Server listening at http://127.0.0.1:3000/api/endpoint');
});