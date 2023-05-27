import fetch from "node-fetch";
let apiKey = process.env.GEOAPIFY_API_KEY;

export async function geocodeLatLong(addressQuery) {
    addressQuery.replace(" ", "%20");
    let requestOptions = {
        method: 'GET',
    };

    const response = fetch("https://api.geoapify.com/v1/geocode/search?text=" + addressQuery + "&apiKey=" + apiKey, requestOptions)
        .then(response => response.json())
        // .then(result => console.log(result))
        .catch(error => console.log('error', error));

    return response;
}