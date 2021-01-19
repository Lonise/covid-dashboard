let AllTime = true;
let AbsoluteValues = true;
let activeTableClass = 'total-all';
const previousParam = 'cases';
export default function changeListAndTableValues(day, per, param) {
  if (typeof param === 'undefined') {
    param = previousParam;
    document.querySelectorAll(`.${activeTableClass}`).forEach((element) => {
      element.classList.add('hide');
    });

    if (day !== 'unknown') {
      AllTime = day;
    } else {
      AbsoluteValues = per;
    }
    if (AllTime && AbsoluteValues) {
      removeInactiveClass('total-all');
    } else if (!AllTime && AbsoluteValues) {
      removeInactiveClass('new-all');
    } else if (AllTime && !AbsoluteValues) {
      removeInactiveClass('total-100');
    } else {
      removeInactiveClass('new-100');
    }

    function removeInactiveClass(nextActiveClass) {
      document.querySelectorAll(`.${nextActiveClass}`).forEach((element) => {
        element.classList.remove('hide');
      });
      activeTableClass = nextActiveClass;
    }
  }

  const tableArr = document.querySelectorAll('.table_data_table_tr_country');
  const listArr = document.querySelectorAll('.countries_list_wrapper_table_row');
  for (let listEl = 0; listEl < listArr.length; listEl += 1) {
    for (let tableEl = 0; tableEl < tableArr.length; tableEl += 1) {
      if (listArr[listEl].firstChild.textContent === tableArr[tableEl].firstChild.textContent) {
        const childElementsOfTable = tableArr[tableEl].childNodes;
        let counter = 0;
        for (let tableChild = 0; tableChild < childElementsOfTable.length; tableChild += 1) {
          if (childElementsOfTable[tableChild].classList.contains(`${activeTableClass}`)) {
            listArr[listEl].childNodes[counter + 1].innerText = childElementsOfTable[tableChild].innerText;
            counter += 1;
          }
        }
      }
    }
  }
}
