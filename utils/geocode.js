// Turns "Malibu, United States" into [longitude, latitude] using the Mapbox
// Geocoding API. Returns null if there is no token, no match, or the request
// fails, so creating a listing never breaks because of the map.
module.exports = async (place) => {
    const token = process.env.MAP_TOKEN;
    if (!token || !place) return null;

    try {
        const url =
            "https://api.mapbox.com/search/geocode/v6/forward?q=" +
            encodeURIComponent(place) +
            "&limit=1&access_token=" +
            encodeURIComponent(token);
        const response = await fetch(url);
        if (!response.ok) return null;

        const data = await response.json();
        const coords =
            data.features &&
            data.features[0] &&
            data.features[0].geometry &&
            data.features[0].geometry.coordinates;

        return Array.isArray(coords) && coords.length === 2 ? coords : null;
    } catch (err) {
        console.log("Geocoding failed:", err.message);
        return null;
    }
};
