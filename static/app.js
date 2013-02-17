$(function(){

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

	
	createGauge("cpu-idle", "CPU Idle");
	createGauge("cpu-iowait", "CPU IO wait");
	createGauge("cpu-irq", "CPU IRQ");
	createGauge("cpu-nice", "CPU Nice");
	createGauge("cpu-system", "CPU System");
	createGauge("cpu-user", "CPU User");

	createGauge("memory-usage", "Mem Usage")

	render = function(data) {
		console.log(data);
		gauges['cpu-idle'].redraw(data.cpu.idle);
		gauges['cpu-iowait'].redraw(data.cpu.iowait);
		gauges['cpu-irq'].redraw(data.cpu.irq);
		gauges['cpu-nice'].redraw(data.cpu.nice);
		gauges['cpu-system'].redraw(data.cpu.system);
		gauges['cpu-user'].redraw(data.cpu.user);
		gauges['memory-usage'].redraw(data.mem.percent);
	}

	if (window.glances_server){
		setInterval(function(){
			$.getJSON("/status.json", function(data){
				render(data);
			})
		}, 3000)
	}
})