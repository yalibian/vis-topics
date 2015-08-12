if (typeof CanvasRenderingContext2D !== 'undefined') {
	CanvasRenderingContext2D.prototype.curve = function( ptsa, tension, numOfSegments, minSegments ) {

		var pts, res = [],			// clone array
			x, y,					// our x,y coords
			t1x, t2x, t1y, t2y,		// tension vectors
			c1, c2, c3, c4,			// cardinal points
			st, t, i,				// steps based on num. of segments
			pow3, pow2,				// cache powers
			pow32, pow23,
			p0, p1, p2, p3,			// cache points
			pl = ptsa.length,
			as = false, dx, dy,		// adaptive segmentation
			aseg = 0.25,
			minSeg = 7;

		// use input value if provided, or use a default value	 
		tension = (typeof tension === 'number') ? tension : 0.5;

		if (typeof numOfSegments === 'number') {
			numOfSegments = parseInt(numOfSegments, 10);
			if (numOfSegments === 0) numOfSegments = -4;
			as = numOfSegments < 0 ? true : false;
			aseg = 1 / Math.abs(numOfSegments);

			if (as === true)
				minSeg = (typeof minSegments === 'number') ? parseInt(minSegments, 10) : 7;
				if (minSeg < 1) minSeg = 1;
		} else {
			as = true;
		}

		pts = ptsa.concat();		// clone array so we don't change the original content

		pts.unshift(ptsa[1]);		// copy 1. point and insert at beginning
		pts.unshift(ptsa[0]);
		pts.push(ptsa[pl - 2], ptsa[pl - 1]);	// copy last point and append

		// 1. loop goes through point array
		// 2. loop goes through each segment between the two points + one point before and after
		for (i = 2; i < pl; i += 2) {

			p0 = pts[i];
			p1 = pts[i + 1];
			p2 = pts[i + 2];
			p3 = pts[i + 3];

			/// calc tension vectors
			t1x = (p2 - pts[i - 2]) * tension;
			t2x = (pts[i + 4] - p0) * tension;

			t1y = (p3 - pts[i - 1]) * tension;
			t2y = (pts[i + 5] - p1) * tension;

			if (as === true) {
				dx = p2 - p0;
				dy = p3 - p0;
				numOfSegments = (Math.max(minSeg, Math.abs(Math.sqrt(dx * dx + dy * dy)) * aseg + 0.5))|0;
			}

			for(t = 0; t <= numOfSegments; t++) {

				/// calc step
				st = t / numOfSegments;
			
				pow2 = Math.pow(st, 2);
				pow3 = pow2 * st;
				pow23 = pow2 * 3;
				pow32 = pow3 * 2;

				/// calc cardinals
				c1 = pow32 - pow23 + 1; 
				c2 = pow23 - pow32;
				c3 = pow3 - 2 * pow2 + st; 
				c4 = pow3 - pow2;

				/// calc x and y cords with common control vectors
				x = c1 * p0 + c2 * p2 + c3 * t1x + c4 * t2x;
				y = c1 * p1 + c2 * p3 + c3 * t1y + c4 * t2y;
			
				/// store points in array
				this.lineTo(x, y);
			}
		}
		return this;
	}
}
 