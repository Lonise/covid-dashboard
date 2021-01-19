import L from './leaflet/leaflet.js';
import global from './script';

export default class Map {
  getMap(api, options) {
    this.api = api;
    const mapOptions = {
      center: [0, 0],
      zoom: 1.5,
      maxBounds: [[90, -180], [-90, 180]],
    };
    this.map = new L.map('map', mapOptions);
    const layer = new L.TileLayer('https://tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey=d981ff9010404ba59c45552f52477d4d');
    this.map.addLayer(layer);
    this.map.setMinZoom(1.5);
    this.map.setMaxZoom(6);
    this.getIcons(options);
  }

  showCountry(country, option) {
    try {
      const currentCountry = this.api.find((el) => el.countryInfo.iso2 === country);
      this.map.setView([currentCountry.countryInfo.lat, currentCountry.countryInfo.long],
        this.map.getZoom() < 3 ? 3 : this.map.getZoom());
    } catch (error) {
      this.map.setView([0, 0], 1.5);
    }
    this.getIcons(option);
  }

  getIcons(option) {
    this.map.eachLayer((layer) => {
      if (layer._leaflet_id !== 26) layer.remove();
    });
    this.options = option;
    let currentParam;
    let markerColor;
    if (this.options.name.match(/confirmed/)) this.options.name = 'cases';
    if (this.options.name.match(/death/)) markerColor = '#ff2d2e';
    else if (this.options.name.match(/recovered/)) markerColor = '#44a842';
    else markerColor = '#01F1E3';
    if (this.options.daily) currentParam = `today${this.options.name[0].toUpperCase() + this.options.name.slice(1)}`;
    else currentParam = this.options.name;
    this.api.forEach((el) => {
      const markerOptions = {
        radius: this.getMarkerRad(currentParam, el[currentParam]),
        clickable: true,
        color: markerColor,
        stroke: false,
        fillOpacity: 1,
      };
      const perOneHundred = 100000 / el.population;
      const count = this.options.per ? (el[currentParam] * perOneHundred).toFixed() : el[currentParam];
      const param = this.options.per ? `${currentParam}Per100k` : currentParam;
      const marker = new L.circleMarker([el.countryInfo.lat, el.countryInfo.long], markerOptions);
      const markerInfo = new L.marker([el.countryInfo.lat, el.countryInfo.long], {
        icon: L.divIcon({
          className: `info ${el.countryInfo.iso2}`,
          iconSize: [markerOptions.radius * 6, markerOptions.radius * 6],
        }),
        title: `${el.country} ${param}: ${count}`,
      });
      marker.addTo(this.map);
      markerInfo.addTo(this.map);
    });
    document.querySelectorAll('.info').forEach((el) => el.addEventListener('click', (e) => global.changeCountry(e.target.classList[2])));
  }

  getMarkerRad(currentParam, count) {
    const settingArr = [30, 20, 15, 10, 5, 5];
    const max = Math.max.apply(null, this.api.map((el) => el[currentParam]));
    const index = (max / (count * 3)) > 5 ? 5 : (max / (count * 3)).toFixed();
    return settingArr[index];
  }

  getFullScreen() {
    this.map.invalidateSize();
    this.map.setView([0, 0], 2.5);
  }
}
