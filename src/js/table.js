import create from './create';
import changeListAndTableValues from './changeListAndTableValues';

const numberOfColumnsTable = 4;
const worldPopulation = 7827000000;
const relativeIndicator = 100000;
let summaryLocal;

export default function table(summary, population, day = undefined, per = undefined) {
  if (arguments.length === 1) {
    document.querySelector('.table_data_container-table').scrollTo(pageXOffset, 0);

    let currentInput = arguments[0];
    // console.log(currentInput);
    const arrayCountry = document.querySelectorAll('.table_data_table_tr_country');
    if (currentInput === 'global') currentInput = 'World';

    // currentInput = (currentInput === 'global') ? 'World' : currentInput;
    const outputCurrentCountry = document.querySelectorAll('.InputCountry');
    const reg = currentInput;

    let indexOfCountryRow;
    arrayCountry.forEach((element, index) => {
      if (reg === (element.childNodes[0].innerText)) indexOfCountryRow = index;
    });
    // console.log(arrayCountry);
    // console.log(arrayCountry[indexOfCountryRow]);
    arrayCountry[indexOfCountryRow].childNodes.forEach((element, index) => {
      outputCurrentCountry[index].innerText = element.innerHTML;
    });
    return;
  }

  if (typeof day !== 'undefined' && typeof per !== 'undefined') {
    changeListAndTableValues(day, per);
    return;
  }

  function createTable() {
    summaryLocal = summary;
    const tableCase = document.querySelector('.table_data');
    const tableHead = create('table', 'table_data_head-table', '', tableCase);
    const tableRowHead = create('tr', 'table_data_table_head-table_row', '', tableHead);
    const tableContainer = create('div', 'table_data_container-table', '', tableCase);

    const table = create('table', 'table_data_table', '', tableContainer);

    const tableRowHeadText = ['Countries', 'Recovered', 'Cases', 'Death'];

    for (let tableHeadCell = 0; tableHeadCell < numberOfColumnsTable; tableHeadCell++) {
      create('th', 'table_data_table_tr_th', `${tableRowHeadText[tableHeadCell]}`, tableRowHead);
    }

    const trWorld = create('tr', 'table_data_table_tr_world', '', table);

    const trHead = create('tr', 'table_data_table_tr_country hide world', '', table);
    create('td', 'table_data_table_tr_td', 'World', trHead);
    create('td', 'table_data_table_tr_td total-all totalRecovered', `${summary.Global.TotalRecovered}`, trHead);
    create('td', 'table_data_table_tr_td total-all totalConfirmed', `${summary.Global.TotalConfirmed}`, trHead);
    create('td', 'table_data_table_tr_td total-all totalDeaths', `${summary.Global.TotalDeaths}`, trHead);
    create('td', 'hide', '', trHead);
    create('td', 'table_data_table_tr_td new-100 hide new-100Recovered', `${Math.floor(summary.Global.NewRecovered * relativeIndicator / worldPopulation)}`, trHead);
    create('td', 'table_data_table_tr_td new-100 hide new-100Confirmed', `${Math.floor(summary.Global.NewConfirmed * relativeIndicator / worldPopulation)}`, trHead);
    create('td', 'table_data_table_tr_td new-100 hide new-100Deaths', `${Math.floor(summary.Global.NewDeaths * relativeIndicator / worldPopulation)}`, trHead);
    create('td', 'hide', '', trHead);
    create('td', 'table_data_table_tr_td new-all hide newRecovered', `${summary.Global.NewRecovered}`, trHead);
    create('td', 'table_data_table_tr_td new-all hide newConfirmed', `${summary.Global.NewConfirmed}`, trHead);
    create('td', 'table_data_table_tr_td new-all hide newDeaths', `${summary.Global.NewDeaths}`, trHead);
    create('td', 'hide', '', trHead);
    create('td', 'table_data_table_tr_td total-100 hide total-100Recovered', `${Math.floor(summary.Global.TotalRecovered * relativeIndicator / worldPopulation)}`, trHead);
    create('td', 'table_data_table_tr_td total-100 hide total-100Confirmed', `${Math.floor(summary.Global.TotalConfirmed * relativeIndicator / worldPopulation)}`, trHead);
    create('td', 'table_data_table_tr_td total-100 hide total-100Deaths', `${Math.floor(summary.Global.TotalDeaths * relativeIndicator / worldPopulation)}`, trHead);

    const arrayClassesOfChooseCountry = [
      'name', 'total-all totalRecovered', 'total-all totalConfirmed', 'total-all totalDeaths', 'hide',
      'new-100 hide new-100Recovered', 'new-100 hide new-100Confirmed', 'new-100 hide new-100Deaths', 'hide',
      'new-all hide newRecovered', 'new-all hide newConfirmed', 'new-all hide newDeaths', 'hide',
      'total-100 hide total-100Recovered', 'total-100 hide total-100Confirmed', 'total-100 hide total-100Deaths'];

    const r = document.querySelector('.world');
    for (let i = 0; i < 16; i++) {
      create('td', `table_data_table_tr_td ${arrayClassesOfChooseCountry[i]} InputCountry`, `${r.childNodes[i].textContent}`, trWorld);
    }
    let populationIndex;

    for (let currentTr = 0; currentTr < summary.Countries.length; currentTr++) {
      let worldsCountryName;
      if (summary.Countries[currentTr].Slug === 'united-states') {
        worldsCountryName = 'United States of America';
      } else {
        worldsCountryName = `${summary.Countries[currentTr].Slug}`.split('-').splice(0, 2).join(' ');
      }
      const reg = new RegExp(`^${worldsCountryName}`, 'i');

      for (let currentCountry = 0; currentCountry < population.length; currentCountry++) {
        if (reg.test(population[currentCountry].name)) {
          populationIndex = currentCountry;
          break;
        }
      }

      const tr = create('tr', 'table_data_table_tr_country', '', table);
      create('td', 'table_data_table_tr_td country-table', `${summary.Countries[currentTr].Country}`, tr);

      create('td', 'table_data_table_tr_td total-all', `${summary.Countries[currentTr].TotalRecovered}`, tr);
      create('td', 'table_data_table_tr_td total-all', `${summary.Countries[currentTr].TotalConfirmed}`, tr);
      create('td', 'table_data_table_tr_td total-all', `${summary.Countries[currentTr].TotalDeaths}`, tr);
      create('td', 'hide', '', tr);
      create('td', 'table_data_table_tr_td new-100 hide', `${Math.floor(((summary.Countries[currentTr].NewRecovered) * (relativeIndicator)) / (population[populationIndex].population))}`, tr);
      create('td', 'table_data_table_tr_td new-100 hide', `${Math.floor(((summary.Countries[currentTr].NewConfirmed) * (relativeIndicator)) / (population[populationIndex].population))}`, tr);
      create('td', 'table_data_table_tr_td new-100 hide', `${Math.floor(((summary.Countries[currentTr].NewDeaths) * (relativeIndicator)) / (population[populationIndex].population))}`, tr);
      create('td', 'hide', '', tr);
      create('td', 'table_data_table_tr_td new-all hide', `${summary.Countries[currentTr].NewRecovered}`, tr);
      create('td', 'table_data_table_tr_td new-all hide', `${summary.Countries[currentTr].NewConfirmed}`, tr);
      create('td', 'table_data_table_tr_td new-all hide', `${summary.Countries[currentTr].NewDeaths}`, tr);
      create('td', 'hide', '', tr);
      create('td', 'table_data_table_tr_td total-100 hide', `${Math.floor(((summary.Countries[currentTr].TotalRecovered) * (relativeIndicator)) / (population[populationIndex].population))}`, tr);
      create('td', 'table_data_table_tr_td total-100 hide', `${Math.floor(((summary.Countries[currentTr].TotalConfirmed) * (relativeIndicator)) / (population[populationIndex].population))}`, tr);
      create('td', 'table_data_table_tr_td total-100 hide', `${Math.floor(((summary.Countries[currentTr].TotalDeaths) * (relativeIndicator)) / (population[populationIndex].population))}`, tr);
    }
  }

  createTable();
}
