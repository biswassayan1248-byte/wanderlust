// "mapData" is set in views/listings/show.ejs
(function () {
    const mapDiv = document.getElementById("map");
    if (!mapDiv) return;

    if (!mapData.token) {
        mapDiv.innerHTML = "<p>Map is not available right now.</p>";
        return;
    }

    // the listing's position, or Delhi when the position is not known
    const hasPosition = Array.isArray(mapData.coords);
    const center = hasPosition ? mapData.coords : [77.209, 28.6139];

    mapboxgl.accessToken = mapData.token;
    const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v12",
        center: center,
        zoom: hasPosition ? 9 : 4
    });

    if (hasPosition) {
        new mapboxgl.Marker({ color: "#fe424d" })
            .setLngLat(center)
            // setText keeps the text safe from HTML injection
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(mapData.place))
            .addTo(map);
    }
})();
