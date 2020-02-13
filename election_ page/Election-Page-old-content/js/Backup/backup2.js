var allParty = [], allPartyValue = [], chartArray = [], sumAllPartyValue = 0;
var appData = {
    apiConfig: {
        baseURL: 'http://125.16.26.150/ERLIVE/ebapi/',
        suffixes: {
        getState: 'getStates.php',
        partyWiseResults: 'mp_partywiseresult.php?language=en',
        stateVIP: 'mp_statewise_vipcandidate.php?language=te&state=5',
        nationalPerson: 'national_personalities.php?language=en'
        },
        endpoint: {
            country: 'getCountries.php',
            city: 'getCities.php'
        }
    },
    data: {
        liveNews: {},
        lokSabha: {
            title: ''
        },
    },
    currentLanguage: undefined
}


var partyWiseResultsConfig = {
    "ajax": {
        url: appData.apiConfig.baseURL + appData.apiConfig.suffixes.partyWiseResults,
        dataSrc: 'results.PartyInfo'
    },
    "bPaginate": false,
    "columns": [{
            "data": "Party"
        },
        {
            "data": "Party_Local"
        },
        {
            "data": "Lead"
        },
        {
            "data": "Won"
        },
        {
            "data": "Total"
        },
        {
            "data": "Gain"
        },
        {
            "data": "Loss"
        },
    ]
};
var stateWiseResultsConfig ={
        "ajax": {
            url: appData.apiConfig.baseURL+appData.apiConfig.suffixes.stateVIP,
            dataSrc: 'results.PartyInfo '
        },
        "bPaginate": false,
        "columns": [{
                "data": "Party"
            },
            {
                "data": "Lead"
            },
            {
                "data": "Won"
            },
            {
                "data": "Total"
            },
            {
                "data": "Gain"
            },
            {
                "data": "Loss"
            },
        ]
};

var lokSabhaEresultConfig = {
    "ajax": {
        url: appData.apiConfig.baseURL + appData.apiConfig.suffixes.partyWiseResults,
        dataSrc: 'results.PartyInfo'
    },
    "bPaginate": false,
    "columns": [{
            "data": "Party"
        },
        {
            "data": "Lead"
        },
        {
            "data": "Won"
        },
        {
            "data": "Total"
        }
    ]
};

function getJSON(url,successCallback) {
    $.getJSON(url, function(response) {
            successCallback(response);
        }
    );
}
//create dropdown for Select State Wise Election Results;
function getLanguageState() {   
    getJSON(appData.apiConfig.baseURL + appData.apiConfig.suffixes.getState, function(getStatesresult) {
        renderLanguageState(createDropdownHTML(getStatesresult, 'state_id', 'state_name'));
        renderConstituencyState(createDropdownHTML(getStatesresult, 'state_id', 'state_name'));
        }    
    );
}

function createDropdownHTML(incomingData, idKey, displayKey){
    var option;
    for(var l = 1; l <=  incomingData.results.length - 1; l++){
        option += '<option value="' + incomingData.results[l][idKey] + '">' + incomingData.results[l][displayKey] + '</option>';
    }
    return option;
}

function renderLanguageState(option) {
    document.getElementById('stateWiseOption');
    $("#stateWiseOption").empty();
    document.getElementById('stateWiseOption').innerHTML= option;
}

//Select Constituency Wise Election Results

function renderConstituencyState(option) {
    document.getElementById('constituencyWise');
    $("#constituencyWise").empty();
    document.getElementById('constituencyWise').innerHTML= option;
}

