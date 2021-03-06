import { log } from "util";

$("document").ready(function(){
    $.ajax({
        type: "GET",
        url: "/nameday2.xml",
        dataType: "xml",
        success: function(xml) {
            parsexml(xml);
        },
        error: function(xhr, textStatus, error) {
            console.log('status: ' + textStatus);
            console.log(xhr);
        }
    });
    $("#submitBtn").click(findInput);
});

function parsexml(xml) {
    var d = new Date();
    var strDate = d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear();
    $("#date").text(strDate);
    
    var zaznamy = $(xml).find('zaznam')
    zaznamy.each(function(){
        console.log($.trim($(this).find("den")[0].textContent));
        if($.trim($(this).find("den")[0].textContent) === (d.getMonth()+1)+""+(d.getDate())){
            if($(this).find("SK")[0] !== undefined) $("#name").text($(this).find("SK")[0].textContent);
        }
    });
}


function findInput () {    
    
    $("document").ready(function(){
        $.ajax({
            type: "GET",
            url: "nameday2.xml",
            dataType: "xml",
            success: function(xml) {
                findNameOrDate(xml);
            },
            error: function(xhr, textStatus, error) {
                console.log('status: ' + textStatus);
                console.log(xhr);
            }
        });
    });
     
}

function findNameOrDate(xml){
    var str = $("#nameInput").val();
    str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    var res = str.match("((0?[1-9]|[12][0123456789]|3[01])\\.(0?[1-9]|1[0-2])\\.)");
    var res2 = str.match("[0123456789]|[\t\f\v\r\n ]|[^a-z]");
    $("#tooltip").text("");
     
    if(res != null){
        var day = res[2];
        var month = res[3];
        if(day.length == 1)day = "0"+day;
        if(month.length == 1)month = "0"+month;
        var date = new Date(month+"."+day+".");
        var controlDay = date.getDate()+"";
        var controlMonth = (date.getMonth()+1)+"";
        if(controlDay.length == 1)controlDay = "0"+controlDay;
        if(controlMonth.length == 1)controlMonth = "0"+controlMonth;
        if((controlMonth == month)&&(controlDay == day)){
            var zaznamy = $(xml).find('zaznam')
            zaznamy.each(function(){
            if($.trim($(this).find("den")[0].textContent) === (month+""+day)){
                if($(this).find("SK")[0] !== undefined) $("#tooltip").text($(this).find("SK")[0].textContent);
                else $("#tooltip").text("");
                }
            });
        }else{
            $("#tooltip").text("Zvoleny datum neexistuje");
        }
        
    }else if (( res2 == null)&&(str !== "")){
        var zaznamy = $(xml).find('zaznam');
        zaznamy.each(function(){
            if($(this).find("SK")[0] != undefined)
                if($.trim($(this).find("SK")[0].textContent).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(str)){
                    var ans = $(this).find("den")[0].textContent.match("([0-9][0-9])([0-9][0-9])");
                    $("#tooltip").text(ans[2]+"."+ans[1]+".");
                }
        });
    }else{
        $("#tooltip").text("Format vstupu: Datum: DD.MM.(optional YYYY) Meno: len znaky slovenskej abecedy");
        
    }
}


