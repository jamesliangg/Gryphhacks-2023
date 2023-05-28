# Data Sources
https://data.torontopolice.on.ca/maps/major-crime-indicators-open-data
https://www.pc.gc.ca/apps/DFHD/default_eng.aspx
https://open.toronto.ca/dataset/parks-and-recreation-facilities/

# References
https://stackoverflow.com/questions/25163658/mongodb-return-true-if-document-exists
https://www.mongodb.com/docs/manual/reference/method/db.collection.countDocuments/#mongodb-method-db.collection.countDocuments
https://dev.to/cloudx/how-to-use-puppeteer-inside-a-docker-container-568c
https://docs.mapbox.com/help/tutorials/custom-markers-gl-js/#add-popups
https://www.digitalocean.com/community/tutorials/use-expressjs-to-deliver-html-files
https://www.mongodb.com/docs/drivers/node/current/fundamentals/aggregation/

## Importing Data to Azure Cosmos DB
`mongoimport --uri="<MONGO_CONNECT_STRING>" --db "<SOURCE_DATABASE>" --collection "<SOURCE_COLLECTION>" --ssl --type csv --writeConcern=\"{w:0}\" --file <CSV_FILE_PATH> --headerline`

### Building Docker container
```
docker buildx build --platform=linux/amd64 --output type=docker -t jamesliangg/gryphhacks .

docker run -p 3000:3000 -e GEOAPIFY_API_KEY="<GEOAPIFY_API_KEY>" -e MONGO_CONNECT_STRING="<MONGO_CONNECT_STRING>" -d jamesliangg/gryphhacks

docker ps

docker logs <container id>

docker kill <container id>

docker push jamesliangg/gryphhacks
```

### Azure Containers
```
az container create --resource-group myResourceGroup --name mycontainer \
    --image docker.io/jamesliangg/gryphhacks --environment-variables GEOAPIFY_API_KEY="<COHERE_KEY>" MONGO_CONNECT_STRING="<DEEPL_KEY>" \
    --ip-address Public --ports 80 3000 --os-type Linux
```

```
az containerapp update \
    --name <APPLICATION_NAME> \
    --resource-group <RESOURCE_GROUP_NAME> \
    --image <IMAGE_NAME>
```

# API Doucmentation
POST Request

`http://<CONTAINER_PUBLIC_IP>:3000/api/endpoint`

## Actions
<hr>

## /queryMultipleMongo

Returns objects that fit the longitude and latitude
### Request body data in raw JSON
```
{
    "action": "queryMultipleMongo",
    "input": [["longitude", -79.39,  -79.38], ["latitude", 43.640, 43.6444]],
    "mongoDatabase": "aries",
    "mongoCollection": "historicaldesignations"
}
```

### Response
```
{
    "action": "queryMultipleMongo",
    "result": [
        {
            "_id": "6472661fee15b7738da930b2",
            "link": "https://www.pc.gc.ca/apps/DFHD/page_nhs_eng.aspx?id=12571",
            "name": "National Farm Radio Forum National Historic Event",
            "location": "250 Front Street West, Toronto, Ontario",
            "latitude": 43.6443881,
            "longitude": -79.3875932,
            "importance": "Exploited the power of radio technology to pioneer interactive distance education",
            "plaque": "This innovative national radio program introduced interactive distance education to rural audiences. Broadcast between 1941 and 1965 by the Canadian Broadcasting Corporation, its programming united farming communities from across the country around common interests. Relying upon discussion groups to enable informed conversations among neighbours, the program both instilled a broad sense of community and fostered local leadership and initiatives. This successful model would later be adopted by UNESCO to provide adult education for remote populations in many countries around the world."
        },
        {
            "_id": "647266efee15b7738da930d3",
            "link": "https://www.pc.gc.ca/apps/DFHD/page_nhs_eng.aspx?id=13171",
            "name": "Gould, Glenn National Historic Person",
            "location": "250 Front Street West, Toronto, Ontario",
            "latitude": 43.6443881,
            "longitude": -79.3875932,
            "importance": "Brilliant, eccentric, and recognized internationally as one of the great classical musicians of the 20th century",
            "plaque": "Recognized internationally as one of the great classical musicians of the 20th century, this pianist of prodigious talent and originality is best known for his masterful renditions of the counterpoint of J. S. Bach. Retiring from the concert stage at the young age of 32, he exploited new sound technologies to their fullest and left a rich musical heritage in his many recordings. A visionary thinker and author, who foresaw the profound impact of technology on culture and society, he also pursued a remarkably diverse career in radio and television. Long after his premature death, Gould continues to challenge and inspire."
        }
    ]
}
```
<hr>

## /scrapeDFHD

Returns acknowledgement of write operation and amount written
### Request body data in raw JSON
```
{
    "action": "scrapeDFHD",
    "input": "https://www.pc.gc.ca/apps/DFHD/results-resultats_eng.aspx?p=1&m=100&q=&desCheck=NHS&desCheck=EVENT&desCheck=PERSON&desCheck=HRS&desCheck=FHBRO&desCheck=HL&c=Toronto&ctl00%24Main%24PageSearch1%24ddlProvince=100058&dey=&ctl00%24Main%24PageSearch1%24ddlCustodian=",
    "mongoDatabase": "aries",
    "mongoCollection": "historicaldesignations"
}
```

### Response
```
{
    "action":"scrapeDFHD","result":"Number of entries added: 2"
}
```
<hr>

## /countCrimes

Returns number of crimes committed in specified area for 2022
### Request body data in raw JSON
```
{
    "action": "countCrimes",
    "input": [["LONG_WGS84", -79.33, -79.325], ["LAT_WGS84", 43.75, 43.8]],
    "mongoDatabase": "aries",
    "mongoCollection": "torontocrime"
}
```

### Response
```
{
    "action": "countCrimes",
    "result": 77
}
```
<hr>

## /geocode

Returns number of crimes committed in specified area for 2022
### Request body data in raw JSON
```
{
    "action": "geocode",
    "input": "50 Merton Street, Toronto, Ontario"
}
```

### Response
```
{
    "action": "geocode",
    "result": {
        "latitude": 43.69658652941177,
        "longitude": -79.39442482352942
    }
}
```
<hr>

## /mongoSortCrimes

Returns list of crimes and occurrences in area for specified months in 2022 
### Request body data in raw JSON
```
{
    "action": "sortCrimes",
    "input": [["LONG_WGS84", -79.33, -79.325], ["LAT_WGS84", 43.75, 43.8], ["OCC_MONTH", "October"]],
    "mongoDatabase": "aries",
    "mongoCollection": "torontocrime"
}
```

### Response
```
{
    "action": "sortCrimes",
    "result": [
        {
            "_id": "Assault",
            "count": 2
        },
        {
            "_id": "Auto Theft",
            "count": 5
        },
        {
            "_id": "Break and Enter",
            "count": 1
        }
    ]
}
```
<hr>