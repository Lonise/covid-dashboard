import Chart from 'chart.js';
import { getObjFromApi } from './api.js';

export default class scheduleStart {
  constructor() {
    this.schedule = document.querySelector('.schedule');
    this.ctx = document.querySelector('.schedule-canvas').getContext('2d');
    this.chart = {};
    this.chartConfig = {
      type: 'line',
      data: {
        datasets: [],
      },
      options: {
        maintainAspectRatio: false,
        borderSkipped: 'right',
        tooltips: {
          backgroundColor: '#e58719',
          bodyFontColor: 'black',
          titleFontColor: 'black',
          titleAlign: 'center',
        },
        legend: {
          display: false,
        },
        title: {
          display: true,
          position: 'bottom',
          fontColor: 'white',
          fontSize: 18,
        },
        scales: {
          rectangle: {
            barPercentage: '0.1',
          },
          xAxes: [{
            gridLines: {
              display: true,
              lineWidth: 0,
              zeroLineWidth: 3,
              zeroLineColor: '#FFA63F',
            },
            ticks: {
              barPercentage: '0.1',
              fontColor: '#FFF',
              padding: 4,
              maxTicksLimit: 11,
              callback(value, i) {
                const month = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                if (i === 0) return 'Feb';
                if (i % 30 === 0) return month[i / 30 - 1];
                return value;
              },
            },
          }],
          yAxes: [{
            gridLines: {
              display: true,
              lineWidth: 0,
              zeroLineWidth: 3,
              zeroLineColor: '#FFA63F',
            },
            ticks: {
              fontColor: '#FFF',
              beginAtZero: true,
              maxTicksLimit: 5,
              callback(value) {
                if (value >= 10 ** 6) return `${value / 10 ** 6}kk`;
                if (value < 10 ** 6 && value >= 1000) return `${value / 10 ** 3}k`;
                return value;
              },
            },
          }],
        },
      },
    };
    this.chart = new Chart(this.ctx, this.chartConfig);
    this.country = 'global';
    this.globalObj = {};
    this.population = {};
    this.summary = {};
    this.historyArr = [];
    this.regCountry = /./;
    this.option = { // параметры
      name: 'cases', // Deaths, Recovered
      daily: false, // по дням
      per: false, // абсолютные величины
    };
  }

  init(summary, population) {
    const loader = document.querySelector('.loader_wrapper');
    this.summary = summary;
    this.population = population;
    getObjFromApi('globalHistory').then((obj) => {
      this.globalObj = obj;
      return getObjFromApi('countriesHistory');
    })
      .then((history) => {
        this.historyArr = history;
        loader.classList.add('hide');
        this.drawGlobal(this.globalObj.cases);
        alert('Доп функционал, сортировка списка стран по имени и показателю');
      })
      .catch((error) => alert('API error, try again later.'));
  }

  changeOptions(country, optionObj) {
    this.option = optionObj;
    let argumentCB = {};
    this.country = country;
    if (country !== 'global') {
      this.regCountry = new RegExp(`${country}`);
      const countryCode = this.summary.Countries.find((el) => el.Country == country).CountryCode;
      argumentCB = this.historyArr.find((el) => {
        try {
          return el.countrycode.iso2 === countryCode;
        } catch (e) {
          return el.countryregion === this.country;
        }
      });
      if (!argumentCB) {
        argumentCB = this.historyArr[40];
        this.regCountry = new RegExp('Congo');
      }
      argumentCB = argumentCB.timeseries;
    } else argumentCB = this.globalObj[JSON.parse(JSON.stringify(optionObj.name))];
    this.drawGlobal(argumentCB);
  }

  drawGlobal(obj) {
    let labels = [];
    let data = [];
    const lengthArray = 330;
    this.chartConfig.type = 'line';
    let colorLine = '#01F1E3';
    let title = '';
    if (this.option.name === 'recovered') colorLine = '#5EFF5A';
    else if (this.option.name === 'deaths') colorLine = '#FF2D2E';
    const user = {
      label: `${this.option.name}`,
      backgroundColor: '#5EFF5A',
      borderWidth: 4,
      radius: 1,
      fill: false,
    };
    if (this.country !== 'global') {
      if (this.option.name === 'cases') this.option.name = 'confirmed';
      const optionName = JSON.parse(JSON.stringify(this.option.name));
      for (const key in obj) {
        data.push(obj[key][optionName]);
        labels.push(key);
      }
    } else {
      for (const key in obj) {
        data.push(obj[key]);
        labels.push(key);
      }
    }
    data.sort((a, b) => a - b);// убираем неверные значения графика
    if (this.option.daily) {
      this.chartConfig.type = 'bar';
      title += 'Daily ';
      data = data.map((el, i, arr) => {
        if (i !== 0) return el - arr[i - 1];
        return el;
      });
    }
    if (this.option.per) {
      let population = 0;
      const perValue = 10 ** 5;
      title += 'Per 100k ';
      if (this.country === 'global') {
        population = 7.5 * 10 ** 9;
      } else {
        population = this.population.find((el) => !!el.name.match(this.regCountry));
        if (!population) population = this.population[40];
        population = population.population;
      }
      if (population) data = data.map((el) => Math.floor(el / (population / perValue)));
    }
    data = data.map((el, i, arr) => {
      if (el > arr[i - 1] * 1.5) return arr[i - 1];
      return el;
    });
    if (data.length > lengthArray) {
      data.reverse();
      labels.reverse();
      data.length = lengthArray;
      labels.length = lengthArray;
      data.reverse();
      labels.reverse();
    } else if (data.length < lengthArray) {
      const delEmpty = (arg) => arg.map((el, i, ar) => {
        if (el == undefined) return ar[i - 1];
        return el;
      });
      data.length = lengthArray;
      labels.length = lengthArray;
      data = delEmpty(data);
      labels = delEmpty(labels);
    }
    user.data = data;
    user.borderColor = colorLine;
    user.backgroundColor = colorLine;
    this.chartConfig.options.title.text = title + this.option.name[0].toUpperCase() + this.option.name.slice(1);
    this.chartConfig.data.datasets = [user];
    this.chartConfig.data.labels = labels;
    this.chart.update();
  }
}
