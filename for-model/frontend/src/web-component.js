forEach: Model
fileName: web-component.js
path: frontend/src
---
import Vue from 'vue';
import App from "./CustomApp.vue";
import Managing from "./components";
import Vuetify from "vuetify/lib";
import 'vuetify/dist/vuetify.min.css';

Vue.config.productionTip = false;
require('./GlobalStyle.css');

Vue.use(Managing);
Vue.use(Vuetify);

const axios = require("axios").default;
axios.backend = null; //"http://localhost:8088";
if (axios.backend) axios.backendUrl = new URL(axios.backend);
axios.fixUrl = function(original) {
    if(!axios.backend && original.indexOf("/")==0) {
        return original;
    }

    var url = null;

    try {
        url = new URL(original);
    } catch(e) {
        url = new URL(axios.backend + original);
    }

    if(!axios.backend) return url.pathname;

    url.hostname = axios.backendUrl.hostname;
    url.port = axios.backendUrl.port;

    return url.href;
}

const vuetify = new Vuetify({});

class WebComponentElement extends HTMLElement {
    constructor() {
        super();
        this.vueInstance = null;
    }

    static get observedAttributes() {
        return ['data', 'componentName'];
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        if (this.vueInstance) {
            if (newValue || oldValue !== newValue) {
                this.vueInstance.$props[name] = newValue;
            }
        }
    }

    connectedCallback() {
        const data = this.getAttribute('data') || null;
        const parsedData = JSON.parse(data);
        const componentName = this.getAttribute('componentName');

        this.vueInstance = new Vue({
            vuetify,
            render: (h) => h(App, {
                props: {
                    data: parsedData,
                    componentName: componentName
                }
            }),
        }).$mount();

        this.appendChild(this.vueInstance.$el);
    }

    disconnectedCallback() {
        if (this.vueInstance) {
            this.vueInstance.$destroy();
        }
    }
}

window.customElements.define('{{options.package}}-app', WebComponentElement);