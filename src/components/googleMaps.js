import React from "react";
import { Input, Header } from "semantic-ui-react";

// import './index.css';

export default class GoogleMap extends React.Component {
  constructor() {
    super();
    this.state = {
      zoom: 18,
      maptype: "roadmap",
      place_formatted: "",
      place_id: "",
      place_location: ""
    };
  }

  toggleBounce = marker => {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(window.google.maps.Animation.BOUNCE);
    }
  };

  componentDidMount() {
    let map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: -6.256812, lng: 106.8106971 },
      zoom: 18,
      mapTypeId: "roadmap"
    });

    map.addListener("zoom_changed", () => {
      this.setState({
        zoom: map.getZoom()
      });
    });

    map.addListener("maptypeid_changed", () => {
      this.setState({
        maptype: map.getMapTypeId()
      });
    });

    let marker = new window.google.maps.Marker({
      map: map,
      position: { lat: -6.256812, lng: 106.8106971 },
      draggable: true,
      animation: window.google.maps.Animation.DROP,
      title: "Drag me!"
    });

    marker.addListener("click", () => this.toggleBounce(marker));

    // initialize the autocomplete functionality using the #pac-input input box
    let inputNode = document.getElementById("pac-input");
    map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(inputNode);
    let autoComplete = new window.google.maps.places.Autocomplete(inputNode);

    autoComplete.addListener("place_changed", () => {
      let place = autoComplete.getPlace();
      let location = place.geometry.location;

      this.setState({
        place_formatted: place.formatted_address,
        place_id: place.place_id,
        place_location: location.toString()
      });

      // bring the selected place in view on the map
      map.fitBounds(place.geometry.viewport);
      map.setCenter(location);

      marker.setPlace({
        placeId: place.place_id,
        location: location
      });
    });
  }

  render() {
    return (
      <div id="app">
        <Header
          as="h1"
          content="Google Maps"
          style={{
            fontWeight: "normal",
            marginBottom: 0,
            fontSize: "4em",
            marginTop: "1em"
          }}
        />
        <div id="pac-container">
          <Input id="pac-input" type="text" placeholder="Enter a location" />
        </div>
        <p>Place: {this.state.place_formatted}</p>
        <p>Place ID: {this.state.place_id}</p>
        <p>Location: {this.state.place_location}</p>

        <div id="map" />
      </div>
    );
  }
}
