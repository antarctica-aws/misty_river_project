(function () {

	var svg = document.getElementById('anime');
	var bd = document.getElementById('bd');
	var riverPath = document.getElementById('theMotionPath');

	if (!svg || !bd || !riverPath) return;

	// The base transform baked into the artwork (centers it near the SVG origin).
	var baseTransform = 'rotate(-15) translate(-814.904,-69.235) scale(0.65, 0.65)';

	var viewBoxWidth = 1400;
	var viewBoxHeight = 13221;

	// Sample the river path so the swimmer can be constrained to it: it should
	// track the mouse but only ever sit on the river, moving down (or up) the
	// channel rather than roaming freely across the whole map.
	var SAMPLE_STEP = 8;
	var totalLength = riverPath.getTotalLength();
	var samples = [];
	for (var len = 0; len < totalLength; len += SAMPLE_STEP) {
		var pt = riverPath.getPointAtLength(len);
		samples.push({ x: pt.x, y: pt.y });
	}
	var lastPt = riverPath.getPointAtLength(totalLength);
	samples.push({ x: lastPt.x, y: lastPt.y });

	function nearestSampleIndex(x, y) {
		var bestIndex = 0, bestDist = Infinity;
		for (var i = 0; i < samples.length; i++) {
			var dx = samples[i].x - x;
			var dy = samples[i].y - y;
			var d = dx * dx + dy * dy;
			if (d < bestDist) {
				bestDist = d;
				bestIndex = i;
			}
		}
		return bestIndex;
	}

	function angleAtIndex(index) {
		var a = samples[Math.max(0, index - 1)];
		var b = samples[Math.min(samples.length - 1, index + 1)];
		return Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
	}

	var currentIndex = 0;
	var targetX = samples[0].x, targetY = samples[0].y;
	var curX = targetX, curY = targetY;
	var curAngle = angleAtIndex(0);

	function svgPointFromClient(clientX, clientY) {
		var rect = svg.getBoundingClientRect();
		var scaleX = viewBoxWidth / rect.width;
		var scaleY = viewBoxHeight / rect.height;
		return [
			(clientX - rect.left) * scaleX,
			(clientY - rect.top) * scaleY
		];
	}

	function updateTarget(clientX, clientY) {
		var p = svgPointFromClient(clientX, clientY);
		currentIndex = nearestSampleIndex(p[0], p[1]);
		targetX = samples[currentIndex].x;
		targetY = samples[currentIndex].y;
	}

	document.addEventListener('mousemove', function (e) {
		updateTarget(e.clientX, e.clientY);
	});

	document.addEventListener('touchmove', function (e) {
		if (e.touches && e.touches.length) {
			updateTarget(e.touches[0].clientX, e.touches[0].clientY);
		}
	}, { passive: true });

	function animate() {
		curX += (targetX - curX) * 0.08;
		curY += (targetY - curY) * 0.08;

		var targetAngle = angleAtIndex(currentIndex);
		var da = targetAngle - curAngle;
		while (da > 180) da -= 360;
		while (da < -180) da += 360;
		curAngle += da * 0.08;

		bd.setAttribute(
			'transform',
			'translate(' + curX.toFixed(2) + ',' + curY.toFixed(2) + ') rotate(' + curAngle.toFixed(2) + ') ' + baseTransform
		);

		requestAnimationFrame(animate);
	}

	requestAnimationFrame(animate);

})();
