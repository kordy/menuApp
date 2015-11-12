requirejs.config({
    baseUrl: 'static',
    paths: {
        text: 'js/libs/text',
        views: '/views',
        templates: '/static/templates',
        models: '/models',
        collections: '/collections'
    }
});

requirejs(["text!templates/main.js"], function(Template) {
    console.log(Backbone);
    console.log(Template);
    //This function is called when scripts/helper/util.js is loaded.
    //If util.js calls define(), then this function is not fired until
    //util's dependencies have loaded, and the util argument will hold
    //the module value for "helper/util".
    return 2213123;
});