// Input API token
mapboxgl.accessToken = 'pk.eyJ1IjoiamFtZXNsaWEiLCJhIjoiY2xpNmpzZnlnMGRiZDNycWhvcHVnYnNyZCJ9.K01n3ZOVqcGrNx3fcJIjUA';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: [-79.3818364, 43.6449033],
    zoom: 16
});

// code from the next step will go here!
const geojson = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [-79.39442482352942, 43.69658652941177]
            },
            properties: {
                title: 'Girl Guide Movement in Canada National Historic Event',
                description: 'The Girl Guides is one of the largest youth movements both in Canada and around the world. The Guiding program is based on the scouting principles of Lord Baden-Powell which emphasize the outdoors, character-building, good citizenship and self-reliance. Since 1910, the organisation has provided Canadian girls and women with strong inspirational role models in order to nurture responsible, service-oriented citizens and community leaders. Headquartered in Toronto, Girl Guides of Canada has units in every province and territory, and has been largely funded throughout much of its history through sales of its famous cookies.'
            }
        },
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [-79.3818364, 43.6449033]
            },
            properties: {
                title: 'Your Location',
                description: 'You are here'
            }
        },
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [-79.38171, 43.64877]
            },
            properties: {
                title: 'Stained Glass of Robert McCausland Limited National Historic Event',
                description: 'This magnificent dome represents an extensive legacy of stained glass produced by the McCausland family and their employees for buildings throughout Canada.  In business under various company names since 1856, the Toronto-based firm Robert McCausland Limited is credited with the earliest and most numerous examples of Canadian stained glass and the longest record for glasswork in North America.  Richly adorned with mythological figures and provincial emblems, the dome was executed in 1885 by Robert McCausland, while working for his father, Joseph, the firm\'s founder.'
            }
        },
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [-79.37907772483726, 43.64343375]
            },
            properties: {
                title: 'Toronto Maple Leafs National Historic Event',
                description: 'The Toronto Maple Leaf Hockey Club traces its origins to one of the first teams to compete in the National Hockey League, formed in 1917. Known by 1918 as the Arenas, it became the St. Patrick’s Hockey Club, which co-owner and manager Conn Smythe renamed the Maple Leafs in 1927. During the Great Depression, he commissioned the building of Maple Leaf Gardens, where announcer Foster Hewitt continued play-by-play broadcasts, bringing the Leafs national attention. One of the most storied major-league sports clubs in North America, Toronto’s NHL team won 13 Stanley Cup championships between 1918 and 1967.'
            }
        },
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [-79.3800626, 43.6458509]
            },
            properties: {
                title: 'Union Station (Canadian Pacific and Grand Trunk) National Historic Site of Canada',
                description: 'This station was built between 1915 and 1920 to the designs of Ross and Macdonald, H.G. Jones and J.M. Lyle. Subsequent to the relocation of the tracks, it was opened in 1927. It is the finest example in Canada of stations erected in the classical Beaux-Arts style during an era of expanding national rail networks and vigorous urban growth. Its sweeping facade and imposing Great Hall exhibit the monumental architecture and dramatic use of enclosed space characteristic of the Beaux-Arts movement.'
            }
        }
    ]
};

// add markers to map
for (const feature of geojson.features) {
    // create a HTML element for each feature
    const el = document.createElement('div');
    el.className = 'marker';

    // make a marker for each feature and add to the map
    // new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates).addTo(map);

    new mapboxgl.Marker(el)
        .setLngLat(feature.geometry.coordinates)
        .setPopup(
            new mapboxgl.Popup({ offset: 25 }) // add popups
                .setHTML(
                    `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
                )
        )
        .addTo(map);
}
