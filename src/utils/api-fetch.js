export default function() {

  this.serverUrl = 'http://localhost:7001';

  this.headers = {
    'Accept': 'application/json'
  };

  this.get = (endpoint, query = {}, headers = {}) => {
    return this._parseResponse(fetch(
      `${this.serverUrl}/${endpoint}?${this._querySerializer(query)}`,
      {
        method: 'GET',
        headers: { ...this.headers, ...headers }
      }
    ));
  }

  this.post = (endpoint, body = {}, headers = {}) => {
    return this._parseResponse(fetch(
      `${this.serverUrl}/${endpoint}`,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { ...this.headers, ...headers }
      }
    ));
  }

  this._parseResponse = fetch => {
    return fetch
      .then(response => {
        return response.json()
          .then(json => response.ok ? Promise.resolve(json) : Promise.reject(json));
      });
  };

  this._querySerializer = object => {
    let query = [];

    for(let key in object) {
      if (object.hasOwnProperty(key)) {
        query.push(`${encodeURIComponent(key)}=${encodeURIComponent(object[key])}`);
      }
    }

    return query.join("&");
  };
}
