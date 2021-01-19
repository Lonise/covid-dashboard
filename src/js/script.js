import '../css/style.scss';
import '../css/style.css';
import './leaflet/leaflet.css';
import { getObjFromApi } from './api.js';
import Schedule from './schedule.js';
import GlobalMap from './interactiveMap.js';
import table from './table';
import countriesList from './countriesList';
import findCountry from './findCountry';

class Global {
  constructor() {
    this.summary = {};
    this.population = {};
    this.schedule = new Schedule();
    this.table = table;
    this.countriesList = countriesList;
    this.findCountry = new findCountry();
    this.map = new GlobalMap();
    // создание инстанса ваших модулей
    this.BtnOptionsArr = document.querySelectorAll('.nav_options');
    this.optionsCallArr = document.querySelectorAll('.option-set');
    this.btnFullScreen = document.querySelectorAll('.btn_fullscreen');
    this.globalCases = document.querySelector('.global_cases');
    this.hideOptionsBul = true;
    this.option = { // параметры
      name: 'cases', // Deaths, Recovered
      daily: false, // по дням
      per: false, // абсолютные величины
    };
    this.country = 'global';
  }

  init() {
    getObjFromApi('global')
      .then((result) => {
        this.summary = result;
        document.querySelector('.global_cases-current_tests').innerHTML = `${result.Global.TotalConfirmed}`;
        return getObjFromApi('population');
      })
      .then((population) => {
        this.population = population;
        this.schedule.init(this.summary, this.population);
        this.table(this.summary, this.population);
        this.countriesList(this.summary, this.population);
        this.actualDate();
        this.findCountry.init();
        this.findCountry.sortFc();
        // вызов ваших модулей при запуске приложения
      })
      .catch((error) => alert('API error, try again later.'));
    getObjFromApi('mapApi')
      .then((result) => {
        this.map.getMap(result, this.option);
      });
    this.BtnOptionsArr.forEach((el) => el.addEventListener('click', (el) => this.openOptions.call(this, el)));
    this.optionsCallArr.forEach((el) => el.addEventListener('click', (el) => this.changeOptions.call(this, el)));
    this.btnFullScreen.forEach((el) => el.addEventListener('click', (el) => this.stretchScreen.call(this, el)));
    this.globalCases.addEventListener('click', (el) => {
      this.changeCountry.call(this, 'global');
      document.querySelectorAll('.countries_list_wrapper_table_row').forEach((el) => el.style.background = null);
    });
  }

  openOptions(el) {
    const options = document.querySelector('.options');
    if (!this.hideOptionsBul) {
      document.onclick = null;
      options.classList.add('hide');
      this.hideOptionsBul = true;
    } else {
      this.hideOptionsBul = false;
      document.onclick = (el) => {
        if (!el.target.className.match(/option-set/) && !el.target.className.match(/nav_options/)) {
          this.openOptions.call(this, el);
        }
      };
      options.classList.remove('hide');
      const coords = el.target.getBoundingClientRect(); // поиск и задание координат для подсказки
      options.style.left = `${coords.left}px`;
      options.style.top = `${coords.bottom}px`;
    }
  }

  changeOptions(el) {
    const options = document.querySelector('.options');
    const { target } = el;
    if (target.id === 'daily') {
      if (this.option.daily) {
        this.option.daily = false;
        target.classList.remove('active');
        this.table(this.summary, this.population, true, 'unknown'); // T A B L E
        // this.countriesList('', '', 'change')//+
      } else {
        this.option.daily = true;
        target.classList.add('active');
        this.table(this.summary, this.population, false, 'unknown'); // T A B L E
        // this.countriesList('', '', 'change')//+
      }
    } else if (target.id === 'per') {
      if (this.option.per) {
        this.option.per = false;
        target.classList.remove('active');
        this.table(this.summary, this.population, 'unknown', true); // T A B L E
        // this.countriesList('', '', 'change')//+
      } else {
        this.option.per = true;
        target.classList.add('active');
        this.table(this.summary, this.population, 'unknown', false); // T A B L E
        // this.countriesList('', '', 'change')//+
      }
    } else {
      if (target.id === 'deaths') {
        this.countriesList('', '', 'deaths');
      }
      if (target.id === 'recovered') {
        this.countriesList('', '', 'recovered');
      }
      if (target.id === 'cases') {
        this.countriesList('', '', 'cases');
      }
      this.optionsCallArr.forEach((e) => {
        if (e.id !== 'daily' && e.id !== 'per') e.classList.remove('active');
      });
      this.option.name = target.id;
      target.classList.add('active');
      this.openOptions.call(this, el);
    }
    this.changeCountry(this.country);
  }

  changeCountry(country) {
    let iso2 = this.summary.Countries.find((el) => el.CountryCode == country);
    if (iso2) {
      this.map.showCountry(country, this.option);
      this.country = iso2.Country;
    } else {
      this.country = country;
      country === 'global' ? iso2 = country : iso2 = this.summary.Countries.find((el) => el.Country == country).CountryCode;
      this.map.showCountry(iso2, this.option);
    }
    this.schedule.changeOptions(this.country, this.option); // передаем название страны и объект с установленными параметрами
    this.table(this.country); // T A B L E
    this.findCountry.sortFc();
  }

  actualDate() {
    const date = document.querySelector('.actual_date-date');
    let actual = this.summary.Date;
    actual = actual.split('').slice(0, -10);
    date.innerHTML = actual.join('');
  }

  stretchScreen(el) {
    el.stopPropagation();
    const target = el.target.id ? el.target : el.target.parentNode;
    if (!target.parentNode.classList.contains('fullscreen')) {
      console.log(document.body);
      document.body.style.overflowY = 'hidden';
      window.scroll(0, -100);
    } else document.body.style.overflowY = 'scroll';
    target.parentNode.classList.toggle('fullscreen');
    this.map.getFullScreen();
  }
}
export default global = new Global();
global.init();
