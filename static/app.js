$(function(){

	// gauge visualization
	var gauges = [];
	function createGauge(name, label)
	{
		var config = 
		{
			size: 160,
			label: label,
			minorTicks: 5
		}
		
		config.redZones = [];
		config.redZones.push({ from: 90, to: 100 });

		config.yellowZones = [];
		config.yellowZones.push({ from: 75, to: 90 });
		
		gauges[name] = new Gauge(name, config);
		gauges[name].render();
	}

	// gauge for cpu
	createGauge("cpu-idle", "CPU Idle");
	createGauge("cpu-iowait", "CPU IO wait");
	createGauge("cpu-irq", "CPU IRQ");
	createGauge("cpu-nice", "CPU Nice");
	createGauge("cpu-system", "CPU System");
	createGauge("cpu-user", "CPU User");
	createGauge("memory-usage", "Mem Usage")

	// graph for load avg
	var graphLoagAvg = new Rickshaw.Graph( {
		element: document.getElementById("cpu-load-avg"),
		width: 900,
		height: 100,
		renderer: 'line',
		series: new Rickshaw.Series.FixedDuration([{ name: 'min1' }, { name: 'min5' }, { name: 'min15' }], undefined, {
			timeInterval: 3000,
			maxDataPoints: 100,
			timeBase: new Date().getTime() / 1000
		}) 
	} );
	graphLoagAvg.render();

	var hoverDetailLoadAvg = new Rickshaw.Graph.HoverDetail( {
		graph: graphLoagAvg
	} );

	var axesLoadAvg = new Rickshaw.Graph.Axis.Time( {
		graph: graphLoagAvg
	} );
	axesLoadAvg.render();

	var graphPerCPU = new Rickshaw.Graph( {
		element: document.getElementById("cpu-percpu"),
		width: 900,
		height: 100,
		renderer: 'line',
		series: new Rickshaw.Series.FixedDuration([{name:'cpu0'}], undefined, {
			timeInterval: 3000,
			maxDataPoints: 100,
			timeBase: new Date().getTime() / 1000
		}) 
	} );
	graphPerCPU.render();

	var hoverDetailPerCPU = new Rickshaw.Graph.HoverDetail( {
		graph: graphPerCPU
	} );

	var axesPerCPU = new Rickshaw.Graph.Axis.Time( {
		graph: graphPerCPU
	} );
	axesPerCPU.render();


	// rendering function, update data on all visual
	render = function(data) {
		console.log(data.percpu);

		// cpu
		gauges['cpu-idle'].redraw(data.cpu.idle);
		gauges['cpu-iowait'].redraw(data.cpu.iowait);
		gauges['cpu-irq'].redraw(data.cpu.irq);
		gauges['cpu-nice'].redraw(data.cpu.nice);
		gauges['cpu-system'].redraw(data.cpu.system);
		gauges['cpu-user'].redraw(data.cpu.user);
		gauges['memory-usage'].redraw(data.mem.percent);
	
		graphLoagAvg.series.addData(data.load);
		graphLoagAvg.render();

		var perCPU = {}
		for (item in data.percpu) {
			perCPU['cpu' + item] = data.percpu[item].system + data.percpu[item].user;
		}
		graphPerCPU.series.addData(perCPU);
		graphPerCPU.render();


	}

	// if glances_server defined, execute render function by interval
	if (window.glances_server){
		setInterval(function(){
			$.getJSON("/status.json", function(data){
				render(data);
			})
		}, 3000)
	}

})