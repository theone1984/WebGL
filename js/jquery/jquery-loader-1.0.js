
(function($) {
	$._getScripts = [];
	
	/**
	 * Loads scripts sequentially
	 */
	$.getScripts = function(scriptUrls, successCallback) {
		var scriptCountToLoad = scriptUrls.length;
		$.getScripts.getScript(scriptUrls, 0, successCallback);
	}	

	$.getScripts.getScript = function(scriptUrls, currentIndex, successCallback) {
		$.ajax({
			url: scriptUrls[currentIndex],
			dataType: "script",
			success: function() {
				if (currentIndex == scriptUrls.length - 1) {
					successCallback.call();
				} else {
					$.getScripts.getScript(scriptUrls, currentIndex + 1, successCallback);
				}
			},
			error: function(request, statusText, error) {
				if (error != 'Not Found') {
					var message = error.message + " in '" + scriptUrl + "'";
					throw new Error(message);
				}
			}
		});
	}
	
	/**
	 * Loads data in parallel
	 */
	$.loadData = function(dataUrls, successCallback) {
		var resultingData = new Array();
		
		var dataCountToLoad = 0;		
		for (var dataName in dataUrls)
			dataCountToLoad++;
		
		for (var dataName in dataUrls) {
			var dataUrl = dataUrls[dataName];

			var loaderFunction = function(dataName, dataUrl) {
				$.ajax({
					url: dataUrl,
					success: function(data) {
						dataCountToLoad--;		
						resultingData[dataName] = data;
						
						if (dataCountToLoad == 0) {
							successCallback.call($, resultingData);
						}
					}
				});
			}
			
			loaderFunction.call($, dataName, dataUrl);
		}
	}
}) (jQuery);