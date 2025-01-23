forEach: Model
fileName: web-component.js
path: frontend/src
---
import Vue from 'vue';
import App from "./App.vue";
import VueRouter from 'vue-router';
import Managing from "./components";
import Vuetify from "vuetify/lib";
import 'vuetify/dist/vuetify.min.css';

Vue.config.productionTip = false;
require('./GlobalStyle.css');

Vue.use(Managing);
Vue.use(Vuetify);
Vue.use(VueRouter);

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

{{#boundedContexts}}
    {{#aggregates}}
        {{#if uiStyle.layout}}
import {{boundedContext.namePascalCase}}{{namePascalCase}}Manager from "./components/listers/{{boundedContext.namePascalCase}}{{namePascalCase}}{{#layoutPascalCase uiStyle.layout}}{{/layoutPascalCase}}"
        {{else}}
import {{boundedContext.namePascalCase}}{{namePascalCase}}Manager from "./components/listers/{{boundedContext.namePascalCase}}{{namePascalCase}}Cards"
        {{/if}}
import {{boundedContext.namePascalCase}}{{namePascalCase}}Detail from "./components/listers/{{boundedContext.namePascalCase}}{{namePascalCase}}Detail"
    {{/aggregates}}

    {{#readModels}}
import {{namePascalCase}}View from "./components/{{namePascalCase}}View"
import {{namePascalCase}}ViewDetail from "./components/{{namePascalCase}}ViewDetail"
    {{/readModels}}
{{/boundedContexts}}

const routes = [
{{#boundedContexts}}
{{#aggregates}}
    {
      path: '/{{boundedContext.namePlural}}/{{namePlural}}',
      component: {{boundedContext.namePascalCase}}{{namePascalCase}}Manager
    },
    {
        path: '/{{boundedContext.namePlural}}/{{namePlural}}/:id',
        component: {{boundedContext.namePascalCase}}{{namePascalCase}}Detail
    },
{{/aggregates}}
{{#readModels}}
    {
        path: '/{{boundedContext.namePlural}}/{{namePlural}}',
        component: {{namePascalCase}}View
    },
    {
        path: '/{{boundedContext.namePlural}}/{{namePlural}}/:id',
        component: {{namePascalCase}}ViewDetail
    },
{{/readModels}}
{{/boundedContexts}}
];

const vuetify = new Vuetify({});
const appRouter = new VueRouter({ routes: routes });

class WebComponentElement extends HTMLElement {
    constructor() {
        super();
        this.vueInstance = null;
    }

    static get observedAttributes() {
        return ['data'];
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

        this.vueInstance = new Vue({
            render: (h) => h(App, { props: { data: parsedData } }),
            router: appRouter,
            vuetify
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