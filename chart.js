var chart;

var chart_data = [];

AmCharts.ready(function () {
        // XY CHART
        chart = new AmCharts.AmXYChart();

        chart.dataProvider = chart_data;
        //disable animation
        //chart.startDuration = 1;

        // AXES
        // X
        var xaxis = new AmCharts.ValueAxis();
        xaxis.title = "Index";
        xaxis.position = "bottom";
        xaxis.dashLength = 1;
        xaxis.axisAlpha = 0;
        xaxis.autoGridCount = true;
        chart.addValueAxis(xaxis);

        // Y
        var yaxis = new AmCharts.ValueAxis();
        yaxis.position = "left";
        yaxis.title = "Value";
        yaxis.dashLength = 1;
        yaxis.axisAlpha = 0;
        yaxis.autoGridCount = true;
        chart.addValueAxis(yaxis);

        // GRAPHS

        // first up
        var graph1 = new AmCharts.AmGraph();
        graph1.title='first component up';
        graph1.lineColor = "#004400";
        graph1.balloonText = "x:[[x]] y:[[y]]";
        graph1.xField = "index";
        graph1.yField = "first_up";
        graph1.lineAlpha = 1;
        graph1.lineThickness = 3;
        chart.addGraph(graph1);

        // second up
        var graph2 = new AmCharts.AmGraph();
        graph2.title='second component up';
        graph2.lineColor = "#008800";
        graph2.balloonText = "x:[[x]] y:[[y]]";
        graph2.xField = "index";
        graph2.yField = "second_up";
        graph2.lineAlpha = 1;
        graph2.lineThickness = 3;
        chart.addGraph(graph2);
        
        
        // third up
        var graph3 = new AmCharts.AmGraph();
        graph3.title='third component up';
        graph3.lineColor = "#00FF00";
        graph3.balloonText = "x:[[x]] y:[[y]]";
        graph3.xField = "index";
        graph3.yField = "third_up";
        graph3.lineAlpha = 1;
        graph3.lineThickness = 3;
        chart.addGraph(graph3);
        
        // first down
        var graph4 = new AmCharts.AmGraph();
        graph4.title='first component down';
        graph4.lineColor = "#000044";
        graph4.balloonText = "x:[[x]] y:[[y]]";
        graph4.xField = "index";
        graph4.yField = "first_down";
        graph4.lineAlpha = 1;
        graph4.lineThickness = 3;
        chart.addGraph(graph4);

        // second down
        var graph5 = new AmCharts.AmGraph();
        graph5.title='second component down';
        graph5.lineColor = "#000088";
        graph5.balloonText = "x:[[x]] y:[[y]]";
        graph5.xField = "index";
        graph5.yField = "second_down";
        graph5.lineAlpha = 1;
        graph5.lineThickness = 3;
        chart.addGraph(graph5);
        
        
        // third down
        var graph6 = new AmCharts.AmGraph();
        graph6.title='third component down';
        graph6.lineColor = "#0000FF";
        graph6.balloonText = "x:[[x]] y:[[y]]";
        graph6.xField = "index";
        graph6.yField = "third_down";
        graph6.lineAlpha = 1;
        graph6.lineThickness = 3;
        chart.addGraph(graph6);
        
        
        // LEGEND
        var legend = new AmCharts.AmLegend();
        legend.bulletType = "round";
        legend.equalWidths = true;
        legend.valueWidth = 80;
        legend.useGraphSettings = true;
        //legend.color = "#FFFFFF";
        chart.addLegend(legend);

        // CURSOR
        var chartCursor = new AmCharts.ChartCursor();
        chart.addChartCursor(chartCursor);

        // SCROLLBAR
/*
        var chartScrollbar = new AmCharts.ChartScrollbar();
        chartScrollbar.scrollbarHeight = 5;
        chartScrollbar.offset = 15
        chart.addChartScrollbar(chartScrollbar);
*/
        // WRITE
        chart.write("chart_pca");
});

function update_chart(val){
        chart_data=[];        
        var tmp;
        for (i=0;i<val.headers.length;i++){
                tmp={index:i, 
                        first_up:val.scenarios[0][i],
                        second_up:val.scenarios[2][i],
                        third_up:val.scenarios[4][i],
                        first_down:val.scenarios[1][i],
                        second_down:val.scenarios[3][i],
                        third_down:val.scenarios[5][i]}
                chart_data.push(tmp);
        }
        

        chart.dataProvider = chart_data;
        chart.validateData();
}