function renderLokSabhaChart(chartArray, sumAllPartyValue) {
        document.getElementById("sumAllPartyValue").textContent = sumAllPartyValue;
        Highcharts.chart('tally_lok_sabha', {
            chart: {
                backgroundColor: 'rgba(255, 255, 255, 0.0)',
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: '',
                align: 'center',
                verticalAlign: 'middle',
                y: 50
            },
            tooltip: {
                pointFormat: '<b>{point.percentage:.1f}</b>'
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: true,
                        distance: -70,
                        style: {
                            fontWeight: 'bold',
                            color: 'black'
                        }
                    },
                    startAngle: -90,
                    endAngle: 90,
                    center: ['50%', '50%']
                }
            },

            colors: ["#ff5429", "#41ac38", "#00311f", "#128548", "#0255c7", "#ff0000", "#9f0606", "#db7b03", "#27a4ff", "#8d8d8d"],
            series: [{
                   type: 'pie',
                name: '',
                innerSize: '50%',
                data: chartArray
            }]
        });
};
function getLokSabhaHighChart() {
    //highchart
    //Tally Lok Sabha
    getJSON(appData.apiConfig.baseURL + appData.apiConfig.suffixes.partyWiseResults,function(result) {
        for (var i = 0; i <= result.results.PartyInfo.length - 1; i++) {
            var partyInfoArr = result.results.PartyInfo[i];
            chartArray.push([partyInfoArr["Party"], parseInt(partyInfoArr["Total"])]);
            sumAllPartyValue += parseInt(partyInfoArr["Total"]);
        }
        renderLokSabhaChart(chartArray, sumAllPartyValue);
    });   
}
// national Parssonalities
function getNationalPerson(){
        $.getJSON(appData.apiConfig.baseURL+appData.apiConfig.suffixes.nationalPerson, function(success) {
        var nationalPerson = success.results.CandidateInfo;
        var CombinedHTML = '';
        for (var i = 0; i <= nationalPerson.length - 1; i++) {
            var personailty = {
                leadings: nationalPerson[i]['Status'],
                constituency: nationalPerson[i]['Constituency'],
                candidate: nationalPerson[i]['Candidate'],
                party: nationalPerson[i]['Party'],
                img: nationalPerson[i]['photo']

            };
            var spanElement = "<span>" + personailty.constituency + "</span>";
            var leadings = "<p>" + personailty.leadings + "</p>";
            var leadingBlogElement = "<div class='leading-blog'>" + leadings + spanElement + "</div>";
            var otherSpanElement = "<span>" + personailty.party + "</span>";
            var heder4 = "<h4> " + personailty.candidate + " | " + otherSpanElement + "</h4>";
            var secDiv = "<div class='pers-blg-text col-md-9 col-sm-9 col-xs-9'>" + heder4 + leadingBlogElement + "</div>";
            var img = "<img src= personailty.img alt=''>";
            var firstDiv = "<div class='img-blg col-md-3 col-sm-3 col-xs-3'>" + img + "</div>";
            var anc = "<a href='#' class='personalities-blg clearfix'>" + firstDiv + secDiv + "</div>";
            CombinedHTML  = CombinedHTML + anc; 
        }
        $("#nationalPersonalities").html(CombinedHTML);
    });
};
function getVipPerson(){
    $.getJSON(appData.apiConfig.baseURL+appData.apiConfig.suffixes.stateVIP, function(successdata) {
         var PartyInfo_statewise =  successdata.results.PartyInfo;
         var nationalPersonVIP = successdata.results.VipInformation;
         var CombinedHTMLVIP = '';
         for (var j = 0; j <= nationalPersonVIP.length - 1; j++) {
           var personailtyVIP = {
                leadings: nationalPersonVIP[j]['Status'],
                constituency: nationalPersonVIP[j]['Constituency'],
                candidate: nationalPersonVIP[j]['Candidate'],
                party: nationalPersonVIP[j]['Party'],
                img: nationalPersonVIP[j]['photo']
             };
            var spanElementVIP = "<span>" + personailtyVIP.constituency + "</span>";
            var leadingsVIP = "<p>" + personailtyVIP.leadings + "<i class='fa fa-thumbs-up'>" + "</i>" +"</p>";
            var leadingBlogElementVIP = "<div class='vip-leading'>" + leadingsVIP + spanElementVIP + "</div>";
            var stElementVIP = "<strong>" + personailtyVIP.candidate + "</strong>";
            var paraVIP = "<p> " + stElementVIP + " | " + personailtyVIP.party + "</p>";
            var secDivVIP = "<div class='state-vip-cont clearfix'>" + paraVIP + leadingBlogElementVIP + "</div>";
            var imgVIP = "<img src=personailtyVIP.img alt=''>";
            var firstDivVIP = "<div href='#' class='vip-img'>" + imgVIP + "</div>";
            var ancVIP = "<a href='#' class='states-vip-blog clearfix'>" + firstDivVIP + secDivVIP + "</div>";
            CombinedHTMLVIP  = CombinedHTMLVIP + ancVIP; 
        }
        $("#vipCandidates").html(CombinedHTMLVIP);
     });
}

// function getLanguage() {
//     $.ajax({
//         type : "GET",
//         url : "",
//         async : false,
//         success : function(data) {
//             var smallcData = $.parseJSON(data);
//             $('.brands').empty();
//             $('.brands').multiselect("destroy");
//             $.each(smallcData,
//                     function(ind, val) {
//                         $('.brands').append('<option value="'+val+'">' + val + '</option>');
//                     });
//             multiSelectionForBrands();
//         },
//         error : function(error) {
//             console.log(error)
//         }

//     });

// }
// getLanguageState();
// getLokSabhaHighChart();

$(document).ready(function() {
    $('#TG_Constituency').DataTable();
    $('#partyWiseResults').DataTable(partyWiseResultsConfig);
    $('#lokSabhaEresult').DataTable(lokSabhaEresultConfig);
    $('#state-tg').DataTable(stateWiseResultsConfig);
    $('#state-ap').DataTable(stateWiseResultsConfig);
    getLanguageState();
    renderConstituencyState();
    getLokSabhaHighChart();
    getVipPerson();
    getNationalPerson(); 
});