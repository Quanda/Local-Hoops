// Place Search
//https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=40.775616,-73.962371&keyword=basketball%20court&rankby=distance&key=AIzaSyBrOtbO2EJJwHUWSZzWy_Lxa0_pXlcuThA

const GOOGLE_API_KEY = "AIzaSyBrOtbO2EJJwHUWSZzWy_Lxa0_pXlcuThA";

export const findNearbyCourtsByLatLong = (lat, long, searchRadius, callback) => {
    const searchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&keyword=basketballcourt&radius=${searchRadius}&rankby=prominence&key=${GOOGLE_API_KEY}`
    console.log(searchUrl)
    fetch(searchUrl)
        .then(res => res.json())
        .then(json => {
            let courtData = json.results.map(court => {
                return {
                    lat: court.geometry.location.lat,
                    long: court.geometry.location.lng,
                    name: court.name,
                    location: court.vicinity,
                    key: court.place_id
                }
            })
            return courtData;
        })
        .then((courtData) => {
            //return callback(courtData)

            // get details - UNCOMMENT TO GRAB DETAILS
            return addCourtDetail(courtData, callback)
        })
        .catch(err => {console.error(err)})
}

export const findLocationByQuery = (query, callback) => {
    let searchQuery = encodeURIComponent(query.trim())
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${searchQuery}&key=${GOOGLE_API_KEY}`
    fetch(geocodeUrl)
        .then(res => res.json())
        .then(json => {
            callback(json.results[0].geometry.location.lat, json.results[0].geometry.location.lng)
        })
        .catch(err => {console.error(err)})
}

// Place Details
//https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJpccj45lYwokR0fLRqUZo6vI&key=AIzaSyBrOtbO2EJJwHUWSZzWy_Lxa0_pXlcuThA

const addCourtDetail = (courtData, callback) => {

    let updatedCourtData = [];
    courtData.forEach((court, i) => {
        const searchUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${court.key}&fields=formatted_address,url,photo&key=${GOOGLE_API_KEY}`
        fetch(searchUrl)
            .then(res => res.json())
            .then(json => {
                console.log(json)
                let updatedCourt = {
                    ...court,
                    address: json.result.formatted_address,
                    gMapsUrl: json.result.url
                }            
                updatedCourtData.push(updatedCourt)
            })
            .then(() => {
                if(i === courtData.length - 1) {
                    callback(updatedCourtData)
                }
            })
            .catch(err => {console.error(err)})
    })
}