export default class ApiFetch {
  constructor() {
    this.serverUrl = 'http://localhost:7001';
    this.headers = {
      'Accept': 'application/json'
    };
  }

  get = (endpoint, query = {}, headers = {}) => {
    return this.parseResponse(fetch(
      `${this.serverUrl}/${endpoint}?${this.querySerializer(query)}`,
      {
        method: 'GET',
        headers: { ...this.headers, ...headers }
      }
    ));
  };

  post = (endpoint, body = {}, headers = {}) => {
    return this.parseResponse(fetch(
      `${this.serverUrl}/${endpoint}`,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { ...this.headers, ...headers }
      }
    ));
  };

  parseResponse(fetch) {
    return fetch
      .then(response => {
        return response.json()
          .then(json => response.ok ? Promise.resolve(json) : Promise.reject(json));
      });
  }

  querySerializer(object) {
    let query = [];

    for(let key in object) {
      if (object.hasOwnProperty(key)) {
        query.push(`${encodeURIComponent(key)}=${encodeURIComponent(object[key])}`);
      }
    }

    return query.join("&");
  }
}
