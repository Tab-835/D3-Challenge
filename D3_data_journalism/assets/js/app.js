// @TODO: YOUR CODE HERE!
function responsiveChart() {
    var svgArea = d3.select("#scatter").select("svg");
    
    if (!svgArea.empty()) {
        svgArea.remove();
    }

    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;

    var margin = {
        top: 30,
        bottom: 50,
        left: 50,
        right: 200
    };

    var chartHeight = svgHeight - margin.top - margin.bottom;
    var chartWidth = svgWidth - margin.left - margin.right;

    var svg = d3.select("#scatter")
            .append("svg")
            .attr("height", svgHeight)
            .attr("width", svgWidth);

    var chartGroup = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

    d3.csv("./assets/data/data.csv").then(function(censusData) {
        console.log(censusData);

        censusData.forEach(function(data) {
            data.poverty = +data.poverty;
            data.povertyMoe = +data.povertyMoe;
            data.age = +data.age;
            data.ageMoe = +data.ageMoe;
            data.income = +data.income;
            data.incomeMoe = +data.incomeMoe;
            data.healthcare = +data.healthcare;
            data.healthcareLow = +data.healthcareLow;
            data.healthcareHigh = +data.healthcareHigh;
            data.obesity = +data.obesity;
            data.obesityLow = +data.obesityLow;
            data.obesityHigh = +data.obesityHigh;
            data.smokes = +data.smokes;
            data.smokesLow = +data.smokesLow;
            data.smokesHigh = +data.smokesHigh;
        });

        var xLinearScale = d3.scaleLinear()
                            .domain([d3.min(censusData, d => d.poverty) -1, d3.max(censusData, d => d.healthcare) +1])
                            .range([0, chartWidth]);
        
        var yLinearScale = d3.scaleLinear()
                            .domain([d3.min(censusData, d => d.poverty) -1, d3.max(censusData, d => d.poverty) +1])
                            .range([chartHeight, 0]);

        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        chartGroup.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(bottomAxis);

        chartGroup.append("g")
            .call(leftAxis);

        var colorScale = d3.scaleLinear()
                        .domain([d3.min(censusData, d => d.obesity), d3.mean(censusData, d => d.obesity), d3.max(censusData, d => d.obesity)])
                        .range(["green", "yellow", "red"]);

        var tool_tip = d3.tip()
                        .attr("class", "d3-tip")
                        .offset([0, 50])
                        .html(function(d) {
                            return `${d.state}<hr>${d.income}<hr>Obesity Index: ${d.obesity}, Smoking Index: ${d.smokes}`
                        });

        svg.call(tool_tip);

        var circleGroup = chartGroup.selectAll("circle")
                        .data(censusData)
                        .enter()

                        circleGroup.append("circle")
                        .attr("class", "circle")
                        .attr("cx", d => xLinearScale(d.healthcare))
                        .attr("cy", d => yLinearScale(d.poverty))
                        .attr("r", d => ((d.income*d.income)/110000000))
                        .attr("fill", function(d) {
                            return colorScale(d.obesity);
                        })
                        .attr("opacity", "0.7")
                        .style("stroke", "black")

                        circleGroup.append("text")
                        .text(function(d) {
                            return d.abbr;
                        })
                        .attr("x", d => xLinearScale(d.healthcare) - 11)
                        .attr("y", d => yLinearScale(d.poverty) + 6)

                        .on("click", tool_tip.show)
                        .on("mouseout", tool_tip.hide)

        chartGroup.append("text")
            .attr("transform", "rotate(-90")
            .attr("y", 0 - margin.left + 15)
            .attr("x", 0 - (chartHeight / 2))
            .attr("class", "axisTest")
            .text("Poverty Index");

        chartGroup.append("text")
            .attr("y", chartHeight + margin.top + 5)
            .attr("x", chartWidth / 2)
            .attr("class", "axisText")
            .text("Healthcare Index");
    });
};

responsiveChart();

d3.select(window).on("resize", responsiveChart);