<template>
  <div ref="map-div" v-bind:class="isModal ? 'modal-map' : 'map'"></div>
</template>

<script>
import Feature from "ol/Feature";
import Map from "ol/Map";
import View from "ol/View";
import Point from "ol/geom/Point";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import { Icon, Style } from "ol/style";
import { fromLonLat, transform } from "ol/proj";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";

import { eventBus } from "../../util/eventBus";

export default {
  name: "LocationMap",
  props: [
    "clickable",
    "longitude",
    "latitude",
    "navigator",
    "isModal",
    "shouldAnimate",
  ],
  data() {
    return {
      map: null,
      vectorLayer: null,
      location: {
        longitude: null,
        latitude: null,
        address: {
          city: null,
          street: null,
          streetNumber: null,
          zipCode: null,
          country: null,
        },
      },
    };
  },
  created() {
    eventBus.$on("center-location-map", (coords) => {
      if (this.shouldAnimate) {
        this.animateToPoint(coords.longitude, coords.latitude);
      }
    });
  },
  mounted() {
    this.loadMap();
  },
  methods: {
    loadMap: function () {
      if (this.longitude !== undefined)
        this.location.longitude = this.longitude;
      if (this.latitude !== undefined) this.location.latitude = this.latitude;

      let layers = [this.getRasterLayer()];

      this.vectorLayer = this.getVectorLayer();

      if (this.vectorLayer !== null) {
        layers.push(this.vectorLayer);
      }

      this.map = new Map({
        target: this.$refs["map-div"],
        layers: layers,
        view: new View({
          center: fromLonLat(this.getCenterPoint()),
          zoom: 16,
        }),
      });

      if (this.navigator !== undefined) {
        navigator.geolocation.getCurrentPosition((pos) => {
          this.animateToPoint(pos.coords.longitude, pos.coords.latitude);
        });
      }

      if (this.clickable === true) {
        this.map.on("click", (event) => {
          const coordinate = transform(
            event.coordinate,
            "EPSG:3857",
            "EPSG:4326"
          );
          this.location.longitude = coordinate[0];
          this.location.latitude = coordinate[1];
          const url = `http://nominatim.openstreetmap.org/reverse?format=json&lon=${coordinate[0]}&lat=${coordinate[1]}`;
          const init = {
            mode: "cors",
          };
          const req = new Request(url, init);
          fetch(req).then((response) => {
            response.json().then((data) => {
              let address = data.address;
              this.location.address.street = address.road;
              this.location.address.streetNumber = address.house_number;
              this.location.address.zipCode = address.postcode;
              this.location.address.city = address.city;
              this.location.address.country = address.country;
              this.$emit("location-changed", this.location);
            });
          });
        });
      }
    },
    updatePin: function () {
      if (this.vectorLayer != null) {
        this.map.removeLayer(this.vectorLayer);
      }
      this.vectorLayer = this.getVectorLayer();
      this.setVectorLayerSource(this.vectorLayer);
      this.map.addLayer(this.vectorLayer);
    },
    animateToPoint: function (longitude, latitude) {
      const coords = fromLonLat([longitude, latitude]);
      this.map.getView().animate({ center: coords, zoom: 16 });
    },
    getRasterLayer: function () {
      return new TileLayer({
        source: new OSM(),
      });
    },
    getVectorLayer: function () {
      if (this.location.latitude !== null) {
        const vectorLayer = new VectorLayer();
        if (this.location.longitude !== null)
          this.setVectorLayerSource(vectorLayer);
        return vectorLayer;
      }
      return null;
    },
    setVectorLayerSource(vectorLayer) {
      const iconFeature = new Feature({
        geometry: new Point(
          fromLonLat([this.location.longitude, this.location.latitude])
        ),
      });
      const iconStyle = new Style({
        image: new Icon({
          anchor: [0.5, 1],
          scale: 1,
          src: require("@/assets/pin.png"),
        }),
      });
      iconFeature.setStyle(iconStyle);
      const vectorSource = new VectorSource({
        features: [iconFeature],
      });
      vectorLayer.setSource(vectorSource);
    },
    getCenterPoint() {
      if (
        this.longitude !== undefined &&
        this.latitude !== undefined &&
        this.location.longitude !== null &&
        this.location.latitude !== null
      ) {
        return [this.location.longitude, this.location.latitude];
      } else return [19.833549, 45.267136];
    },
  },
  watch: {
    longitude: function (newValue) {
      this.location.longitude = newValue;
      this.updatePin();
    },
    latitude: function (newValue) {
      this.location.latitude = newValue;
      this.updatePin();
    },
  },
};
</script>

<style scoped>
.modal-map {
  height: 300px;
  width: 100%;
}

.map {
  height: 100%;
  width: 100%;
}
</style>
