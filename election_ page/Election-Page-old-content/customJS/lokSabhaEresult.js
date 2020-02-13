/*Need be changed.
1) change in Payload ---- PartyInfo need to trimed properly
2) code Refactoring ------ remove unnecessary code
3)stateResBind() method need to un  commented after above issue 1 solved.


*/
var allParty = [],allPartyValue = [],chartArray = [],sumAllPartyValue = 0,stateWiseResDropDef = 5;
var stateWiseResUrl = "";
var stateConstUrl = "";

var appData = {
    apiConfig: {
        baseURL: 'http://125.16.26.150/ERLIVE/ebapi/',
        suffixes: {
            getState: 'getStates.php',
            partyWiseResults: 'mp_partywiseresult.php?language=en',
            stateVIP: 'mp_statewise_vipcandidate.php?language=te&state=',
            stateConstituency: 'mp_statewise_constituency.php?language=te&state=', //'mp_statewise_constituency.php?language=te&state=',
            nationalPerson: 'national_personalities.php?language=en'
        },
        endpoint: {
            country: 'getCountries.php',
            city: 'getCities.php'
        }
    },
}


var partyWiseResultsConfig = {
    "ajax": {
        url: 'http://13.127.2.47/web_api/website/partywise_wonlead_total.php?language=ENGLISH&notif_id=11',
        dataSrc: 'results'
    },
    "bPaginate": false,
    "columns": [{
            "data": "party_name"
        },
        {
            "data": "Seats Contested"
        },
        {
            "data": "won"
        },
        {
            "data": "lead"
        },
        {
            "data": "total"
        },
        {
            "data": "gain+"
        },
        {
            "data": "loss-"
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

function getJSON(url, successCallback) {
    $.getJSON(url, function(response) {
        successCallback(response);
    });
}
//create dropdown for Select State Wise Election Results;
function getLanguageState() {
    getJSON(appData.apiConfig.baseURL + appData.apiConfig.suffixes.getState, function(getStatesresult) {
        renderLanguageState(createDropdownHTML(getStatesresult, 'state_id', 'state_name'));
        renderConstituencyState(createDropdownHTML(getStatesresult, 'state_id', 'state_name'));
    });
}

function createDropdownHTML(incomingData, idKey, displayKey) {
    var option = "";
    for (var l = 0; l <= incomingData.results.length - 1; l++) {
        option += '<option value="' + incomingData.results[l][idKey] + '">' + incomingData.results[l][displayKey] + '</option>';
    }
    return option;
}

function renderLanguageState(option) {
    document.getElementById('stateWiseOption');
    $("#stateWiseOption").empty();
    document.getElementById('stateWiseOption').innerHTML = option;
}

//Select Constituency Wise Election Results

function renderConstituencyState(option) {
    document.getElementById('constituencyWise');
    $("#constituencyWise").empty();
    document.getElementById('constituencyWise').innerHTML = option;
    $(".constit-drop option").each(function() {
        if ($(this).text() == "NCT OF DELHI")
            $(this).attr("selected", "selected");
    });
}

function renderLokSabhaChart(chartArray, sumAllPartyValue) {
    document.getElementById("sumAllPartyValue").textContent = sumAllPartyValue;
    $("#sumOfVal").html(sumAllPartyValue);

    // Highcharts.chart('tally_lok_sabha', {
    //     chart: {
    //         backgroundColor: 'rgba(255, 255, 255, 0.0)',
    //         plotBorderWidth: null,
    //         plotShadow: false,
    //         type: 'pie'
    //     },
    //     title: {
    //         text: '',
    //         align: 'center',
    //         verticalAlign: 'middle',
    //         y: 50
    //     },
    //     tooltip: {
    //         pointFormat: '<b>{point.percentage:.1f}</b>'
    //     },
    //     plotOptions: {
    //         pie: {
    //             dataLabels: {
    //                 enabled: true,
    //                 distance: -70,
    //                 style: {
    //                     fontWeight: 'bold',
    //                     color: 'black'
    //                 }
    //             },
    //             startAngle: -90,
    //             endAngle: 90,
    //             center: ['50%', '50%']
    //         }
    //     },

    //     colors: ["#ff5429", "#41ac38", "#00311f", "#128548", "#0255c7", "#ff0000", "#9f0606", "#db7b03", "#27a4ff", "#8d8d8d"],
    //     series: [{
    //         type: 'pie',
    //         name: '',
    //         innerSize: '50%',
    //         data: chartArray
    //     }]
    // });
};

function getLokSabhaHighChart() {
    //highchart
    //Tally Lok Sabha
    getJSON(appData.apiConfig.baseURL + appData.apiConfig.suffixes.partyWiseResults, function(result) {
        for (var i = 0; i <= result.results.PartyInfo.length - 1; i++) {
            var partyInfoArr = result.results.PartyInfo[i];
            chartArray.push([partyInfoArr["Party"], parseInt(partyInfoArr["Total"])]);
            sumAllPartyValue += parseInt(partyInfoArr["Total"]);
        }
        renderLokSabhaChart(chartArray, sumAllPartyValue);
    });
}
// national Parssonalities
function getNationalPerson() {
    $.getJSON(appData.apiConfig.baseURL + appData.apiConfig.suffixes.nationalPerson, function(success) {
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
            var leadingBlogElement = "";
            var spanElement = "<span>" + personailty.constituency + "</span>";
            var leadings = "<p>" + personailty.leadings + "</p>";
            if (personailty.leadings.toLowerCase() == "leading") {
                leadingBlogElement = "<div class='leading-blog'>" + leadings + spanElement + "</div>";
            } else {
                leadingBlogElement = "<div class='trailing-blog'>" + leadings + spanElement + "</div>";
            }
            // var leadingBlogElement = "<div class='leading-blog'>" + leadings + spanElement + "</div>";
            var otherSpanElement = "<span>" + personailty.party + "</span>";
            var heder4 = "<h4> " + personailty.candidate + " | " + otherSpanElement + "</h4>";
            var secDiv = "<div class='pers-blg-text col-md-9 col-sm-9 col-xs-9'>" + heder4 + leadingBlogElement + "</div>";
            var img = "<img src= personailty.img alt=''>";
            var firstDiv = "<div class='img-blg col-md-3 col-sm-3 col-xs-3'>" + img + "</div>";
            var anc = "<a href='#' class='personalities-blg clearfix'>" + firstDiv + secDiv + "</div>";
            CombinedHTML = CombinedHTML + anc;
        }
        $("#nationalPersonalities").html(CombinedHTML);
    });
};

function getVipPerson() {
    $.getJSON(stateWiseResUrl, function(successdata) {
        var PartyInfo_statewise = successdata.results.PartyInfo;
        var nationalPersonVIP = successdata.results.VipInformation;
        var CombinedHTMLVIP = '';
        var leadingsVIP = "";
        var leadingBlogElementVIP = "";
        for (var j = 0; j <= nationalPersonVIP.length - 1; j++) {
            var personailtyVIP = {
                leadings: nationalPersonVIP[j]['Status'],
                constituency: nationalPersonVIP[j]['Constituency'],
                candidate: nationalPersonVIP[j]['Candidate'],
                party: nationalPersonVIP[j]['Party'],
                img: nationalPersonVIP[j]['photo']
            };
            var spanElementVIP = "<span>" + personailtyVIP.constituency + "</span>";
            if (personailtyVIP.leadings.toLowerCase() == "leading") {
                leadingsVIP = "<p>" + personailtyVIP.leadings + "<i class='fa fa-thumbs-up'>" + "</i>" + "</p>";
                leadingBlogElementVIP = "<div class='vip-leading'>" + leadingsVIP + spanElementVIP + "</div>";
            } else {
                leadingsVIP = "<p>" + personailtyVIP.leadings + "<i class='fa fa-thumbs-down'>" + "</i>" + "</p>";
                leadingBlogElementVIP = "<div class='vip-leading vip-trailing'>" + leadingsVIP + spanElementVIP + "</div>";
            }
            var stElementVIP = "<strong>" + personailtyVIP.candidate + "</strong>";
            var paraVIP = "<p> " + stElementVIP + " | " + personailtyVIP.party + "</p>";
            var secDivVIP = "<div class='state-vip-cont clearfix'>" + paraVIP + leadingBlogElementVIP + "</div>";
            var imgVIP = "<img src=personailtyVIP.img alt=''>";
            var firstDivVIP = "<div href='#' class='vip-img'>" + imgVIP + "</div>";
            var ancVIP = "<a href='#' class='states-vip-blog clearfix'>" + firstDivVIP + secDivVIP + "</div>";
            CombinedHTMLVIP = CombinedHTMLVIP + ancVIP;
        }
        $("#vipCandidates").html(CombinedHTMLVIP);
    });
}

function onChangeStates(val) {
    $('#state-tg').empty();
    if ($.isNumeric(val)) {
        stateWiseResUrl = appData.apiConfig.baseURL + appData.apiConfig.suffixes.stateVIP + val;
    } else {
        stateWiseResUrl = appData.apiConfig.baseURL + appData.apiConfig.suffixes.stateVIP + stateWiseResDropDef;
    }
    stateResBind(stateWiseResUrl);
    getVipPerson();
}

function onChangeStatesVip() {
    $('#vipCandidates').empty();

}

function onChangeConstWise(val) {
    // $('#constTable').empty();
    if ($.isNumeric(val)) {
        stateConstUrl = appData.apiConfig.baseURL + appData.apiConfig.suffixes.stateConstituency + val;
    } else {
        stateConstUrl = appData.apiConfig.baseURL + appData.apiConfig.suffixes.stateConstituency + stateWiseResDropDef;
    }
    constiResBind(stateConstUrl);
}


function stateResBind(url) {
    const tbody = document.querySelector("#state-ap > tbody");
    $.getJSON(url,
        function(successdata) {
            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }
            CombinedHTMLTable = '';
            var stateWiseTotal = 0;
            for (var j = 0; j <= successdata.results.PartyInfo.length - 1; j++) {
                var tr = "<tr>" + "<td>" + successdata.results.PartyInfo[j]['Party'] + "</td>" +
                    "<td>" + successdata.results.PartyInfo[j]['Lead'] + "</td>" +
                    "<td>" + successdata.results.PartyInfo[j]['Won'] + "</td>" +
                    "<td>" + successdata.results.PartyInfo[j]['Total'] + "</td>" +
                    "<td>" + successdata.results.PartyInfo[j]['Gain'] + "</td>" +
                    "<td>" + successdata.results.PartyInfo[j]['Loss'] + "</td>" + "</tr>";
                CombinedHTMLTable = CombinedHTMLTable + tr;
                stateWiseTotal = stateWiseTotal + parseInt(successdata.results.PartyInfo[j]['Total']);
            }
            $("#StateWiseData").html(CombinedHTMLTable);
            document.getElementById("stateWiseTotal").textContent = parseInt(stateWiseTotal);
        });

}

function constiResBind(url) {
    const tbody = document.querySelector("#AP_Constituency > tbody");
    $.getJSON(url,
        function(successdata) {
            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }
            CombinedHTMLTable = '';
            var tr;
            for (var j = 0; j <= successdata.results.ConstituencyInfo.length - 1; j++) {
                if (successdata.results.ConstituencyInfo[j]['Status'].toLowerCase() == "leading") {
                    tr = "<tr>" + "<td>" + successdata.results.ConstituencyInfo[j]['Constituency'] + "</td>" +
                        "<td>" + successdata.results.ConstituencyInfo[j]['Candidate'] + "</td>" +
                        "<td>" + successdata.results.ConstituencyInfo[j]['Party'] + "</td>" +
                        "<td class='leading-blog sorting_1'>" + "<p>" + successdata.results.ConstituencyInfo[j]['Status'] + "<i class='fa fa-long-arrow-up'>" + "</i>" + "</p>" + "</td>" + "</tr>";
                    CombinedHTMLTable = CombinedHTMLTable + tr;
                } else {
                    tr = "<tr>" + "<td>" + successdata.results.ConstituencyInfo[j]['Constituency'] + "</td>" +
                        "<td>" + successdata.results.ConstituencyInfo[j]['Candidate'] + "</td>" +
                        "<td>" + successdata.results.ConstituencyInfo[j]['Party'] + "</td>" +
                        "<td class='trailing-blog sorting_1'>" + "<p>" + successdata.results.ConstituencyInfo[j]['Status'] + "<i class='fa fa-long-arrow-down'>" + "</i>" + "</p>" + "</td>" + "</tr>";
                    CombinedHTMLTable = CombinedHTMLTable + tr;
                }
            }
            $("#constituency_tbody").html(CombinedHTMLTable);
            $("#tdSearch").on("keyup", function() {
                var value = $(this).val().toLowerCase();
                $("#AP_Constituency tr").filter(function() {
                    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
                });
            });
        });
}

function callAPiEveryMinute(){
    stateConstUrl = appData.apiConfig.baseURL + appData.apiConfig.suffixes.stateConstituency + $('#constituencyWise').val();
    stateWiseResUrl = appData.apiConfig.baseURL + appData.apiConfig.suffixes.stateVIP + + $('#stateWiseOption').val();;
    constiResBind(stateConstUrl);
    stateResBind(stateWiseResUrl);
    getVipPerson();
}

$(document).ready(function() {
    $("#stateWiseOption option:contains('NCT OF DELHI')").prop('selected', true);
    $('#partyWiseResults').DataTable(partyWiseResultsConfig);
    $('#lokSabhaEresult').DataTable(lokSabhaEresultConfig);
    getLanguageState();
    renderConstituencyState();
    getLokSabhaHighChart();
    getVipPerson();
    getNationalPerson();
    setInterval(callAPiEveryMinute, 60000);
});



