$(function(){
	render = function(data) {
		console.log(data);
		$('#cpu-idle').text(data.cpu.idle)
		$('#cpu-iowait').text(data.cpu.iowait)
		$('#cpu-irq').text(data.cpu.irq)
		$('#cpu-nice').text(data.cpu.nice)
		$('#cpu-system').text(data.cpu.system)
		$('#cpu-user').text(data.cpu.user)
	}

	if (window.glances_server){
		setInterval(function(){
			$.getJSON("/status.json", function(data){
				render(data);
			})
		}, 3000)
	}
})