Vue.component('Home', {template:'<div>Hello world</div>'})
Vue.component("Left", {template:'<div>welcome</div>'})
Vue.component("Right", {template:'<div>Dear</div>'})

new Vue({
    el:'demo1',
    data:{
        currentTab:'Home',
        tabArrays:['Home','Left','Right']
    },
    computed: {
        currentSelection:function()
        {
            return currentTab;
        }
    },
})