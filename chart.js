var chart;

var chart_data = [];

AmCharts.ready(function () {
        // XY CHART
        chart = new AmCharts.AmXYChart();

        chart.dataProvider = chart_data;
        chart.startDuration = 1;

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

        // first
        var graph1 = new AmCharts.AmGraph();
        graph1.title='first component up';
        graph1.lineColor = "#444444";
        graph1.balloonText = "x:[[x]] y:[[y]]";
        graph1.xField = "index";
        graph1.yField = "first";
        graph1.lineAlpha = 1;
        graph1.lineThickness = 3;
        chart.addGraph(graph1);

        // second
        var graph2 = new AmCharts.AmGraph();
        graph2.title='second component up';
        graph2.lineColor = "#888888";
        graph2.balloonText = "x:[[x]] y:[[y]]";
        graph2.xField = "index";
        graph2.yField = "second";
        graph2.lineAlpha = 1;
        graph2.lineThickness = 3;
        chart.addGraph(graph2);
        
        
        // third
        var graph3 = new AmCharts.AmGraph();
        graph3.title='third component up';
        graph3.lineColor = "#cccccc";
        graph3.balloonText = "x:[[x]] y:[[y]]";
        graph3.xField = "index";
        graph3.yField = "third";
        graph3.lineAlpha = 1;
        graph3.lineThickness = 3;
        chart.addGraph(graph3);
        
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
                tmp={index:i, first:val.scenarios[0][i],second:val.scenarios[2][i],third:val.scenarios[4][i]}
                chart_data.push(tmp);
        }
        

        chart.dataProvider = chart_data;
        chart.validateData();
}




