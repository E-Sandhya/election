$.getJSON("http://125.16.26.150/ERLIVE/ebapi/getStates.php", function(getStatesresult) {
    for (var l = 0; l <= getStatesresult.results.length - 1; l++) {
        var getStatesId = getStatesresult.results[l];
        console.log(getStatesId);
    }
});
    
$(document).ready(function() {
    $('#TG_Constituency').DataTable();
    $('#partyWiseResults').DataTable({
        "ajax": {
            url: 'http://125.16.26.150/ERLIVE/ebapi/mp_partywiseresult.php?language=en',
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
    });
    //Select State Wise Election Results AP
        $('#state-te').DataTable({
        "ajax": {
            url: 'http://125.16.26.150/ERLIVE/ebapi/mp_statewise_vipcandidate.php?language=te&state=5',
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
            },
            {
                "data": "Gain +"
            },
            {
                "data": "Loss -"
            },
        ]
    });
});
$(document).ready(function() {
    var allParty = [],
        allPartyValue = [],
        chartArray = [],
        sumAllPartyValue = 0;

    $('#lokSabhaEresult').DataTable({
        "ajax": {
            url: 'http://125.16.26.150/ERLIVE/ebapi/mp_partywiseresult.php?language=en',
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
    });



    //highchart
    //Tally Lok Sabha

    $.getJSON("http://125.16.26.150/ERLIVE/ebapi/mp_partywiseresult.php?language=en", function(result) {
        for (var i = 0; i <= result.results.PartyInfo.length - 1; i++) {
            var partyInfoArr = result.results.PartyInfo[i];
            chartArray.push([partyInfoArr["Party"], parseInt(partyInfoArr["Total"])]);
            sumAllPartyValue += parseInt(partyInfoArr["Total"]);
        }

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

    });
// National Personalities

    $.getJSON("http://125.16.26.150/ERLIVE/ebapi/national_personalities.php?language=en", function(success) {
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
// VIP candidates
     $.getJSON("http://125.16.26.150/ERLIVE/ebapi/mp_statewise_vipcandidate.php?language=te&state=5", function(successdata) {
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

});