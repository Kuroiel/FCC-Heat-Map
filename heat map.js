d3.select("#everything").attr("align", "center");
let width = d3.select("svg").attr("width");
let height = d3.select("svg").attr("height");

let months = [
  "Janurary",
  "Feburary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
).then(function(data) {
  let years = [];
  for (var a = 0; a < data.monthlyVariance.length; a++) {
    years.push(data.monthlyVariance[a].year);
  }

  let yearsUnique = [];

  for (var e = 0; e < years.length; e++) {
    if (yearsUnique.indexOf(years[e]) == -1) {
      yearsUnique.push(years[e]);
    }
  }

  let variances = [];
  for (var b = 0; b < data.monthlyVariance.length; b++) {
    variances.push(data.monthlyVariance[b].variance);
  }

  let months2 = [];
  for (var c = 0; c < data.monthlyVariance.length; c++) {
    months2.push(data.monthlyVariance[c].month);
  }
  let sortedData;
  sortedData = data.monthlyVariance;

  var xScale = d3
    .scaleLinear()
    .domain([d3.min(years), d3.max(years)])
    .range([58, width - 100]);

  d3.select("svg")
    .append("g")
    .attr("transform", "translate(0, 520)")
    .attr("id", "x-axis")
    .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

  var yScale = d3
    .scaleLinear()
    .domain([0, 12])
    .range([0, height - 120]);

  d3.select("svg")
    .append("g")
    .attr("transform", "translate(58, 40)")
    .attr("id", "y-axis")
    .call(
      d3
        .axisLeft(yScale)
        .ticks(13)
        .tickFormat(function(d, i) {
          return months[i];
        })
    );

  d3.select("svg")
    .selectAll("rect")
    .data(sortedData)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-year", function(d, i) {
      return years[i];
    })
    .attr("data-month", function(d, i) {
      return sortedData[i].month - 1;
    })
    .attr("data-temp", function(d, i) {
      return sortedData[i].variance;
    })
    .attr("x", function(d, i) {
      return xScale(sortedData[i].year);
    })
    .attr("y", function(d, i) {
      return yScale(sortedData[i].month);
    })
    .attr("width", function(d, i) {
      return width / yearsUnique.length;
    })
    .attr("height", function(d, i) {
      return (height - 120) / 12;
    })
    .style("fill", function(d, i) {
      if (sortedData[i].variance <= -3) {
        return "red";
      } else if (sortedData[i].variance > -3 && sortedData[i].variance <= 0) {
        return "#b3ecff";
      } else if (sortedData[i].variance > 0 && sortedData[i].variance <= 3) {
        return "#ffccff";
      } else if (sortedData[i].variance > 3) {
        return "green";
      }
    })
    .on("mouseover", function(d, i) {
      d3.select("#tooltip")
        .style("opacity", 0.8)
        .attr("data-year", sortedData[i].year)
        .html(
          "Year: " +
            years[i] +
            "<br>" +
            "Variance " +
            sortedData[i].variance +
            "<br>" +
            "Month " +
            sortedData[i].month
        );
    })
    .on("mouseout", function(d, i) {
      d3.select("#tooltip").style("opacity", 0);
    });

  let colors = ["red", "#b3ecff", "#ffccff", "green"];

  d3.select("body")
    .append("svg")
    .attr("id", "legend")
    .attr("width", 500)
    .attr("height", 100);

  d3.select("#legend")
    .selectAll("rect")
    .data(colors)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {
      return 60 * i;
    })
    .attr("y", function(d, i) {
      return 0;
    })
    .attr("height", 25)
    .attr("width", 60)
    .style("fill", function(d, i) {
      return colors[i];
    });
});
