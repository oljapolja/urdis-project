//Animate CSS + WayPoints javaScript Plugin
//Example: $(".element").animated("zoomInUp");
// $(".class1, .class2").animated("id", "fadeIn");
// ".class1, .class2" - классы, к которым будет пременен animation
// id - элемента, дойдя до которого будет срабатывать animation
//Author URL: http://webdesign-master.ru

(function($) {
	$.fn.animated = function(id, inEffect) {

		this.each(function() {
			var ths = $(this);

			ths.css("opacity", "0").addClass("animated");
			
			var waypoint4 = new Waypoint({
				element: document.getElementById(id),
				handler: function() {
					ths.addClass(inEffect).css("opacity", "1");
				},
				offset:"70%"
			});
			
			
			// waypoint(function(dir) {
			// 	if (dir === "down") {
			// 		ths.addClass(inEffect).css("opacity", "1");
			// 	};
			// }, {
			// 	offset: "90%"
			// });

		});
	};
})(jQuery);
