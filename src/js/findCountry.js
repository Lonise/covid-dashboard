import global from './script';
import keyboard from './keyboard';

export default class findCountry {
  constructor() {
    this.countryListArr = [];
    this.input = document.querySelector('.countries_list-input');
    this.list = document.querySelector('.countries_list_wrapper');
    this.btnOpenKB = document.querySelector('.btn_keyboard');
    this.sortTable = document.querySelector('.countries_list-table_title-wrapper');
    this.flagSortParam = false;
    this.flagSortCountr = false;
    this.checkInput = document.querySelector('.check_input');
  }

  init() {
    this.btnOpenKB.addEventListener('click', () => {
      keyboard.init();
      if (document.querySelector('.keyboard')) {
        document.querySelector('.keyboard').addEventListener('click', (e) => this.changeOrder.call(this, e));
      }
    });
    this.countryListArr = document.querySelectorAll('.countries_list_wrapper_country_name');
    this.input.oninput = (e) => this.changeOrder.call(this, e);
    this.sortTable.addEventListener('click', (el) => this.sortFc.call(this, el));
    document.addEventListener('keydown', (e) => {
      if (e.keyCode === 13) this.checkCountry.call(this);
    });
  }

  changeOrder() {
    if (this.input.value.match(/[^a-zA-Z\s]/)) {
      const coords = this.input.getBoundingClientRect();
      const padding = 19;
      this.checkInput.style.left = `${coords.left - padding}px`;
      this.checkInput.classList.remove('hide');
    } else {
      this.checkInput.classList.add('hide');
      const regOfValue = new RegExp(`^${this.input.value}`, 'i');
      this.countryListArr.forEach((el) => {
        if (el.innerText.match(regOfValue)) {
          el.parentNode.classList.remove('hide');
        } else el.parentNode.classList.add('hide');
      });
    }
  }

  checkCountry() {
    if (this.input.value.length > 0) {
      this.countryListArr = document.querySelectorAll('.countries_list_wrapper_country_name');
      let countryEl = Array.prototype.find.call(this.countryListArr, (el) => {
        if (el.parentNode.className === 'countries_list_wrapper_table_row') {
          document.querySelectorAll('.countries_list_wrapper_table_row').forEach((el) => el.style.background = null);
          el.parentNode.style.background = '#2E184D';
          return true;
        }
      });
      if (countryEl) {
        countryEl = countryEl.innerText;
        this.input.value = countryEl;
        this.changeOrder();
        global.changeCountry(countryEl);
      }
    }
  }

  sortFc(el) {
    const optionId = document.querySelector('.active').id;
    const sortValue = ['recovered', 'cases', 'deaths'].indexOf(optionId) + 1;
    let idOfEl = 'parameters';
    let bulForArrow = false;
    let target = '';
    if (el) {
      el.target.id ? target = el.target : target = el.target.parentNode;
      idOfEl = target.id;
      idOfEl === 'countries' ? bulForArrow = this.flagSortCountr : bulForArrow = this.flagSortParam;
      bulForArrow ? target.firstElementChild.innerHTML = 'keyboard_arrow_up' : target.firstElementChild.innerHTML = 'keyboard_arrow_down';
    }
    const changeFlag = (bul) => {
      idOfEl === 'countries' ? this.flagSortCountr = bul : this.flagSortParam = bul;
    };
    const tableWrapper = document.querySelector('.countries_list_wrapper_table');
    const tableChild = tableWrapper.children;
    const tableRowListArr = Array.prototype.slice.call(tableChild);
    let returnValue = 1;
    if (bulForArrow) {
      returnValue = -1;
      changeFlag(false);
    } else changeFlag(true);
    tableRowListArr.sort((firstEl, secondEl) => {
      let first = Number(firstEl.children[sortValue].innerText);
      let second = Number(secondEl.children[sortValue].innerText);
      if (idOfEl === 'countries') {
        first = Number(secondEl.children[0].innerText.charCodeAt());
        second = Number(firstEl.children[0].innerText.charCodeAt());
      }
      if (first > second) {
        return -returnValue;
      }
      if (first < second) {
        return returnValue;
      }
      return 0;
    });
    tableWrapper.innerHTML = '';
    tableRowListArr.forEach((el) => tableWrapper.appendChild(el));
  }
}
