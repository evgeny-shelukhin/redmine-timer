(function() {

// Custom JS
$(document).ready(function() {
	
	var updateJsonForm = $('#update form');
	
	function updateJson(method, url, data) {
		$.ajax({
			dataType: 'json',
			contentType: 'application/json',
			method: method,
			url: url,
			data: JSON.stringify(data),
			// API key
			key: ''
		});
	}
	
	if ($('.cf_3').length > 0) {
		
		// Get issue Id
		var issue_id = $.ajax({
			method: 'GET',
			url: updateJsonForm.attr('action') + '.json',
			// API key
			key: ''
		}).done(function(data) {
			window.issue_id = data.issue.id;
		});
		
		// Timer
		var $timer_field = $('td.cf_3');
		$timer_field.hide();
		
		// Data
		var timer = {},
		seconds = seconds % 60 || 0,
		minutes = parseInt(seconds / 60 % 60) || 0,
		hours = parseInt(seconds / 60 / 60) || 0;
		
		// Template
		$timer_field.after('<div id="stopwatch">' + '<span id="stopwatch_hours" class="stopwatch_timer_item">' + 0 + '</span>час.' + '<span id="stopwatch_minutes" class="stopwatch_timer_item">' + 0 + '</span>мин.' + '<span id="stopwatch_seconds" class="stopwatch_timer_item">' + 0 + '</span>сек.' + '</div>' + '<button class="btn-inline btn-play">Старт</button>' + '<button class="btn-inline btn-pause">Сохранить</button>');
		
		var $stopwatch_seconds = $('#stopwatch_seconds'),
		$stopwatch_minutes = $('#stopwatch_minutes'),
		$stopwatch_hours = $('#stopwatch_hours'),
		$btn_pause = $('.btn-pause'),
		$btn_play = $('.btn-play');
		
		// Play
		$btn_play.on('click', function() {
			
			// Change issue div background
			$('div.issue').css('background', '#dfffdf');
			
			// Hide/show buttons
			$(this).hide();
			$btn_pause.show();
			
			// Start the timer
			timer = setInterval(function() {
				seconds++;
				$stopwatch_seconds.text(seconds % 60);
				$stopwatch_minutes.text(parseInt(seconds / 60));
				$stopwatch_hours.text(parseInt(seconds / 60 / 60));
			}, 1000);
		});
		
		// Pause
		$btn_pause.on('click', function() {
			
			// Change issue div background
			$('div.issue').css('background', '#ffffdd');
			
			// Hide/show buttons
			$(this).hide();
			$btn_play.show();
			
			// Stop the timer
			clearInterval(timer);
			
			// Update timer
			var update_timer_url = updateJsonForm.attr('action') + '.json';
			updateJson('PUT', update_timer_url, {
				"issue": {
					"custom_fields":
						[
							{
								// Custom field id
								"id":3,
								"value": seconds.toString()
							}
						]
				}
			});
			
			// Update spent time
			var update_spent_time_url = '/time_entries.json',
			spent_time = parseFloat($('td.cf_3').text()) / 60 / 60;
			updateJson('POST', update_spent_time_url, {
				"time_entry": {
					"issue_id": window.issue_id,
					"hours": spent_time,
					"activity_id": 1
				}
			});
			var time_total = parseFloat($('td.spent-time').text()) || 0;
			time_total += spent_time; 
			$('td.spent-time').html('<a href="' + window.location.href + '/time_entries">' + time_total.toFixed(2) + ' час.' + '</a>');
			
			// Reset
			seconds = 0;
			$stopwatch_seconds.text(0);
			$stopwatch_minutes.text(0);
			$stopwatch_hours.text(0);
		});
	}
});
	
})(jQuery);
