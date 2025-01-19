mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 7, // starting zoom
});

const marker1 = new mapboxgl.Marker({ color: "black" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 })
      .setHTML(
        `<h4>${listing.title}</h4><p>Exact Location provided after Booking</p>`
      )
      .setMaxWidth("300px")
  )
  .addTo(map);
