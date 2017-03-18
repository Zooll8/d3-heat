'use strict';

var data = [];
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var colors = ['#333399', '#0066ff', '#00cc99', '#66ff99', '#ccff99', '#ffff99', '#ffcc99', '#ff9966', '#ff6600', '#cc0014', '#990055'];
var numbers = [0, 2.7, 3.9, 5, 6.1, 7.2, 8.3, 9.4, 10.5, 11.6, 12.7];

function month(x) {
   switch (x) {
      case 1:
         return 'January';
         break;
      case 2:
         return 'February';
         break;
      case 3:
         return 'March';
      case 4:
         return 'April';
      case 5:
         return 'May';
      case 6:
         return 'June';
      case 7:
         return 'July';
      case 8:
         return 'August';
      case 9:
         return 'September';
      case 10:
         return 'October';
      case 11:
         return 'November';
      case 12:
         return 'December';
   }
}

function kek() {
   var h = 600;
   var w = 1200;
   var padding = 20;
   var yScale = d3.scaleLinear().domain([1, 12]).range([padding * 5, h - padding * 5]);
   var xScale = d3.scaleLinear().domain([d3.min(data.monthlyVariance, function (d) {
      return d.year;
   }), d3.max(data.monthlyVariance, function (d) {
      return d.year;
   })]).range([padding * 4, w - padding * 4]);
   var svg = d3.select(".render").append("svg").attr("width", w).attr("height", h);
   var div = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

   svg.selectAll('rect.bar').data(data.monthlyVariance).enter().append('rect').attr('x', function (d) {
      return xScale(d.year);
   }).attr('y', function (d) {
      return yScale(d.month);
   }).attr('height', (h - padding * 7) / 12).attr('width', (w - padding * 8) / (2015 - 1753)).attr('fill', function (d) {
      var checker = d.variance;
      if (checker < 0.55 && checker > -0.55) {
         return '#ffcc99';
      } else if (checker >= -1.65 && checker <= -0.55) {
         return '#ffff99';
      } else if (checker < -1.65 && checker > -2.75) {
         return '#ccff99';
      } else if (checker <= -2.75 && checker >= -3.85) {
         return '#66ff99';
      } else if (checker < -3.85 && checker > -4.95) {
         return '#00cc99';
      } else if (checker <= -4.95 && checker >= -6.05) {
         return '#0066ff';
      } else if (checker < -6.05) {
         return '#333399';
      } else if (checker >= 0.55 && checker <= 1.65) {
         return '#ff9966';
      } else if (checker > 1.65 && checker < 2.75) {
         return '#ff6600';
      } else if (checker >= 2.75 && checker < 3.85) {
         return '#cc0014';
      } else if (checker >= 3.85) {
         return '#990055';
      }
   }).on("mouseover", function (d) {
      div.transition().duration(200).style("opacity", .9);
      div.html(d.year + ' - ' + month(d.month) + "<br/>" + (Math.floor((d.variance + 8.66) * 1000) / 1000 + ' ℃<br/>' + Math.floor(d.variance * 1000) / 1000 + ' ℃')).style("left", d3.event.pageX + "px").style("top", d3.event.pageY - 30 + "px");
   }).on("mouseout", function (d) {
      div.transition().duration(200).style("opacity", 0);
   });

   svg.selectAll("text.monthes").data(months).enter().append('text').text(function (d) {
      return d;
   }).attr('x', 0).attr('y', function (d, i) {
      return yScale(i);
   }).attr('transform', 'translate(75,60)').style('font-size', '9px').attr('class', 'font').style("text-anchor", "end").attr("startOffset", "100%");

   var xAxis = d3.axisBottom().scale(xScale).ticks(25).tickFormat(d3.format(''));
   svg.append('g').call(xAxis).attr('transform', 'translate(0,538)').attr('class', 'axis');

   svg.append('text').text('Years').attr('x', 575).attr('y', 575).attr('class', 'font');

   svg.append('text').text('Months').attr('x', 0).attr('y', 0).attr('class', 'font').attr('transform', 'translate(27,345)rotate(270)');

   svg.append('text').text('Monthly Global Land-Surface Temperature by Zooll').attr('x', 280).attr('y', 35).attr('class', 'font').style('font-size', 30);

   svg.append('text').text('1753 - 2015').attr('x', 540).attr('y', 65).attr('class', 'fontlight').style('font-size', 14);

   svg.append('text').text('Temperatures are in Celsius and reported as anomalies relative to the Jan 1951-Dec 1980 average.').attr('x', 340).attr('y', 80).attr('class', 'fontlight').style('font-size', 11);
   svg.append('text').text('Estimated Jan 1951-Dec 1980 absolute temperature ℃: 8.66 +/- 0.07').attr('x', 390).attr('y', 93).attr('class', 'fontlight').style('font-size', 11);

   svg.selectAll('rect.legend').data(colors).enter().append('rect').attr('x', function (d, i) {
      return i * 20 + 900;
   }).attr('y', 560).attr('width', 20).attr('height', 15).attr('fill', function (d) {
      return d;
   });
   svg.selectAll('text.legend').data(numbers).enter().append('text').attr('x', function (d, i) {
      return i * 20 + 910;
   }).attr('y', 585).text(function (d) {
      return d;
   }).style("text-anchor", "middle").style('font-size', '8px').attr('class', 'font');
}

d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json', function (error, objectdata) {
   data = objectdata;
   kek();
});