	var parent = $("#chad").parent();
	$(parent).css({backgroundImage: "url(/static/ClubHubAd/base.png)"});
	
	$.fn.animateRotate = function(angle, duration, easing, complete) {
		return this.each(function() {
			var $elem = $(this);

			$({deg: 0}).animate({deg: angle}, {
				duration: duration,
				easing: easing,
				step: function(now) {
					$elem.css({
						transform: 'rotate(' + now + 'deg)'
					});
				},
				complete: complete || $.noop
			});
		});
	};
	
	var interval = setInterval(function () {
		if($(parent).is(':visible')) {
			runAnimation();
			clearInterval(interval);
		} else {
			return;
		}
	}, 200);
		
	function runAnimation() {
	
		var blinker = "";
		setTimeout(function(){
			$(parent).append("<div id=\"chad1\" style=\"position: absolute; top: 0; left: 0; width: 100vw; height: 100vh; background-image: url(/static/ClubHubAd/step1.png); background-color: rgba(255,255,255,0.8); background-size: contain; background-position: center; display: none;\"></div>");
			$(parent).append("<img id=\"spinner\" style=\"position: absolute; right: 5vw; top: 5vw; width: 15vw; height: auto; display: none;\" src=\"/static/ClubHubAd/spinner.png\"></img>");
			$("#chad1").fadeIn(1000);
			$("#spinner").fadeIn(1000);
			$("#spinner").animateRotate(1080, 1000);
			setTimeout(function(){
				$(parent).append("<div id=\"chad2\" style=\"opacity: 0; position: absolute; top: 0; left: 100vw; width: 100vw; height: 100vh; background-image: url(/static/ClubHubAd/step2.png); background-size: contain; background-position: center;\"></div>");
				$(parent).append("<img id=\"tv\" style=\"opacity: 0; position: absolute; bottom: 5vw; left: -20vw; width: 15vw; height: auto;\" src=\"/static/ClubHubAd/tv.png\"></img>");
				$(parent).append("<img id=\"tvspinner\" style=\"opacity: 0; position: absolute; bottom: 8vw; left: 8vw; width: 7vw; height: auto;\" src=\"/static/ClubHubAd/tvspinner.png\"></img>");
				$("#tv").animate({opacity: 100, left: "5vw"}, 1000);
				$("#chad2").animate({opacity: 100, left: "0"}, 1000);
				$("#tvspinner").animateRotate(1200, 10000);
				blinker = setInterval(function(){
					if($("#tvspinner").css("opacity") < .5) {
						$("#tvspinner").animate({opacity: 1, width: "10vw"}, 1000);
					} else {
						$("#tvspinner").animate({opacity: 0, width: "8vw"}, 1000);
					}
				}, 1000);
			}, 1000);
		}, 500);
		
		setTimeout(function(){
			clearInterval(blinker);
			interval = setInterval(function () {
				if($(parent).is(':visible')) {
					runAnimation();
					clearInterval(interval);
				} else {
					return;
				}
			}, 200);
			$("#chad1").remove();
			$("#spinner").remove();
			$("#tv").remove();
			$("#chad2").remove();
			$("#tvspinner").remove();
		}, 11000);
	}
