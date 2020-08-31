const glData = initGL();

/**
 *
 * @return {
 * 	{
 * 		gl: WebGLRenderingContext,
 * 		glProgram: WebGLProgram,
 * 		uniformLocations: {colorUniform: WebGLUniformLocation},
 * 		attrLocations: {vertexPosition: GLint}
 * 	}
 * }
 */
function initGL() {
	const
		canvas = document.getElementById('gl-canvas'),
		gl = canvas.getContext('webgl'),
		vertexShaderSrc = `
			attribute vec4 a_position;
			
			void main() {
				gl_Position = a_position;
			}`,
		fragmentShaderSrc = `
			precision mediump float;
			uniform vec4 u_color;
			
			void main() {
				gl_FragColor = u_color;
			}`;
	canvas.width = 1024;
	canvas.height = 576;

	if ( ! gl) {
		throw 'No WebGL for you!';
	}

	const
		vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc),
		fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc),
		glProgram = createProgram(gl, vertexShader, fragmentShader);
	initBuffers(gl);

	function createShader(gl, type, source) {
		const shader = gl.createShader(type);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
		if (success) {
			return shader;
		}
		const error = gl.getShaderInfoLog(shader);
		gl.deleteShader(shader);
		throw `Error compiling shader: ${error}`;
	}

	function createProgram(gl, vertexShader, fragmentShader) {
		const program = gl.createProgram();
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);
		const success = gl.getProgramParameter(program, gl.LINK_STATUS);
		if (success) {
			return program;
		}
		const error = gl.getProgramInfoLog(program);
		gl.deleteProgram(program);
		throw `Error compiling program: ${error}`;
	}

	function initBuffers(gl) {
		// create a buffer & bind it to a bind point
		const positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	}

	return {
		gl,
		glProgram,
		attrLocations: {
			vertexPosition: gl.getAttribLocation(glProgram, 'a_position'),
		},
		uniformLocations: {
			colorUniform: gl.getUniformLocation(glProgram, "u_color"),
		},
	};
}

/**
 * Buffers passed number of items to be drawn as horizontal row of rectangles
 *
 * @param {number} itemsLength
 * @param {number} selGame
 * @param {number} offset
 *
 * @return {Array.<Array.<number>>}
 */
function bufferMenuItems(itemsLength = 0, selGame = 0, offset = 0) {

	const
		gl = glData.gl,
		height = 0.22,
		width = 0.2,
		selHeight = height * 1.2,
		selWidth = width * 1.2;
	let
		topLeft = [-0.92, 0.11],
		positions = [],
		selPositions = [];

	for (let i = offset; i < itemsLength; i++) {
		// position triangle points from top leftmost in clockwise order
		const
			isSel = i === selGame,
			h = isSel ? selHeight / 2 : height / 2,
			w = isSel ? selWidth : width,
			tl = isSel ? [topLeft[0] - 0.02, topLeft[1] * 1.2] : topLeft,
			rectPositions = [
				...tl,
				tl[0] + w, h,
				tl[0], -h,
				tl[0], -h,
				tl[0] + w, h,
				tl[0] + w, -h,
			];
		positions = [...positions, ...rectPositions];
		if (isSel) {
			selPositions = [...rectPositions];
		}

		// if the selected menu item would be off right side of viewport
		if (isSel && (selPositions[2] > 1)) {

			return bufferMenuItems(itemsLength, selGame, offset + 1)
		} else {
			topLeft = [topLeft[0] + width + 0.05, topLeft[1]];
		}
	}
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

	return [positions, selPositions];
}

/**
 * Buffers positions for lines to be drawn inside of selected menu item
 *
 * @param {Array} selPositions
 */
function bufferSelItemBorder(selPositions) {

	const
		gl = glData.gl,
		height = 0.219,
		width = 0.215;
	let
		topLeft = [selPositions[0] + 0.0121, selPositions[1] - 0.022],
		positions = [
			...topLeft,
			topLeft[0] + width, topLeft[1],
			topLeft[0] + width, topLeft[1],
			topLeft[0] + width, topLeft[1] - height,
			topLeft[0] + width, topLeft[1] - height,
			topLeft[0], topLeft[1] - height,
			topLeft[0], topLeft[1] - height,
			...topLeft,
		];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
}

/**
 * Renders rectangles according to passed games & selected game
 *
 * @param {Array.<Object>} games
 * @param {number} selGame
 *
 * @return {Array.<number>} selPositions
 */
export function renderGL(games = [], selGame= 0) {

	const {gl, glProgram, attrLocations, uniformLocations} = glData;

	// set canvas height & width so gl can translate bw pixels & clip space
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	//make canvas transparent
	gl.clearColor(0, 0, 0 , 0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	// use my shaders
	gl.useProgram(glProgram);
	// turn the attribute on
	gl.enableVertexAttribArray(attrLocations.vertexPosition);
	// bind attribute to buffer & tell attribute how to get data out of the buffer
	gl.vertexAttribPointer(attrLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0);

	const [positions, selPositions] = bufferMenuItems(games.length, selGame);
	gl.uniform4f(uniformLocations.colorUniform, 0.7, 0.7, 0.7, 1);
	gl.drawArrays(gl.TRIANGLES, 0, positions.length / 2);

	bufferSelItemBorder(selPositions);
	gl.uniform4f(uniformLocations.colorUniform, 0.0, 0.0, 0.0, 0);
	gl.drawArrays(gl.LINES, 0, 8);

	return selPositions;
}
