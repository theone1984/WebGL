
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
					var message = error.message + " in '" + scriptUrls[currentIndex] + "'";
					throw new Error(message);
				}
			}
		});
	}
	
	$.loadData = {
		getElementCount: function(hashMap) {
			var elementCount = 0;		
			for (var element in hashMap)
				elementCount++;
			
			return elementCount;
		}
	} 
	
	/**
	 * Loads data in parallel
	 */
	$.loadTexts = function(dataUrls, successCallback) {
		var resultingData = new Array();		
		var dataCountToLoad = $.loadData.getElementCount(dataUrls);
		
		if (dataCountToLoad == 0) {
			successCallback.call($, resultingData);
		}
		
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
	
	$.loadImages = function(dataUrls, successCallback) {
		var resultingData = new Array();		
		var dataCountToLoad = $.loadData.getElementCount(dataUrls);
		
		if (dataCountToLoad == 0) {
			successCallback.call($, resultingData);
		}
		
		for (var dataName in dataUrls) {
			var dataUrl = dataUrls[dataName];
			
			var loaderFunction = function(dataName, dataUrl) {
				var image = new Image();
				image.onload = function() {
					dataCountToLoad--;		
					resultingData[dataName] = image;
					
					if (dataCountToLoad == 0) {
						successCallback.call($, resultingData);
					}					
				}
				image.onerror = function(exception) {
					throw new Error("Error retrieving image '" + dataName + "' at location '" + dataUrl + "': " + exception);
				}
				
				image.src = dataUrl;
			}			
			
			loaderFunction.call($, dataName, dataUrl);			
		}		
	}
	
	
}) (jQuery);