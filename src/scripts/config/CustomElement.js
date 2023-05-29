export class WeatherElement extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {}
  disconnectedCallback() {}
  attributeChangedCallback() {}
}

export class CenterElement extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {}
  disconnectedCallback() {}
  attributeChangedCallback() {}
}
customElements.define("center-component", CenterElement);
customElements.define("weather-component", WeatherElement);
