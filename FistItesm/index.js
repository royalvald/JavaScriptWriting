
    var app = new Vue({
        el: '#app',
        data: {
            value1: 5,
            value2: 5,
            sum:100
        },

        methods: {
            add:function()
            {
               this.sum=this.value1+this.value2;
               document.getElementById("text1").innerText=this.sum+""
            }
        },
       
    });