import create from './create';
import global from './script';

let activeParamClass = 'cases';

export default function countriesList(summary, population, param) {
  if (param) {
    document.querySelectorAll(`.${activeParamClass}`).forEach((element) => {
      element.classList.add('hide');
    });
    document.querySelectorAll(`.${param}`).forEach((element) => {
      element.classList.remove('hide');
    });
    activeParamClass = param;
  } else {
    function createList() {
      const listCase = document.querySelector('.countries_list');
      // const headTableContainer = create('div', 'countries_list_head-table', '', listCase);
      // const headTable = create('table', 'countries_list_wrapper_head-table', '', headTableContainer);
      // const headTableRow = create('tr', 'countries_list_wrapper_head-table_row', '', headTable);
      // const headerText = ['Country', 'Option', 'Flag'];

      // for (let i = 0; i < headerText.length; i +=1) {
      //     create('td', 'countries_list_wrapper_head-table_row_td', `${headerText[i]}`, headTableRow);
      // }

      const listContainer = create('div', 'countries_list_wrapper', '', listCase);
      const listContainerWrapper = create('div', 'countries_list__wrapper_container', '', listContainer);
      const listTable = create('table', 'countries_list_wrapper_table', '', listContainerWrapper);

      let populationIndex;
      let checkIndex = -1;

      summary.Countries.forEach((el) => {
        const twoWorldsCountryName = `${el.Slug}`.split('-').splice(0, 2).join(' ');
        const reg = new RegExp(`^${twoWorldsCountryName}`, 'i');
        for (let currentCountry = 0; currentCountry < population.length; currentCountry++) {
          if (reg.test(population[currentCountry].name)) {
            populationIndex = currentCountry;
            break;
          }
        }

        if (populationIndex === checkIndex) {
          populationIndex += 1;
          checkIndex = populationIndex;
        } else {
          checkIndex = populationIndex;
        }
        checkIndex = populationIndex;

        const listTableRow = create('tr', 'countries_list_wrapper_table_row', '', listTable);
        const countryName = create('td', 'countries_list_wrapper_country_name', `${el.Country}`, listTableRow);
        create('td', 'countries_list_wrapper_country_options recovered hide', `${el.TotalRecovered} `, listTableRow);
        create('td', 'countries_list_wrapper_country_options cases', `${el.TotalConfirmed} `, listTableRow);
        create('td', 'countries_list_wrapper_country_options deaths hide', `${el.TotalDeaths} `, listTableRow);

        const flagContainer = create('td', 'countries_list_wrapper_country_flag-container', '', listTableRow);
        create('img', 'countries_list_wrapper_country_flag', '', flagContainer, ['src', `${population[populationIndex].flag}`]);
        listTableRow.addEventListener('click', (el) => {
          document.querySelectorAll('.countries_list_wrapper_table_row').forEach((el) => el.style.background = null);
          el.target.parentNode.style.background = '#2E184D';
          global.changeCountry(countryName.innerText);
        });
      });
    }
    createList();
  }
}
