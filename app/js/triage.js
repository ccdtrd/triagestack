var timer;
var count = 1;
var customer = 'demo';

$(document).ready(function() {
    timer = $.timer(refresh);
    // timer.set({ time : 1000, autostart : true });
});

function refresh(){
    if(count === 0){
        count = 2;
        $.get('/services/'+customer+'/_all')
        .success(function(data, status, obj){
            try{
                $(document.getElementById('demoSVG').contentDocument)
                .find('desc')
                .each(function(index, element){
                    var id = $(element.firstChild).text();
                    var status = find_component(data, id).status;
                    apply_status(element.parentElement.id, status_color(status), '#000000');
                });
            }catch(err){
                console.log(err);
                timer.stop();
            }
        })
        .error(function(obj, status, error){
            status = {};
        });
    }else{
        count -= 1;
    }
}

function find_component(data, id){
    var component = _.find(data,function(component){
        if(component.name === id){
            return true;
        }
    });
    if(component){ return component; }
    else return {};
}

function status_color(status){
    if(status){
        if(/PASS/.test(status)){
            return '#6DB370';
        }else if(/FAIL/.test(status)){
            return '#FF625F';
        }else if(/WARN/.test(status)){
            return '#FEBD01';
        }else if(/CRITICAL/.test(status)){
            return '#465866';
        }else if(/PAUSE/.test(status)){
            return '#2AC8E8';
        }
    }
    return '#666666';
}

function apply_status(id, fill, stroke) {
  var doc = document.getElementById('demoSVG').contentDocument;
  var circle = doc.getElementById(id);
  circle.style.fill = fill;
}
