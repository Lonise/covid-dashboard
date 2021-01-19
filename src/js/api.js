const requestOptions = {
  method: 'GET',
  redirect: 'follow',
};
async function getObjFromApi(key) {
  const map = new Map();
  map
    .set('global', 'https://api.covid19api.com/summary')
    .set('mapApi', 'https://corona.lmao.ninja/v2/countries')
    .set('population', 'https://restcountries.eu/rest/v2/all?fields=name;population;flag')
    .set('globalHistory', 'https://disease.sh/v3/covid-19/historical/all?lastdays=366')
    .set('countriesHistory', 'https://master-covid-19-api-laeyoung.endpoint.ainize.ai/jhu-edu/timeseries?&onlyCountries=true');
  return fetch(map.get(key), requestOptions)
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => console.log('error', error));
}
export { getObjFromApi };
