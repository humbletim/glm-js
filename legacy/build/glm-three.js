/*! glm-js built 2025-11-04 03:07:44+00:00 | (c) humbletim | http://humbletim.github.io/glm-js */
/** @preserve
 * --------------------------------------------------------------------------
 * THREE.js | (c) three.js authors | https://github.com/mrdoob/three.js
 * --------------------------------------------------------------------------
 */

/** @license
 * The MIT License
 *
 * Copyright &copy; 2010-2015 three.js authors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
// NOTE: this is a trimmed-down version of THREE (with just math stuffs -- for autonomous use w/glm-js)

// File:src/Three.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

var THREEMATHS = { REVISION: '70-maths-only' };

// use full / user-selected THREE if exists, otherwise this here reduced version
try { THREE.exists }catch(e) { THREE=THREEMATHS }

// browserify support

if ( typeof module === 'object' ) {

	module.exports = THREEMATHS;

}

// polyfills

if ( Math.sign === undefined ) {

	Math.sign = function ( x ) {

		return ( x < 0 ) ? - 1 : ( x > 0 ) ? 1 : +x;

	};

}

// File:src/math/Quaternion.js

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author bhouston / http://exocortex.com
 */

THREEMATHS.Quaternion = function ( x, y, z, w ) {

	this._x = x || 0;
	this._y = y || 0;
	this._z = z || 0;
	this._w = ( w !== undefined ) ? w : 1;

};

THREEMATHS.Quaternion.prototype = {

	constructor: THREEMATHS.Quaternion,

	_x: 0,_y: 0, _z: 0, _w: 0,

	get x () {

		return this._x;

	},

	set x ( value ) {

		this._x = value;
		/*this.onChangeCallback();*/

	},

	get y () {

		return this._y;

	},

	set y ( value ) {

		this._y = value;
		/*this.onChangeCallback();*/

	},

	get z () {

		return this._z;

	},

	set z ( value ) {

		this._z = value;
		/*this.onChangeCallback();*/

	},

	get w () {

		return this._w;

	},

	set w ( value ) {

		this._w = value;
		/*this.onChangeCallback();*/

	},

	set: function ( x, y, z, w ) {

		this._x = x;
		this._y = y;
		this._z = z;
		this._w = w;

		/*this.onChangeCallback();*/

		return this;

	},

	copy: function ( quaternion ) {

		this._x = quaternion.x;
		this._y = quaternion.y;
		this._z = quaternion.z;
		this._w = quaternion.w;

		/*this.onChangeCallback();*/

		return this;

	},

	setFromEuler: function ( euler, update ) {

		if ( euler instanceof THREEMATHS.Euler === false ) {

			throw new Error( 'THREEMATHS.Quaternion: .setFromEuler() now expects a Euler rotation rather than a Vector3 and order.' );
		}

		// http://www.mathworks.com/matlabcentral/fileexchange/
		// 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
		//	content/SpinCalc.m

		var c1 = Math.cos( euler._x / 2 );
		var c2 = Math.cos( euler._y / 2 );
		var c3 = Math.cos( euler._z / 2 );
		var s1 = Math.sin( euler._x / 2 );
		var s2 = Math.sin( euler._y / 2 );
		var s3 = Math.sin( euler._z / 2 );

		if ( euler.order === 'XYZ' ) {

			this._x = s1 * c2 * c3 + c1 * s2 * s3;
			this._y = c1 * s2 * c3 - s1 * c2 * s3;
			this._z = c1 * c2 * s3 + s1 * s2 * c3;
			this._w = c1 * c2 * c3 - s1 * s2 * s3;

		} else if ( euler.order === 'YXZ' ) {

			this._x = s1 * c2 * c3 + c1 * s2 * s3;
			this._y = c1 * s2 * c3 - s1 * c2 * s3;
			this._z = c1 * c2 * s3 - s1 * s2 * c3;
			this._w = c1 * c2 * c3 + s1 * s2 * s3;

		} else if ( euler.order === 'ZXY' ) {

			this._x = s1 * c2 * c3 - c1 * s2 * s3;
			this._y = c1 * s2 * c3 + s1 * c2 * s3;
			this._z = c1 * c2 * s3 + s1 * s2 * c3;
			this._w = c1 * c2 * c3 - s1 * s2 * s3;

		} else if ( euler.order === 'ZYX' ) {

			this._x = s1 * c2 * c3 - c1 * s2 * s3;
			this._y = c1 * s2 * c3 + s1 * c2 * s3;
			this._z = c1 * c2 * s3 - s1 * s2 * c3;
			this._w = c1 * c2 * c3 + s1 * s2 * s3;

		} else if ( euler.order === 'YZX' ) {

			this._x = s1 * c2 * c3 + c1 * s2 * s3;
			this._y = c1 * s2 * c3 + s1 * c2 * s3;
			this._z = c1 * c2 * s3 - s1 * s2 * c3;
			this._w = c1 * c2 * c3 - s1 * s2 * s3;

		} else if ( euler.order === 'XZY' ) {

			this._x = s1 * c2 * c3 - c1 * s2 * s3;
			this._y = c1 * s2 * c3 - s1 * c2 * s3;
			this._z = c1 * c2 * s3 + s1 * s2 * c3;
			this._w = c1 * c2 * c3 + s1 * s2 * s3;

		}

		/*if ( update !== false ) this.onChangeCallback();*/

		return this;

	},

	setFromAxisAngle: function ( axis, angle ) {

		// http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm

		// assumes axis is normalized

		var halfAngle = angle / 2, s = Math.sin( halfAngle );

		this._x = axis.x * s;
		this._y = axis.y * s;
		this._z = axis.z * s;
		this._w = Math.cos( halfAngle );

		/*this.onChangeCallback();*/

		return this;

	},

	setFromRotationMatrix: function ( m ) {

		// http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

		// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

		var te = m.elements,

			m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
			m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
			m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ],

			trace = m11 + m22 + m33,
			s;

		if ( trace > 0 ) {

			s = 0.5 / Math.sqrt( trace + 1.0 );

			this._w = 0.25 / s;
			this._x = ( m32 - m23 ) * s;
			this._y = ( m13 - m31 ) * s;
			this._z = ( m21 - m12 ) * s;

		} else if ( m11 > m22 && m11 > m33 ) {

			s = 2.0 * Math.sqrt( 1.0 + m11 - m22 - m33 );

			this._w = ( m32 - m23 ) / s;
			this._x = 0.25 * s;
			this._y = ( m12 + m21 ) / s;
			this._z = ( m13 + m31 ) / s;

		} else if ( m22 > m33 ) {

			s = 2.0 * Math.sqrt( 1.0 + m22 - m11 - m33 );

			this._w = ( m13 - m31 ) / s;
			this._x = ( m12 + m21 ) / s;
			this._y = 0.25 * s;
			this._z = ( m23 + m32 ) / s;

		} else {

			s = 2.0 * Math.sqrt( 1.0 + m33 - m11 - m22 );

			this._w = ( m21 - m12 ) / s;
			this._x = ( m13 + m31 ) / s;
			this._y = ( m23 + m32 ) / s;
			this._z = 0.25 * s;

		}

		/*this.onChangeCallback();*/

		return this;

	},

	setFromUnitVectors: function () {

		// http://lolengine.net/blog/2014/02/24/quaternion-from-two-vectors-final

		// assumes direction vectors vFrom and vTo are normalized

		var v1, r;

		var EPS = 0.000001;

		return function ( vFrom, vTo ) {

			if ( v1 === undefined ) v1 = new THREEMATHS.Vector3();

			r = vFrom.dot( vTo ) + 1;

			if ( r < EPS ) {

				r = 0;

				if ( Math.abs( vFrom.x ) > Math.abs( vFrom.z ) ) {

					v1.set( - vFrom.y, vFrom.x, 0 );

				} else {

					v1.set( 0, - vFrom.z, vFrom.y );

				}

			} else {

				v1.crossVectors( vFrom, vTo );

			}

			this._x = v1.x;
			this._y = v1.y;
			this._z = v1.z;
			this._w = r;

			this.normalize();

			return this;

		}

	}(),

	inverse: function () {

		this.conjugate().normalize();

		return this;

	},

	conjugate: function () {

		this._x *= - 1;
		this._y *= - 1;
		this._z *= - 1;

		/*this.onChangeCallback();*/

		return this;

	},

	dot: function ( v ) {

		return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;

	},

	lengthSq: function () {

		return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;

	},

	length: function () {

		return Math.sqrt( this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w );

	},

	normalize: function () {

		var l = this.length();

		if ( l === 0 ) {

			this._x = 0;
			this._y = 0;
			this._z = 0;
			this._w = 1;

		} else {

			l = 1 / l;

			this._x = this._x * l;
			this._y = this._y * l;
			this._z = this._z * l;
			this._w = this._w * l;

		}

		/*this.onChangeCallback();*/

		return this;

	},

	multiply: function ( q, p ) {

		if ( p !== undefined ) {

			console.warn( 'THREEMATHS.Quaternion: .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead.' );
			return this.multiplyQuaternions( q, p );

		}

		return this.multiplyQuaternions( this, q );

	},

	multiplyQuaternions: function ( a, b ) {

		// from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

		var qax = a._x, qay = a._y, qaz = a._z, qaw = a._w;
		var qbx = b._x, qby = b._y, qbz = b._z, qbw = b._w;

		this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
		this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
		this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
		this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

		/*this.onChangeCallback();*/

		return this;

	},

	multiplyVector3: function ( vector ) {

		console.warn( 'THREEMATHS.Quaternion: .multiplyVector3() has been removed. Use is now vector.applyQuaternion( quaternion ) instead.' );
		return vector.applyQuaternion( this );

	},

	slerp: function ( qb, t ) {

		if ( t === 0 ) return this;
		if ( t === 1 ) return this.copy( qb );

		var x = this._x, y = this._y, z = this._z, w = this._w;

		// http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

		var cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;

		if ( cosHalfTheta < 0 ) {

			this._w = - qb._w;
			this._x = - qb._x;
			this._y = - qb._y;
			this._z = - qb._z;

			cosHalfTheta = - cosHalfTheta;

		} else {

			this.copy( qb );

		}

		if ( cosHalfTheta >= 1.0 ) {

			this._w = w;
			this._x = x;
			this._y = y;
			this._z = z;

			return this;

		}

		var halfTheta = Math.acos( cosHalfTheta );
		var sinHalfTheta = Math.sqrt( 1.0 - cosHalfTheta * cosHalfTheta );

		if ( Math.abs( sinHalfTheta ) < 0.001 ) {

			this._w = 0.5 * ( w + this._w );
			this._x = 0.5 * ( x + this._x );
			this._y = 0.5 * ( y + this._y );
			this._z = 0.5 * ( z + this._z );

			return this;

		}

		var ratioA = Math.sin( ( 1 - t ) * halfTheta ) / sinHalfTheta,
		ratioB = Math.sin( t * halfTheta ) / sinHalfTheta;

		this._w = ( w * ratioA + this._w * ratioB );
		this._x = ( x * ratioA + this._x * ratioB );
		this._y = ( y * ratioA + this._y * ratioB );
		this._z = ( z * ratioA + this._z * ratioB );

		/*this.onChangeCallback();*/

		return this;

	},

	equals: function ( quaternion ) {

		return ( quaternion._x === this._x ) && ( quaternion._y === this._y ) && ( quaternion._z === this._z ) && ( quaternion._w === this._w );

	},

	fromArray: function ( array, offset ) {

		if ( offset === undefined ) offset = 0;

		this._x = array[ offset ];
		this._y = array[ offset + 1 ];
		this._z = array[ offset + 2 ];
		this._w = array[ offset + 3 ];

		/*this.onChangeCallback();*/

		return this;

	},

	toArray: function ( array, offset ) {

		if ( array === undefined ) array = [];
		if ( offset === undefined ) offset = 0;

		array[ offset ] = this._x;
		array[ offset + 1 ] = this._y;
		array[ offset + 2 ] = this._z;
		array[ offset + 3 ] = this._w;

		return array;

	},

	onChange: function ( callback ) {

		this.onChangeCallback = callback;

		return this;

	},

	onChangeCallback: function () {},

	clone: function () {

		return new THREEMATHS.Quaternion( this._x, this._y, this._z, this._w );

	}

};

THREEMATHS.Quaternion.slerp = function ( qa, qb, qm, t ) {

	return qm.copy( qa ).slerp( qb, t );

}

// File:src/math/Vector2.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author philogb / http://blog.thejit.org/
 * @author egraether / http://egraether.com/
 * @author zz85 / http://www.lab4games.net/zz85/blog
 */

THREEMATHS.Vector2 = function ( x, y ) {

	this.x = x || 0;
	this.y = y || 0;

};

THREEMATHS.Vector2.prototype = {

	constructor: THREEMATHS.Vector2,

	set: function ( x, y ) {

		this.x = x;
		this.y = y;

		return this;

	},

	setX: function ( x ) {

		this.x = x;

		return this;

	},

	setY: function ( y ) {

		this.y = y;

		return this;

	},

	setComponent: function ( index, value ) {

		switch ( index ) {

			case 0: this.x = value; break;
			case 1: this.y = value; break;
			default: throw new Error( 'index is out of range: ' + index );

		}

	},

	getComponent: function ( index ) {

		switch ( index ) {

			case 0: return this.x;
			case 1: return this.y;
			default: throw new Error( 'index is out of range: ' + index );

		}

	},

	copy: function ( v ) {

		this.x = v.x;
		this.y = v.y;

		return this;

	},

	add: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREEMATHS.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
			return this.addVectors( v, w );

		}

		this.x += v.x;
		this.y += v.y;

		return this;

	},

	addVectors: function ( a, b ) {

		this.x = a.x + b.x;
		this.y = a.y + b.y;

		return this;

	},

	addScalar: function ( s ) {

		this.x += s;
		this.y += s;

		return this;

	},

	sub: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREEMATHS.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
			return this.subVectors( v, w );

		}

		this.x -= v.x;
		this.y -= v.y;

		return this;

	},

	subVectors: function ( a, b ) {

		this.x = a.x - b.x;
		this.y = a.y - b.y;

		return this;

	},

	multiply: function ( v ) {

		this.x *= v.x;
		this.y *= v.y;

		return this;

	},

	multiplyScalar: function ( s ) {

		this.x *= s;
		this.y *= s;

		return this;

	},

	divide: function ( v ) {

		this.x /= v.x;
		this.y /= v.y;

		return this;

	},

	divideScalar: function ( scalar ) {

		if ( scalar !== 0 ) {

			var invScalar = 1 / scalar;

			this.x *= invScalar;
			this.y *= invScalar;

		} else {

			this.x = 0;
			this.y = 0;

		}

		return this;

	},

	min: function ( v ) {

		if ( this.x > v.x ) {

			this.x = v.x;

		}

		if ( this.y > v.y ) {

			this.y = v.y;

		}

		return this;

	},

	max: function ( v ) {

		if ( this.x < v.x ) {

			this.x = v.x;

		}

		if ( this.y < v.y ) {

			this.y = v.y;

		}

		return this;

	},

	clamp: function ( min, max ) {

		// This function assumes min < max, if this assumption isn't true it will not operate correctly

		if ( this.x < min.x ) {

			this.x = min.x;

		} else if ( this.x > max.x ) {

			this.x = max.x;

		}

		if ( this.y < min.y ) {

			this.y = min.y;

		} else if ( this.y > max.y ) {

			this.y = max.y;

		}

		return this;
	},

	clampScalar: ( function () {

		var min, max;

		return function ( minVal, maxVal ) {

			if ( min === undefined ) {

				min = new THREEMATHS.Vector2();
				max = new THREEMATHS.Vector2();

			}

			min.set( minVal, minVal );
			max.set( maxVal, maxVal );

			return this.clamp( min, max );

		};

	} )(),

	floor: function () {

		this.x = Math.floor( this.x );
		this.y = Math.floor( this.y );

		return this;

	},

	ceil: function () {

		this.x = Math.ceil( this.x );
		this.y = Math.ceil( this.y );

		return this;

	},

	round: function () {

		this.x = Math.round( this.x );
		this.y = Math.round( this.y );

		return this;

	},

	roundToZero: function () {

		this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
		this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );

		return this;

	},

	negate: function () {

		this.x = - this.x;
		this.y = - this.y;

		return this;

	},

	dot: function ( v ) {

		return this.x * v.x + this.y * v.y;

	},

	lengthSq: function () {

		return this.x * this.x + this.y * this.y;

	},

	length: function () {

		return Math.sqrt( this.x * this.x + this.y * this.y );

	},

	normalize: function () {

		return this.divideScalar( this.length() );

	},

	distanceTo: function ( v ) {

		return Math.sqrt( this.distanceToSquared( v ) );

	},

	distanceToSquared: function ( v ) {

		var dx = this.x - v.x, dy = this.y - v.y;
		return dx * dx + dy * dy;

	},

	setLength: function ( l ) {

		var oldLength = this.length();

		if ( oldLength !== 0 && l !== oldLength ) {

			this.multiplyScalar( l / oldLength );
		}

		return this;

	},

	lerp: function ( v, alpha ) {

		this.x += ( v.x - this.x ) * alpha;
		this.y += ( v.y - this.y ) * alpha;

		return this;

	},

	equals: function ( v ) {

		return ( ( v.x === this.x ) && ( v.y === this.y ) );

	},

	fromArray: function ( array, offset ) {

		if ( offset === undefined ) offset = 0;

		this.x = array[ offset ];
		this.y = array[ offset + 1 ];

		return this;

	},

	toArray: function ( array, offset ) {

		if ( array === undefined ) array = [];
		if ( offset === undefined ) offset = 0;

		array[ offset ] = this.x;
		array[ offset + 1 ] = this.y;

		return array;

	},

	fromAttribute: function ( attribute, index, offset ) {

	    if ( offset === undefined ) offset = 0;

	    index = index * attribute.itemSize + offset;

	    this.x = attribute.array[ index ];
	    this.y = attribute.array[ index + 1 ];

	    return this;

	},

	clone: function () {

		return new THREEMATHS.Vector2( this.x, this.y );

	}

};

// File:src/math/Vector3.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author *kile / http://kile.stravaganza.org/
 * @author philogb / http://blog.thejit.org/
 * @author mikael emtinger / http://gomo.se/
 * @author egraether / http://egraether.com/
 * @author WestLangley / http://github.com/WestLangley
 */

THREEMATHS.Vector3 = function ( x, y, z ) {

	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;

};

THREEMATHS.Vector3.prototype = {

	constructor: THREEMATHS.Vector3,

	set: function ( x, y, z ) {

		this.x = x;
		this.y = y;
		this.z = z;

		return this;

	},

	setX: function ( x ) {

		this.x = x;

		return this;

	},

	setY: function ( y ) {

		this.y = y;

		return this;

	},

	setZ: function ( z ) {

		this.z = z;

		return this;

	},

	setComponent: function ( index, value ) {

		switch ( index ) {

			case 0: this.x = value; break;
			case 1: this.y = value; break;
			case 2: this.z = value; break;
			default: throw new Error( 'index is out of range: ' + index );

		}

	},

	getComponent: function ( index ) {

		switch ( index ) {

			case 0: return this.x;
			case 1: return this.y;
			case 2: return this.z;
			default: throw new Error( 'index is out of range: ' + index );

		}

	},

	copy: function ( v ) {

		this.x = v.x;
		this.y = v.y;
		this.z = v.z;

		return this;

	},

	add: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREEMATHS.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
			return this.addVectors( v, w );

		}

		this.x += v.x;
		this.y += v.y;
		this.z += v.z;

		return this;

	},

	addScalar: function ( s ) {

		this.x += s;
		this.y += s;
		this.z += s;

		return this;

	},

	addVectors: function ( a, b ) {

		this.x = a.x + b.x;
		this.y = a.y + b.y;
		this.z = a.z + b.z;

		return this;

	},

	sub: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREEMATHS.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
			return this.subVectors( v, w );

		}

		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;

		return this;

	},

	subVectors: function ( a, b ) {

		this.x = a.x - b.x;
		this.y = a.y - b.y;
		this.z = a.z - b.z;

		return this;

	},

	multiply: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREEMATHS.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.' );
			return this.multiplyVectors( v, w );

		}

		this.x *= v.x;
		this.y *= v.y;
		this.z *= v.z;

		return this;

	},

	multiplyScalar: function ( scalar ) {

		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;

		return this;

	},

	multiplyVectors: function ( a, b ) {

		this.x = a.x * b.x;
		this.y = a.y * b.y;
		this.z = a.z * b.z;

		return this;

	},

	applyEuler: function () {

		var quaternion;

		return function ( euler ) {

			if ( euler instanceof THREEMATHS.Euler === false ) {

				console.error( 'THREEMATHS.Vector3: .applyEuler() now expects a Euler rotation rather than a Vector3 and order.' );

			}

			if ( quaternion === undefined ) quaternion = new THREEMATHS.Quaternion();

			this.applyQuaternion( quaternion.setFromEuler( euler ) );

			return this;

		};

	}(),

	applyAxisAngle: function () {

		var quaternion;

		return function ( axis, angle ) {

			if ( quaternion === undefined ) quaternion = new THREEMATHS.Quaternion();

			this.applyQuaternion( quaternion.setFromAxisAngle( axis, angle ) );

			return this;

		};

	}(),

	applyMatrix3: function ( m ) {

		var x = this.x;
		var y = this.y;
		var z = this.z;

		var e = m.elements;

		this.x = e[ 0 ] * x + e[ 3 ] * y + e[ 6 ] * z;
		this.y = e[ 1 ] * x + e[ 4 ] * y + e[ 7 ] * z;
		this.z = e[ 2 ] * x + e[ 5 ] * y + e[ 8 ] * z;

		return this;

	},

	applyMatrix4: function ( m ) {

		// input: THREEMATHS.Matrix4 affine matrix

		var x = this.x, y = this.y, z = this.z;

		var e = m.elements;

		this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ]  * z + e[ 12 ];
		this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ]  * z + e[ 13 ];
		this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ];

		return this;

	},

	applyProjection: function ( m ) {

		// input: THREEMATHS.Matrix4 projection matrix

		var x = this.x, y = this.y, z = this.z;

		var e = m.elements;
		var d = 1 / ( e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] ); // perspective divide

		this.x = ( e[ 0 ] * x + e[ 4 ] * y + e[ 8 ]  * z + e[ 12 ] ) * d;
		this.y = ( e[ 1 ] * x + e[ 5 ] * y + e[ 9 ]  * z + e[ 13 ] ) * d;
		this.z = ( e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] ) * d;

		return this;

	},

	applyQuaternion: function ( q ) {

		var x = this.x;
		var y = this.y;
		var z = this.z;

		var qx = q.x;
		var qy = q.y;
		var qz = q.z;
		var qw = q.w;

		// calculate quat * vector

		var ix =  qw * x + qy * z - qz * y;
		var iy =  qw * y + qz * x - qx * z;
		var iz =  qw * z + qx * y - qy * x;
		var iw = - qx * x - qy * y - qz * z;

		// calculate result * inverse quat

		this.x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
		this.y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
		this.z = iz * qw + iw * - qz + ix * - qy - iy * - qx;

		return this;

	},

	project: function () {

		var matrix;

		return function ( camera ) {

			if ( matrix === undefined ) matrix = new THREEMATHS.Matrix4();

			matrix.multiplyMatrices( camera.projectionMatrix, matrix.getInverse( camera.matrixWorld ) );
			return this.applyProjection( matrix );

		};

	}(),

	unproject: function () {

		var matrix;

		return function ( camera ) {

			if ( matrix === undefined ) matrix = new THREEMATHS.Matrix4();

			matrix.multiplyMatrices( camera.matrixWorld, matrix.getInverse( camera.projectionMatrix ) );
			return this.applyProjection( matrix );

		};

	}(),

	transformDirection: function ( m ) {

		// input: THREEMATHS.Matrix4 affine matrix
		// vector interpreted as a direction

		var x = this.x, y = this.y, z = this.z;

		var e = m.elements;

		this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ]  * z;
		this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ]  * z;
		this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z;

		this.normalize();

		return this;

	},

	divide: function ( v ) {

		this.x /= v.x;
		this.y /= v.y;
		this.z /= v.z;

		return this;

	},

	divideScalar: function ( scalar ) {

		if ( scalar !== 0 ) {

			var invScalar = 1 / scalar;

			this.x *= invScalar;
			this.y *= invScalar;
			this.z *= invScalar;

		} else {

			this.x = 0;
			this.y = 0;
			this.z = 0;

		}

		return this;

	},

	min: function ( v ) {

		if ( this.x > v.x ) {

			this.x = v.x;

		}

		if ( this.y > v.y ) {

			this.y = v.y;

		}

		if ( this.z > v.z ) {

			this.z = v.z;

		}

		return this;

	},

	max: function ( v ) {

		if ( this.x < v.x ) {

			this.x = v.x;

		}

		if ( this.y < v.y ) {

			this.y = v.y;

		}

		if ( this.z < v.z ) {

			this.z = v.z;

		}

		return this;

	},

	clamp: function ( min, max ) {

		// This function assumes min < max, if this assumption isn't true it will not operate correctly

		if ( this.x < min.x ) {

			this.x = min.x;

		} else if ( this.x > max.x ) {

			this.x = max.x;

		}

		if ( this.y < min.y ) {

			this.y = min.y;

		} else if ( this.y > max.y ) {

			this.y = max.y;

		}

		if ( this.z < min.z ) {

			this.z = min.z;

		} else if ( this.z > max.z ) {

			this.z = max.z;

		}

		return this;

	},

	clampScalar: ( function () {

		var min, max;

		return function ( minVal, maxVal ) {

			if ( min === undefined ) {

				min = new THREEMATHS.Vector3();
				max = new THREEMATHS.Vector3();

			}

			min.set( minVal, minVal, minVal );
			max.set( maxVal, maxVal, maxVal );

			return this.clamp( min, max );

		};

	} )(),

	floor: function () {

		this.x = Math.floor( this.x );
		this.y = Math.floor( this.y );
		this.z = Math.floor( this.z );

		return this;

	},

	ceil: function () {

		this.x = Math.ceil( this.x );
		this.y = Math.ceil( this.y );
		this.z = Math.ceil( this.z );

		return this;

	},

	round: function () {

		this.x = Math.round( this.x );
		this.y = Math.round( this.y );
		this.z = Math.round( this.z );

		return this;

	},

	roundToZero: function () {

		this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
		this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );
		this.z = ( this.z < 0 ) ? Math.ceil( this.z ) : Math.floor( this.z );

		return this;

	},

	negate: function () {

		this.x = - this.x;
		this.y = - this.y;
		this.z = - this.z;

		return this;

	},

	dot: function ( v ) {

		return this.x * v.x + this.y * v.y + this.z * v.z;

	},

	lengthSq: function () {

		return this.x * this.x + this.y * this.y + this.z * this.z;

	},

	length: function () {

		return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );

	},

	lengthManhattan: function () {

		return Math.abs( this.x ) + Math.abs( this.y ) + Math.abs( this.z );

	},

	normalize: function () {

		return this.divideScalar( this.length() );

	},

	setLength: function ( l ) {

		var oldLength = this.length();

		if ( oldLength !== 0 && l !== oldLength  ) {

			this.multiplyScalar( l / oldLength );
		}

		return this;

	},

	lerp: function ( v, alpha ) {

		this.x += ( v.x - this.x ) * alpha;
		this.y += ( v.y - this.y ) * alpha;
		this.z += ( v.z - this.z ) * alpha;

		return this;

	},

	cross: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREEMATHS.Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.' );
			return this.crossVectors( v, w );

		}

		var x = this.x, y = this.y, z = this.z;

		this.x = y * v.z - z * v.y;
		this.y = z * v.x - x * v.z;
		this.z = x * v.y - y * v.x;

		return this;

	},

	crossVectors: function ( a, b ) {

		var ax = a.x, ay = a.y, az = a.z;
		var bx = b.x, by = b.y, bz = b.z;

		this.x = ay * bz - az * by;
		this.y = az * bx - ax * bz;
		this.z = ax * by - ay * bx;

		return this;

	},

	projectOnVector: function () {

		var v1, dot;

		return function ( vector ) {

			if ( v1 === undefined ) v1 = new THREEMATHS.Vector3();

			v1.copy( vector ).normalize();

			dot = this.dot( v1 );

			return this.copy( v1 ).multiplyScalar( dot );

		};

	}(),

	projectOnPlane: function () {

		var v1;

		return function ( planeNormal ) {

			if ( v1 === undefined ) v1 = new THREEMATHS.Vector3();

			v1.copy( this ).projectOnVector( planeNormal );

			return this.sub( v1 );

		}

	}(),

	reflect: function () {

		// reflect incident vector off plane orthogonal to normal
		// normal is assumed to have unit length

		var v1;

		return function ( normal ) {

			if ( v1 === undefined ) v1 = new THREEMATHS.Vector3();

			return this.sub( v1.copy( normal ).multiplyScalar( 2 * this.dot( normal ) ) );

		}

	}(),

	angleTo: function ( v ) {

		var theta = this.dot( v ) / ( this.length() * v.length() );

		// clamp, to handle numerical problems

		return Math.acos( THREEMATHS.Math.clamp( theta, - 1, 1 ) );

	},

	distanceTo: function ( v ) {

		return Math.sqrt( this.distanceToSquared( v ) );

	},

	distanceToSquared: function ( v ) {

		var dx = this.x - v.x;
		var dy = this.y - v.y;
		var dz = this.z - v.z;

		return dx * dx + dy * dy + dz * dz;

	},

	setEulerFromRotationMatrix: function ( m, order ) {

		console.error( 'THREEMATHS.Vector3: .setEulerFromRotationMatrix() has been removed. Use Euler.setFromRotationMatrix() instead.' );

	},

	setEulerFromQuaternion: function ( q, order ) {

		console.error( 'THREEMATHS.Vector3: .setEulerFromQuaternion() has been removed. Use Euler.setFromQuaternion() instead.' );

	},

	getPositionFromMatrix: function ( m ) {

		console.warn( 'THREEMATHS.Vector3: .getPositionFromMatrix() has been renamed to .setFromMatrixPosition().' );

		return this.setFromMatrixPosition( m );

	},

	getScaleFromMatrix: function ( m ) {

		console.warn( 'THREEMATHS.Vector3: .getScaleFromMatrix() has been renamed to .setFromMatrixScale().' );

		return this.setFromMatrixScale( m );
	},

	getColumnFromMatrix: function ( index, matrix ) {

		console.warn( 'THREEMATHS.Vector3: .getColumnFromMatrix() has been renamed to .setFromMatrixColumn().' );

		return this.setFromMatrixColumn( index, matrix );

	},

	setFromMatrixPosition: function ( m ) {

		this.x = m.elements[ 12 ];
		this.y = m.elements[ 13 ];
		this.z = m.elements[ 14 ];

		return this;

	},

	setFromMatrixScale: function ( m ) {

		var sx = this.set( m.elements[ 0 ], m.elements[ 1 ], m.elements[  2 ] ).length();
		var sy = this.set( m.elements[ 4 ], m.elements[ 5 ], m.elements[  6 ] ).length();
		var sz = this.set( m.elements[ 8 ], m.elements[ 9 ], m.elements[ 10 ] ).length();

		this.x = sx;
		this.y = sy;
		this.z = sz;

		return this;
	},

	setFromMatrixColumn: function ( index, matrix ) {

		var offset = index * 4;

		var me = matrix.elements;

		this.x = me[ offset ];
		this.y = me[ offset + 1 ];
		this.z = me[ offset + 2 ];

		return this;

	},

	equals: function ( v ) {

		return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) );

	},

	fromArray: function ( array, offset ) {

		if ( offset === undefined ) offset = 0;

		this.x = array[ offset ];
		this.y = array[ offset + 1 ];
		this.z = array[ offset + 2 ];

		return this;

	},

	toArray: function ( array, offset ) {

		if ( array === undefined ) array = [];
		if ( offset === undefined ) offset = 0;

		array[ offset ] = this.x;
		array[ offset + 1 ] = this.y;
		array[ offset + 2 ] = this.z;

		return array;

	},

	fromAttribute: function ( attribute, index, offset ) {

	    if ( offset === undefined ) offset = 0;

	    index = index * attribute.itemSize + offset;

	    this.x = attribute.array[ index ];
	    this.y = attribute.array[ index + 1 ];
	    this.z = attribute.array[ index + 2 ];

	    return this;

	},

	clone: function () {

		return new THREEMATHS.Vector3( this.x, this.y, this.z );

	}

};

// File:src/math/Vector4.js

/**
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author philogb / http://blog.thejit.org/
 * @author mikael emtinger / http://gomo.se/
 * @author egraether / http://egraether.com/
 * @author WestLangley / http://github.com/WestLangley
 */

THREEMATHS.Vector4 = function ( x, y, z, w ) {

	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
	this.w = ( w !== undefined ) ? w : 1;

};

THREEMATHS.Vector4.prototype = {

	constructor: THREEMATHS.Vector4,

	set: function ( x, y, z, w ) {

		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;

		return this;

	},

	setX: function ( x ) {

		this.x = x;

		return this;

	},

	setY: function ( y ) {

		this.y = y;

		return this;

	},

	setZ: function ( z ) {

		this.z = z;

		return this;

	},

	setW: function ( w ) {

		this.w = w;

		return this;

	},

	setComponent: function ( index, value ) {

		switch ( index ) {

			case 0: this.x = value; break;
			case 1: this.y = value; break;
			case 2: this.z = value; break;
			case 3: this.w = value; break;
			default: throw new Error( 'index is out of range: ' + index );

		}

	},

	getComponent: function ( index ) {

		switch ( index ) {

			case 0: return this.x;
			case 1: return this.y;
			case 2: return this.z;
			case 3: return this.w;
			default: throw new Error( 'index is out of range: ' + index );

		}

	},

	copy: function ( v ) {

		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
		this.w = ( v.w !== undefined ) ? v.w : 1;

		return this;

	},

	add: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREEMATHS.Vector4: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
			return this.addVectors( v, w );

		}

		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
		this.w += v.w;

		return this;

	},

	addScalar: function ( s ) {

		this.x += s;
		this.y += s;
		this.z += s;
		this.w += s;

		return this;

	},

	addVectors: function ( a, b ) {

		this.x = a.x + b.x;
		this.y = a.y + b.y;
		this.z = a.z + b.z;
		this.w = a.w + b.w;

		return this;

	},

	sub: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREEMATHS.Vector4: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
			return this.subVectors( v, w );

		}

		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
		this.w -= v.w;

		return this;

	},

	subVectors: function ( a, b ) {

		this.x = a.x - b.x;
		this.y = a.y - b.y;
		this.z = a.z - b.z;
		this.w = a.w - b.w;

		return this;

	},

	multiplyScalar: function ( scalar ) {

		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;
		this.w *= scalar;

		return this;

	},

	applyMatrix4: function ( m ) {

		var x = this.x;
		var y = this.y;
		var z = this.z;
		var w = this.w;

		var e = m.elements;

		this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z + e[ 12 ] * w;
		this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z + e[ 13 ] * w;
		this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] * w;
		this.w = e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] * w;

		return this;

	},

	divideScalar: function ( scalar ) {

		if ( scalar !== 0 ) {

			var invScalar = 1 / scalar;

			this.x *= invScalar;
			this.y *= invScalar;
			this.z *= invScalar;
			this.w *= invScalar;

		} else {

			this.x = 0;
			this.y = 0;
			this.z = 0;
			this.w = 1;

		}

		return this;

	},

	setAxisAngleFromQuaternion: function ( q ) {

		// http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/index.htm

		// q is assumed to be normalized

		this.w = 2 * Math.acos( q.w );

		var s = Math.sqrt( 1 - q.w * q.w );

		if ( s < 0.0001 ) {

			 this.x = 1;
			 this.y = 0;
			 this.z = 0;

		} else {

			 this.x = q.x / s;
			 this.y = q.y / s;
			 this.z = q.z / s;

		}

		return this;

	},

	setAxisAngleFromRotationMatrix: function ( m ) {

		// http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToAngle/index.htm

		// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

		var angle, x, y, z,		// variables for result
			epsilon = 0.01,		// margin to allow for rounding errors
			epsilon2 = 0.1,		// margin to distinguish between 0 and 180 degrees

			te = m.elements,

			m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
			m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
			m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ];

		if ( ( Math.abs( m12 - m21 ) < epsilon )
		   && ( Math.abs( m13 - m31 ) < epsilon )
		   && ( Math.abs( m23 - m32 ) < epsilon ) ) {

			// singularity found
			// first check for identity matrix which must have +1 for all terms
			// in leading diagonal and zero in other terms

			if ( ( Math.abs( m12 + m21 ) < epsilon2 )
			   && ( Math.abs( m13 + m31 ) < epsilon2 )
			   && ( Math.abs( m23 + m32 ) < epsilon2 )
			   && ( Math.abs( m11 + m22 + m33 - 3 ) < epsilon2 ) ) {

				// this singularity is identity matrix so angle = 0

				this.set( 1, 0, 0, 0 );

				return this; // zero angle, arbitrary axis

			}

			// otherwise this singularity is angle = 180

			angle = Math.PI;

			var xx = ( m11 + 1 ) / 2;
			var yy = ( m22 + 1 ) / 2;
			var zz = ( m33 + 1 ) / 2;
			var xy = ( m12 + m21 ) / 4;
			var xz = ( m13 + m31 ) / 4;
			var yz = ( m23 + m32 ) / 4;

			if ( ( xx > yy ) && ( xx > zz ) ) { // m11 is the largest diagonal term

				if ( xx < epsilon ) {

					x = 0;
					y = 0.707106781;
					z = 0.707106781;

				} else {

					x = Math.sqrt( xx );
					y = xy / x;
					z = xz / x;

				}

			} else if ( yy > zz ) { // m22 is the largest diagonal term

				if ( yy < epsilon ) {

					x = 0.707106781;
					y = 0;
					z = 0.707106781;

				} else {

					y = Math.sqrt( yy );
					x = xy / y;
					z = yz / y;

				}

			} else { // m33 is the largest diagonal term so base result on this

				if ( zz < epsilon ) {

					x = 0.707106781;
					y = 0.707106781;
					z = 0;

				} else {

					z = Math.sqrt( zz );
					x = xz / z;
					y = yz / z;

				}

			}

			this.set( x, y, z, angle );

			return this; // return 180 deg rotation

		}

		// as we have reached here there are no singularities so we can handle normally

		var s = Math.sqrt( ( m32 - m23 ) * ( m32 - m23 )
						  + ( m13 - m31 ) * ( m13 - m31 )
						  + ( m21 - m12 ) * ( m21 - m12 ) ); // used to normalize

		if ( Math.abs( s ) < 0.001 ) s = 1;

		// prevent divide by zero, should not happen if matrix is orthogonal and should be
		// caught by singularity test above, but I've left it in just in case

		this.x = ( m32 - m23 ) / s;
		this.y = ( m13 - m31 ) / s;
		this.z = ( m21 - m12 ) / s;
		this.w = Math.acos( ( m11 + m22 + m33 - 1 ) / 2 );

		return this;

	},

	min: function ( v ) {

		if ( this.x > v.x ) {

			this.x = v.x;

		}

		if ( this.y > v.y ) {

			this.y = v.y;

		}

		if ( this.z > v.z ) {

			this.z = v.z;

		}

		if ( this.w > v.w ) {

			this.w = v.w;

		}

		return this;

	},

	max: function ( v ) {

		if ( this.x < v.x ) {

			this.x = v.x;

		}

		if ( this.y < v.y ) {

			this.y = v.y;

		}

		if ( this.z < v.z ) {

			this.z = v.z;

		}

		if ( this.w < v.w ) {

			this.w = v.w;

		}

		return this;

	},

	clamp: function ( min, max ) {

		// This function assumes min < max, if this assumption isn't true it will not operate correctly

		if ( this.x < min.x ) {

			this.x = min.x;

		} else if ( this.x > max.x ) {

			this.x = max.x;

		}

		if ( this.y < min.y ) {

			this.y = min.y;

		} else if ( this.y > max.y ) {

			this.y = max.y;

		}

		if ( this.z < min.z ) {

			this.z = min.z;

		} else if ( this.z > max.z ) {

			this.z = max.z;

		}

		if ( this.w < min.w ) {

			this.w = min.w;

		} else if ( this.w > max.w ) {

			this.w = max.w;

		}

		return this;

	},

	clampScalar: ( function () {

		var min, max;

		return function ( minVal, maxVal ) {

			if ( min === undefined ) {

				min = new THREEMATHS.Vector4();
				max = new THREEMATHS.Vector4();

			}

			min.set( minVal, minVal, minVal, minVal );
			max.set( maxVal, maxVal, maxVal, maxVal );

			return this.clamp( min, max );

		};

	} )(),

    floor: function () {

        this.x = Math.floor( this.x );
        this.y = Math.floor( this.y );
        this.z = Math.floor( this.z );
        this.w = Math.floor( this.w );

        return this;

    },

    ceil: function () {

        this.x = Math.ceil( this.x );
        this.y = Math.ceil( this.y );
        this.z = Math.ceil( this.z );
        this.w = Math.ceil( this.w );

        return this;

    },

    round: function () {

        this.x = Math.round( this.x );
        this.y = Math.round( this.y );
        this.z = Math.round( this.z );
        this.w = Math.round( this.w );

        return this;

    },

    roundToZero: function () {

        this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
        this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );
        this.z = ( this.z < 0 ) ? Math.ceil( this.z ) : Math.floor( this.z );
        this.w = ( this.w < 0 ) ? Math.ceil( this.w ) : Math.floor( this.w );

        return this;

    },

	negate: function () {

		this.x = - this.x;
		this.y = - this.y;
		this.z = - this.z;
		this.w = - this.w;

		return this;

	},

	dot: function ( v ) {

		return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;

	},

	lengthSq: function () {

		return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;

	},

	length: function () {

		return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w );

	},

	lengthManhattan: function () {

		return Math.abs( this.x ) + Math.abs( this.y ) + Math.abs( this.z ) + Math.abs( this.w );

	},

	normalize: function () {

		return this.divideScalar( this.length() );

	},

	setLength: function ( l ) {

		var oldLength = this.length();

		if ( oldLength !== 0 && l !== oldLength ) {

			this.multiplyScalar( l / oldLength );

		}

		return this;

	},

	lerp: function ( v, alpha ) {

		this.x += ( v.x - this.x ) * alpha;
		this.y += ( v.y - this.y ) * alpha;
		this.z += ( v.z - this.z ) * alpha;
		this.w += ( v.w - this.w ) * alpha;

		return this;

	},

	equals: function ( v ) {

		return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) && ( v.w === this.w ) );

	},

	fromArray: function ( array, offset ) {

		if ( offset === undefined ) offset = 0;

		this.x = array[ offset ];
		this.y = array[ offset + 1 ];
		this.z = array[ offset + 2 ];
		this.w = array[ offset + 3 ];

		return this;

	},

	toArray: function ( array, offset ) {

		if ( array === undefined ) array = [];
		if ( offset === undefined ) offset = 0;

		array[ offset ] = this.x;
		array[ offset + 1 ] = this.y;
		array[ offset + 2 ] = this.z;
		array[ offset + 3 ] = this.w;

		return array;

	},

	fromAttribute: function ( attribute, index, offset ) {

	    if ( offset === undefined ) offset = 0;

	    index = index * attribute.itemSize + offset;

	    this.x = attribute.array[ index ];
	    this.y = attribute.array[ index + 1 ];
	    this.z = attribute.array[ index + 2 ];
	    this.w = attribute.array[ index + 3 ];

	    return this;

	},

	clone: function () {

		return new THREEMATHS.Vector4( this.x, this.y, this.z, this.w );

	}

};

// File:src/math/Euler.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author bhouston / http://exocortex.com
 */

THREEMATHS.Euler = function ( x, y, z, order ) {

	this._x = x || 0;
	this._y = y || 0;
	this._z = z || 0;
	this._order = order || THREEMATHS.Euler.DefaultOrder;

};

THREEMATHS.Euler.RotationOrders = [ 'XYZ', 'YZX', 'ZXY', 'XZY', 'YXZ', 'ZYX' ];

THREEMATHS.Euler.DefaultOrder = 'XYZ';

THREEMATHS.Euler.prototype = {

	constructor: THREEMATHS.Euler,

	_x: 0, _y: 0, _z: 0, _order: THREEMATHS.Euler.DefaultOrder,

	get x () {

		return this._x;

	},

	set x ( value ) {

		this._x = value;
		/*this.onChangeCallback();*/

	},

	get y () {

		return this._y;

	},

	set y ( value ) {

		this._y = value;
		/*this.onChangeCallback();*/

	},

	get z () {

		return this._z;

	},

	set z ( value ) {

		this._z = value;
		/*this.onChangeCallback();*/

	},

	get order () {

		return this._order;

	},

	set order ( value ) {

		this._order = value;
		/*this.onChangeCallback();*/

	},

	set: function ( x, y, z, order ) {

		this._x = x;
		this._y = y;
		this._z = z;
		this._order = order || this._order;

		/*this.onChangeCallback();*/

		return this;

	},

	copy: function ( euler ) {

		this._x = euler._x;
		this._y = euler._y;
		this._z = euler._z;
		this._order = euler._order;

		/*this.onChangeCallback();*/

		return this;

	},

	setFromRotationMatrix: function ( m, order, update ) {

		var clamp = THREEMATHS.Math.clamp;

		// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

		var te = m.elements;
		var m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ];
		var m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ];
		var m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ];

		order = order || this._order;

		if ( order === 'XYZ' ) {

			this._y = Math.asin( clamp( m13, - 1, 1 ) );

			if ( Math.abs( m13 ) < 0.99999 ) {

				this._x = Math.atan2( - m23, m33 );
				this._z = Math.atan2( - m12, m11 );

			} else {

				this._x = Math.atan2( m32, m22 );
				this._z = 0;

			}

		} else if ( order === 'YXZ' ) {

			this._x = Math.asin( - clamp( m23, - 1, 1 ) );

			if ( Math.abs( m23 ) < 0.99999 ) {

				this._y = Math.atan2( m13, m33 );
				this._z = Math.atan2( m21, m22 );

			} else {

				this._y = Math.atan2( - m31, m11 );
				this._z = 0;

			}

		} else if ( order === 'ZXY' ) {

			this._x = Math.asin( clamp( m32, - 1, 1 ) );

			if ( Math.abs( m32 ) < 0.99999 ) {

				this._y = Math.atan2( - m31, m33 );
				this._z = Math.atan2( - m12, m22 );

			} else {

				this._y = 0;
				this._z = Math.atan2( m21, m11 );

			}

		} else if ( order === 'ZYX' ) {

			this._y = Math.asin( - clamp( m31, - 1, 1 ) );

			if ( Math.abs( m31 ) < 0.99999 ) {

				this._x = Math.atan2( m32, m33 );
				this._z = Math.atan2( m21, m11 );

			} else {

				this._x = 0;
				this._z = Math.atan2( - m12, m22 );

			}

		} else if ( order === 'YZX' ) {

			this._z = Math.asin( clamp( m21, - 1, 1 ) );

			if ( Math.abs( m21 ) < 0.99999 ) {

				this._x = Math.atan2( - m23, m22 );
				this._y = Math.atan2( - m31, m11 );

			} else {

				this._x = 0;
				this._y = Math.atan2( m13, m33 );

			}

		} else if ( order === 'XZY' ) {

			this._z = Math.asin( - clamp( m12, - 1, 1 ) );

			if ( Math.abs( m12 ) < 0.99999 ) {

				this._x = Math.atan2( m32, m22 );
				this._y = Math.atan2( m13, m11 );

			} else {

				this._x = Math.atan2( - m23, m33 );
				this._y = 0;

			}

		} else {

			console.warn( 'THREEMATHS.Euler: .setFromRotationMatrix() given unsupported order: ' + order )

		}

		this._order = order;

		/*if ( update !== false ) this.onChangeCallback();*/

		return this;

	},

	setFromQuaternion: function () {

		var matrix;

		return function ( q, order, update ) {

			if ( matrix === undefined ) matrix = new THREEMATHS.Matrix4();
			matrix.makeRotationFromQuaternion( q );
			this.setFromRotationMatrix( matrix, order, update );

			return this;

		};

	}(),

	setFromVector3: function ( v, order ) {

		return this.set( v.x, v.y, v.z, order || this._order );

	},

	reorder: function () {

		// WARNING: this discards revolution information -bhouston

		var q = new THREEMATHS.Quaternion();

		return function ( newOrder ) {

			q.setFromEuler( this );
			this.setFromQuaternion( q, newOrder );

		};

	}(),

	equals: function ( euler ) {

		return ( euler._x === this._x ) && ( euler._y === this._y ) && ( euler._z === this._z ) && ( euler._order === this._order );

	},

	fromArray: function ( array ) {

		this._x = array[ 0 ];
		this._y = array[ 1 ];
		this._z = array[ 2 ];
		if ( array[ 3 ] !== undefined ) this._order = array[ 3 ];

		/*this.onChangeCallback();*/

		return this;

	},

	toArray: function () {

		return [ this._x, this._y, this._z, this._order ];

	},

	toVector3: function ( optionalResult ) {

		if ( optionalResult ) {

			return optionalResult.set( this._x, this._y, this._z );

		} else {

			return new THREEMATHS.Vector3( this._x, this._y, this._z );

		}

	},

	onChange: function ( callback ) {

		this.onChangeCallback = callback;

		return this;

	},

	onChangeCallback: function () {},

	clone: function () {

		return new THREEMATHS.Euler( this._x, this._y, this._z, this._order );

	}

};

// File:src/math/Matrix3.js

/**
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author bhouston / http://exocortex.com
 */

THREEMATHS.Matrix3 = function () {

	this.elements = new Float32Array( [

		1, 0, 0,
		0, 1, 0,
		0, 0, 1

	] );

	if ( arguments.length > 0 ) {

		console.error( 'THREEMATHS.Matrix3: the constructor no longer reads arguments. use .set() instead.' );

	}

};

THREEMATHS.Matrix3.prototype = {

	constructor: THREEMATHS.Matrix3,

	set: function ( n11, n12, n13, n21, n22, n23, n31, n32, n33 ) {

		var te = this.elements;

		te[ 0 ] = n11; te[ 3 ] = n12; te[ 6 ] = n13;
		te[ 1 ] = n21; te[ 4 ] = n22; te[ 7 ] = n23;
		te[ 2 ] = n31; te[ 5 ] = n32; te[ 8 ] = n33;

		return this;

	},

	identity: function () {

		this.set(

			1, 0, 0,
			0, 1, 0,
			0, 0, 1

		);

		return this;

	},

	copy: function ( m ) {

		var me = m.elements;

		this.set(

			me[ 0 ], me[ 3 ], me[ 6 ],
			me[ 1 ], me[ 4 ], me[ 7 ],
			me[ 2 ], me[ 5 ], me[ 8 ]

		);

		return this;

	},

	multiplyVector3: function ( vector ) {

		console.warn( 'THREEMATHS.Matrix3: .multiplyVector3() has been removed. Use vector.applyMatrix3( matrix ) instead.' );
		return vector.applyMatrix3( this );

	},

	multiplyVector3Array: function ( a ) {

		console.warn( 'THREEMATHS.Matrix3: .multiplyVector3Array() has been renamed. Use matrix.applyToVector3Array( array ) instead.' );
		return this.applyToVector3Array( a );

	},

	applyToVector3Array: function () {

		var v1 = new THREEMATHS.Vector3();

		return function ( array, offset, length ) {

			if ( offset === undefined ) offset = 0;
			if ( length === undefined ) length = array.length;

			for ( var i = 0, j = offset, il; i < length; i += 3, j += 3 ) {

				v1.x = array[ j ];
				v1.y = array[ j + 1 ];
				v1.z = array[ j + 2 ];

				v1.applyMatrix3( this );

				array[ j ]     = v1.x;
				array[ j + 1 ] = v1.y;
				array[ j + 2 ] = v1.z;

			}

			return array;

		};

	}(),

	multiplyScalar: function ( s ) {

		var te = this.elements;

		te[ 0 ] *= s; te[ 3 ] *= s; te[ 6 ] *= s;
		te[ 1 ] *= s; te[ 4 ] *= s; te[ 7 ] *= s;
		te[ 2 ] *= s; te[ 5 ] *= s; te[ 8 ] *= s;

		return this;

	},

	determinant: function () {

		var te = this.elements;

		var a = te[ 0 ], b = te[ 1 ], c = te[ 2 ],
			d = te[ 3 ], e = te[ 4 ], f = te[ 5 ],
			g = te[ 6 ], h = te[ 7 ], i = te[ 8 ];

		return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;

	},

	getInverse: function ( matrix, throwOnInvertible ) {

		// input: THREEMATHS.Matrix4
		// ( based on http://code.google.com/p/webgl-mjs/ )

		var me = matrix.elements;
		var te = this.elements;

		te[ 0 ] =   me[ 10 ] * me[ 5 ] - me[ 6 ] * me[ 9 ];
		te[ 1 ] = - me[ 10 ] * me[ 1 ] + me[ 2 ] * me[ 9 ];
		te[ 2 ] =   me[ 6 ] * me[ 1 ] - me[ 2 ] * me[ 5 ];
		te[ 3 ] = - me[ 10 ] * me[ 4 ] + me[ 6 ] * me[ 8 ];
		te[ 4 ] =   me[ 10 ] * me[ 0 ] - me[ 2 ] * me[ 8 ];
		te[ 5 ] = - me[ 6 ] * me[ 0 ] + me[ 2 ] * me[ 4 ];
		te[ 6 ] =   me[ 9 ] * me[ 4 ] - me[ 5 ] * me[ 8 ];
		te[ 7 ] = - me[ 9 ] * me[ 0 ] + me[ 1 ] * me[ 8 ];
		te[ 8 ] =   me[ 5 ] * me[ 0 ] - me[ 1 ] * me[ 4 ];

		var det = me[ 0 ] * te[ 0 ] + me[ 1 ] * te[ 3 ] + me[ 2 ] * te[ 6 ];

		// no inverse

		if ( det === 0 ) {

			var msg = "Matrix3.getInverse(): can't invert matrix, determinant is 0";

			if ( throwOnInvertible || false ) {

				throw new Error( msg );

			} else {

				console.warn( msg );

			}

			this.identity();

			return this;

		}

		this.multiplyScalar( 1.0 / det );

		return this;

	},

	transpose: function () {

		var tmp, m = this.elements;

		tmp = m[ 1 ]; m[ 1 ] = m[ 3 ]; m[ 3 ] = tmp;
		tmp = m[ 2 ]; m[ 2 ] = m[ 6 ]; m[ 6 ] = tmp;
		tmp = m[ 5 ]; m[ 5 ] = m[ 7 ]; m[ 7 ] = tmp;

		return this;

	},

	flattenToArrayOffset: function ( array, offset ) {

		var te = this.elements;

		array[ offset     ] = te[ 0 ];
		array[ offset + 1 ] = te[ 1 ];
		array[ offset + 2 ] = te[ 2 ];

		array[ offset + 3 ] = te[ 3 ];
		array[ offset + 4 ] = te[ 4 ];
		array[ offset + 5 ] = te[ 5 ];

		array[ offset + 6 ] = te[ 6 ];
		array[ offset + 7 ] = te[ 7 ];
		array[ offset + 8 ]  = te[ 8 ];

		return array;

	},

	getNormalMatrix: function ( m ) {

		// input: THREEMATHS.Matrix4

		this.getInverse( m ).transpose();

		return this;

	},

	transposeIntoArray: function ( r ) {

		var m = this.elements;

		r[ 0 ] = m[ 0 ];
		r[ 1 ] = m[ 3 ];
		r[ 2 ] = m[ 6 ];
		r[ 3 ] = m[ 1 ];
		r[ 4 ] = m[ 4 ];
		r[ 5 ] = m[ 7 ];
		r[ 6 ] = m[ 2 ];
		r[ 7 ] = m[ 5 ];
		r[ 8 ] = m[ 8 ];

		return this;

	},

	fromArray: function ( array ) {

		this.elements.set( array );

		return this;

	},

	toArray: function () {

		var te = this.elements;

		return [
			te[ 0 ], te[ 1 ], te[ 2 ],
			te[ 3 ], te[ 4 ], te[ 5 ],
			te[ 6 ], te[ 7 ], te[ 8 ]
		];

	},

	clone: function () {

		return new THREEMATHS.Matrix3().fromArray( this.elements );

	}

};

// File:src/math/Matrix4.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author philogb / http://blog.thejit.org/
 * @author jordi_ros / http://plattsoft.com
 * @author D1plo1d / http://github.com/D1plo1d
 * @author alteredq / http://alteredqualia.com/
 * @author mikael emtinger / http://gomo.se/
 * @author timknip / http://www.floorplanner.com/
 * @author bhouston / http://exocortex.com
 * @author WestLangley / http://github.com/WestLangley
 */

THREEMATHS.Matrix4 = function () {

	this.elements = new Float32Array( [

		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1

	] );

	if ( arguments.length > 0 ) {

		console.error( 'THREEMATHS.Matrix4: the constructor no longer reads arguments. use .set() instead.' );

	}

};

THREEMATHS.Matrix4.prototype = {

	constructor: THREEMATHS.Matrix4,

	set: function ( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 ) {

		var te = this.elements;

		te[ 0 ] = n11; te[ 4 ] = n12; te[ 8 ] = n13; te[ 12 ] = n14;
		te[ 1 ] = n21; te[ 5 ] = n22; te[ 9 ] = n23; te[ 13 ] = n24;
		te[ 2 ] = n31; te[ 6 ] = n32; te[ 10 ] = n33; te[ 14 ] = n34;
		te[ 3 ] = n41; te[ 7 ] = n42; te[ 11 ] = n43; te[ 15 ] = n44;

		return this;

	},

	identity: function () {

		this.set(

			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1

		);

		return this;

	},

	copy: function ( m ) {

		this.elements.set( m.elements );

		return this;

	},

	extractPosition: function ( m ) {

		console.warn( 'THREEMATHS.Matrix4: .extractPosition() has been renamed to .copyPosition().' );
		return this.copyPosition( m );

	},

	copyPosition: function ( m ) {

		var te = this.elements;
		var me = m.elements;

		te[ 12 ] = me[ 12 ];
		te[ 13 ] = me[ 13 ];
		te[ 14 ] = me[ 14 ];

		return this;

	},

	extractBasis: function ( xAxis, yAxis, zAxis ) {

		var te = this.elements;

		xAxis.set( te[ 0 ], te[ 1 ], te[ 2 ] );
		yAxis.set( te[ 4 ], te[ 5 ], te[ 6 ] );
		zAxis.set( te[ 8 ], te[ 9 ], te[ 10 ] );

		return this;

	},

	makeBasis: function ( xAxis, yAxis, zAxis ) {

		this.set(
			xAxis.x, yAxis.x, zAxis.x, 0,
			xAxis.y, yAxis.y, zAxis.y, 0,
			xAxis.z, yAxis.z, zAxis.z, 0,
			0,       0,       0,       1
		);

	    return this;

	},

	extractRotation: function () {

		var v1 = new THREEMATHS.Vector3();

		return function ( m ) {

			var te = this.elements;
			var me = m.elements;

			var scaleX = 1 / v1.set( me[ 0 ], me[ 1 ], me[ 2 ] ).length();
			var scaleY = 1 / v1.set( me[ 4 ], me[ 5 ], me[ 6 ] ).length();
			var scaleZ = 1 / v1.set( me[ 8 ], me[ 9 ], me[ 10 ] ).length();

			te[ 0 ] = me[ 0 ] * scaleX;
			te[ 1 ] = me[ 1 ] * scaleX;
			te[ 2 ] = me[ 2 ] * scaleX;

			te[ 4 ] = me[ 4 ] * scaleY;
			te[ 5 ] = me[ 5 ] * scaleY;
			te[ 6 ] = me[ 6 ] * scaleY;

			te[ 8 ] = me[ 8 ] * scaleZ;
			te[ 9 ] = me[ 9 ] * scaleZ;
			te[ 10 ] = me[ 10 ] * scaleZ;

			return this;

		};

	}(),

	makeRotationFromEuler: function ( euler ) {

		if ( euler instanceof THREEMATHS.Euler === false ) {

			console.error( 'THREEMATHS.Matrix: .makeRotationFromEuler() now expects a Euler rotation rather than a Vector3 and order.' );

		}

		var te = this.elements;

		var x = euler.x, y = euler.y, z = euler.z;
		var a = Math.cos( x ), b = Math.sin( x );
		var c = Math.cos( y ), d = Math.sin( y );
		var e = Math.cos( z ), f = Math.sin( z );

		if ( euler.order === 'XYZ' ) {

			var ae = a * e, af = a * f, be = b * e, bf = b * f;

			te[ 0 ] = c * e;
			te[ 4 ] = - c * f;
			te[ 8 ] = d;

			te[ 1 ] = af + be * d;
			te[ 5 ] = ae - bf * d;
			te[ 9 ] = - b * c;

			te[ 2 ] = bf - ae * d;
			te[ 6 ] = be + af * d;
			te[ 10 ] = a * c;

		} else if ( euler.order === 'YXZ' ) {

			var ce = c * e, cf = c * f, de = d * e, df = d * f;

			te[ 0 ] = ce + df * b;
			te[ 4 ] = de * b - cf;
			te[ 8 ] = a * d;

			te[ 1 ] = a * f;
			te[ 5 ] = a * e;
			te[ 9 ] = - b;

			te[ 2 ] = cf * b - de;
			te[ 6 ] = df + ce * b;
			te[ 10 ] = a * c;

		} else if ( euler.order === 'ZXY' ) {

			var ce = c * e, cf = c * f, de = d * e, df = d * f;

			te[ 0 ] = ce - df * b;
			te[ 4 ] = - a * f;
			te[ 8 ] = de + cf * b;

			te[ 1 ] = cf + de * b;
			te[ 5 ] = a * e;
			te[ 9 ] = df - ce * b;

			te[ 2 ] = - a * d;
			te[ 6 ] = b;
			te[ 10 ] = a * c;

		} else if ( euler.order === 'ZYX' ) {

			var ae = a * e, af = a * f, be = b * e, bf = b * f;

			te[ 0 ] = c * e;
			te[ 4 ] = be * d - af;
			te[ 8 ] = ae * d + bf;

			te[ 1 ] = c * f;
			te[ 5 ] = bf * d + ae;
			te[ 9 ] = af * d - be;

			te[ 2 ] = - d;
			te[ 6 ] = b * c;
			te[ 10 ] = a * c;

		} else if ( euler.order === 'YZX' ) {

			var ac = a * c, ad = a * d, bc = b * c, bd = b * d;

			te[ 0 ] = c * e;
			te[ 4 ] = bd - ac * f;
			te[ 8 ] = bc * f + ad;

			te[ 1 ] = f;
			te[ 5 ] = a * e;
			te[ 9 ] = - b * e;

			te[ 2 ] = - d * e;
			te[ 6 ] = ad * f + bc;
			te[ 10 ] = ac - bd * f;

		} else if ( euler.order === 'XZY' ) {

			var ac = a * c, ad = a * d, bc = b * c, bd = b * d;

			te[ 0 ] = c * e;
			te[ 4 ] = - f;
			te[ 8 ] = d * e;

			te[ 1 ] = ac * f + bd;
			te[ 5 ] = a * e;
			te[ 9 ] = ad * f - bc;

			te[ 2 ] = bc * f - ad;
			te[ 6 ] = b * e;
			te[ 10 ] = bd * f + ac;

		}

		// last column
		te[ 3 ] = 0;
		te[ 7 ] = 0;
		te[ 11 ] = 0;

		// bottom row
		te[ 12 ] = 0;
		te[ 13 ] = 0;
		te[ 14 ] = 0;
		te[ 15 ] = 1;

		return this;

	},

	setRotationFromQuaternion: function ( q ) {

		console.warn( 'THREEMATHS.Matrix4: .setRotationFromQuaternion() has been renamed to .makeRotationFromQuaternion().' );

		return this.makeRotationFromQuaternion( q );

	},

	makeRotationFromQuaternion: function ( q ) {

		var te = this.elements;

		var x = q.x, y = q.y, z = q.z, w = q.w;
		var x2 = x + x, y2 = y + y, z2 = z + z;
		var xx = x * x2, xy = x * y2, xz = x * z2;
		var yy = y * y2, yz = y * z2, zz = z * z2;
		var wx = w * x2, wy = w * y2, wz = w * z2;

		te[ 0 ] = 1 - ( yy + zz );
		te[ 4 ] = xy - wz;
		te[ 8 ] = xz + wy;

		te[ 1 ] = xy + wz;
		te[ 5 ] = 1 - ( xx + zz );
		te[ 9 ] = yz - wx;

		te[ 2 ] = xz - wy;
		te[ 6 ] = yz + wx;
		te[ 10 ] = 1 - ( xx + yy );

		// last column
		te[ 3 ] = 0;
		te[ 7 ] = 0;
		te[ 11 ] = 0;

		// bottom row
		te[ 12 ] = 0;
		te[ 13 ] = 0;
		te[ 14 ] = 0;
		te[ 15 ] = 1;

		return this;

	},

	lookAt: function () {

		var x = new THREEMATHS.Vector3();
		var y = new THREEMATHS.Vector3();
		var z = new THREEMATHS.Vector3();

		return function ( eye, target, up ) {

			var te = this.elements;

			z.subVectors( eye, target ).normalize();

			if ( z.length() === 0 ) {

				z.z = 1;

			}

			x.crossVectors( up, z ).normalize();

			if ( x.length() === 0 ) {

				z.x += 0.0001;
				x.crossVectors( up, z ).normalize();

			}

			y.crossVectors( z, x );


			te[ 0 ] = x.x; te[ 4 ] = y.x; te[ 8 ] = z.x;
			te[ 1 ] = x.y; te[ 5 ] = y.y; te[ 9 ] = z.y;
			te[ 2 ] = x.z; te[ 6 ] = y.z; te[ 10 ] = z.z;

			return this;

		};

	}(),

	multiply: function ( m, n ) {

		if ( n !== undefined ) {

			console.warn( 'THREEMATHS.Matrix4: .multiply() now only accepts one argument. Use .multiplyMatrices( a, b ) instead.' );
			return this.multiplyMatrices( m, n );

		}

		return this.multiplyMatrices( this, m );

	},

	multiplyMatrices: function ( a, b ) {

		var ae = a.elements;
		var be = b.elements;
		var te = this.elements;

		var a11 = ae[ 0 ], a12 = ae[ 4 ], a13 = ae[ 8 ], a14 = ae[ 12 ];
		var a21 = ae[ 1 ], a22 = ae[ 5 ], a23 = ae[ 9 ], a24 = ae[ 13 ];
		var a31 = ae[ 2 ], a32 = ae[ 6 ], a33 = ae[ 10 ], a34 = ae[ 14 ];
		var a41 = ae[ 3 ], a42 = ae[ 7 ], a43 = ae[ 11 ], a44 = ae[ 15 ];

		var b11 = be[ 0 ], b12 = be[ 4 ], b13 = be[ 8 ], b14 = be[ 12 ];
		var b21 = be[ 1 ], b22 = be[ 5 ], b23 = be[ 9 ], b24 = be[ 13 ];
		var b31 = be[ 2 ], b32 = be[ 6 ], b33 = be[ 10 ], b34 = be[ 14 ];
		var b41 = be[ 3 ], b42 = be[ 7 ], b43 = be[ 11 ], b44 = be[ 15 ];

		te[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
		te[ 4 ] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
		te[ 8 ] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
		te[ 12 ] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

		te[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
		te[ 5 ] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
		te[ 9 ] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
		te[ 13 ] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

		te[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
		te[ 6 ] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
		te[ 10 ] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
		te[ 14 ] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

		te[ 3 ] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
		te[ 7 ] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
		te[ 11 ] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
		te[ 15 ] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

		return this;

	},

	multiplyToArray: function ( a, b, r ) {

		var te = this.elements;

		this.multiplyMatrices( a, b );

		r[ 0 ] = te[ 0 ]; r[ 1 ] = te[ 1 ]; r[ 2 ] = te[ 2 ]; r[ 3 ] = te[ 3 ];
		r[ 4 ] = te[ 4 ]; r[ 5 ] = te[ 5 ]; r[ 6 ] = te[ 6 ]; r[ 7 ] = te[ 7 ];
		r[ 8 ]  = te[ 8 ]; r[ 9 ]  = te[ 9 ]; r[ 10 ] = te[ 10 ]; r[ 11 ] = te[ 11 ];
		r[ 12 ] = te[ 12 ]; r[ 13 ] = te[ 13 ]; r[ 14 ] = te[ 14 ]; r[ 15 ] = te[ 15 ];

		return this;

	},

	multiplyScalar: function ( s ) {

		var te = this.elements;

		te[ 0 ] *= s; te[ 4 ] *= s; te[ 8 ] *= s; te[ 12 ] *= s;
		te[ 1 ] *= s; te[ 5 ] *= s; te[ 9 ] *= s; te[ 13 ] *= s;
		te[ 2 ] *= s; te[ 6 ] *= s; te[ 10 ] *= s; te[ 14 ] *= s;
		te[ 3 ] *= s; te[ 7 ] *= s; te[ 11 ] *= s; te[ 15 ] *= s;

		return this;

	},

	multiplyVector3: function ( vector ) {

		console.warn( 'THREEMATHS.Matrix4: .multiplyVector3() has been removed. Use vector.applyMatrix4( matrix ) or vector.applyProjection( matrix ) instead.' );
		return vector.applyProjection( this );

	},

	multiplyVector4: function ( vector ) {

		console.warn( 'THREEMATHS.Matrix4: .multiplyVector4() has been removed. Use vector.applyMatrix4( matrix ) instead.' );
		return vector.applyMatrix4( this );

	},

	multiplyVector3Array: function ( a ) {

		console.warn( 'THREEMATHS.Matrix4: .multiplyVector3Array() has been renamed. Use matrix.applyToVector3Array( array ) instead.' );
		return this.applyToVector3Array( a );

	},

	applyToVector3Array: function () {

		var v1 = new THREEMATHS.Vector3();

		return function ( array, offset, length ) {

			if ( offset === undefined ) offset = 0;
			if ( length === undefined ) length = array.length;

			for ( var i = 0, j = offset, il; i < length; i += 3, j += 3 ) {

				v1.x = array[ j ];
				v1.y = array[ j + 1 ];
				v1.z = array[ j + 2 ];

				v1.applyMatrix4( this );

				array[ j ]     = v1.x;
				array[ j + 1 ] = v1.y;
				array[ j + 2 ] = v1.z;

			}

			return array;

		};

	}(),

	rotateAxis: function ( v ) {

		console.warn( 'THREEMATHS.Matrix4: .rotateAxis() has been removed. Use Vector3.transformDirection( matrix ) instead.' );

		v.transformDirection( this );

	},

	crossVector: function ( vector ) {

		console.warn( 'THREEMATHS.Matrix4: .crossVector() has been removed. Use vector.applyMatrix4( matrix ) instead.' );
		return vector.applyMatrix4( this );

	},

	determinant: function () {

		var te = this.elements;

		var n11 = te[ 0 ], n12 = te[ 4 ], n13 = te[ 8 ], n14 = te[ 12 ];
		var n21 = te[ 1 ], n22 = te[ 5 ], n23 = te[ 9 ], n24 = te[ 13 ];
		var n31 = te[ 2 ], n32 = te[ 6 ], n33 = te[ 10 ], n34 = te[ 14 ];
		var n41 = te[ 3 ], n42 = te[ 7 ], n43 = te[ 11 ], n44 = te[ 15 ];

		//TODO: make this more efficient
		//( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )

		return (
			n41 * (
				+ n14 * n23 * n32
				 - n13 * n24 * n32
				 - n14 * n22 * n33
				 + n12 * n24 * n33
				 + n13 * n22 * n34
				 - n12 * n23 * n34
			) +
			n42 * (
				+ n11 * n23 * n34
				 - n11 * n24 * n33
				 + n14 * n21 * n33
				 - n13 * n21 * n34
				 + n13 * n24 * n31
				 - n14 * n23 * n31
			) +
			n43 * (
				+ n11 * n24 * n32
				 - n11 * n22 * n34
				 - n14 * n21 * n32
				 + n12 * n21 * n34
				 + n14 * n22 * n31
				 - n12 * n24 * n31
			) +
			n44 * (
				- n13 * n22 * n31
				 - n11 * n23 * n32
				 + n11 * n22 * n33
				 + n13 * n21 * n32
				 - n12 * n21 * n33
				 + n12 * n23 * n31
			)

		);

	},

	transpose: function () {

		var te = this.elements;
		var tmp;

		tmp = te[ 1 ]; te[ 1 ] = te[ 4 ]; te[ 4 ] = tmp;
		tmp = te[ 2 ]; te[ 2 ] = te[ 8 ]; te[ 8 ] = tmp;
		tmp = te[ 6 ]; te[ 6 ] = te[ 9 ]; te[ 9 ] = tmp;

		tmp = te[ 3 ]; te[ 3 ] = te[ 12 ]; te[ 12 ] = tmp;
		tmp = te[ 7 ]; te[ 7 ] = te[ 13 ]; te[ 13 ] = tmp;
		tmp = te[ 11 ]; te[ 11 ] = te[ 14 ]; te[ 14 ] = tmp;

		return this;

	},

	flattenToArrayOffset: function ( array, offset ) {

		var te = this.elements;

		array[ offset     ] = te[ 0 ];
		array[ offset + 1 ] = te[ 1 ];
		array[ offset + 2 ] = te[ 2 ];
		array[ offset + 3 ] = te[ 3 ];

		array[ offset + 4 ] = te[ 4 ];
		array[ offset + 5 ] = te[ 5 ];
		array[ offset + 6 ] = te[ 6 ];
		array[ offset + 7 ] = te[ 7 ];

		array[ offset + 8 ]  = te[ 8 ];
		array[ offset + 9 ]  = te[ 9 ];
		array[ offset + 10 ] = te[ 10 ];
		array[ offset + 11 ] = te[ 11 ];

		array[ offset + 12 ] = te[ 12 ];
		array[ offset + 13 ] = te[ 13 ];
		array[ offset + 14 ] = te[ 14 ];
		array[ offset + 15 ] = te[ 15 ];

		return array;

	},

	getPosition: function () {

		var v1 = new THREEMATHS.Vector3();

		return function () {

			console.warn( 'THREEMATHS.Matrix4: .getPosition() has been removed. Use Vector3.setFromMatrixPosition( matrix ) instead.' );

			var te = this.elements;
			return v1.set( te[ 12 ], te[ 13 ], te[ 14 ] );

		};

	}(),

	setPosition: function ( v ) {

		var te = this.elements;

		te[ 12 ] = v.x;
		te[ 13 ] = v.y;
		te[ 14 ] = v.z;

		return this;

	},

	getInverse: function ( m, throwOnInvertible ) {

		// based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
		var te = this.elements;
		var me = m.elements;

		var n11 = me[ 0 ], n12 = me[ 4 ], n13 = me[ 8 ], n14 = me[ 12 ];
		var n21 = me[ 1 ], n22 = me[ 5 ], n23 = me[ 9 ], n24 = me[ 13 ];
		var n31 = me[ 2 ], n32 = me[ 6 ], n33 = me[ 10 ], n34 = me[ 14 ];
		var n41 = me[ 3 ], n42 = me[ 7 ], n43 = me[ 11 ], n44 = me[ 15 ];

		te[ 0 ] = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
		te[ 4 ] = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
		te[ 8 ] = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
		te[ 12 ] = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
		te[ 1 ] = n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44;
		te[ 5 ] = n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44;
		te[ 9 ] = n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44;
		te[ 13 ] = n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34;
		te[ 2 ] = n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44;
		te[ 6 ] = n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44;
		te[ 10 ] = n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44;
		te[ 14 ] = n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34;
		te[ 3 ] = n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43;
		te[ 7 ] = n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43;
		te[ 11 ] = n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43;
		te[ 15 ] = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;

		var det = n11 * te[ 0 ] + n21 * te[ 4 ] + n31 * te[ 8 ] + n41 * te[ 12 ];

		if ( det == 0 ) {

			var msg = "Matrix4.getInverse(): can't invert matrix, determinant is 0";

			if ( throwOnInvertible || false ) {

				throw new Error( msg );

			} else {

				console.warn( msg );

			}

			this.identity();

			return this;
		}

		this.multiplyScalar( 1 / det );

		return this;

	},

	translate: function ( v ) {

		console.warn( 'THREEMATHS.Matrix4: .translate() has been removed.' );

	},

	rotateX: function ( angle ) {

		console.warn( 'THREEMATHS.Matrix4: .rotateX() has been removed.' );

	},

	rotateY: function ( angle ) {

		console.warn( 'THREEMATHS.Matrix4: .rotateY() has been removed.' );

	},

	rotateZ: function ( angle ) {

		console.warn( 'THREEMATHS.Matrix4: .rotateZ() has been removed.' );

	},

	rotateByAxis: function ( axis, angle ) {

		console.warn( 'THREEMATHS.Matrix4: .rotateByAxis() has been removed.' );

	},

	scale: function ( v ) {

		var te = this.elements;
		var x = v.x, y = v.y, z = v.z;

		te[ 0 ] *= x; te[ 4 ] *= y; te[ 8 ] *= z;
		te[ 1 ] *= x; te[ 5 ] *= y; te[ 9 ] *= z;
		te[ 2 ] *= x; te[ 6 ] *= y; te[ 10 ] *= z;
		te[ 3 ] *= x; te[ 7 ] *= y; te[ 11 ] *= z;

		return this;

	},

	getMaxScaleOnAxis: function () {

		var te = this.elements;

		var scaleXSq = te[ 0 ] * te[ 0 ] + te[ 1 ] * te[ 1 ] + te[ 2 ] * te[ 2 ];
		var scaleYSq = te[ 4 ] * te[ 4 ] + te[ 5 ] * te[ 5 ] + te[ 6 ] * te[ 6 ];
		var scaleZSq = te[ 8 ] * te[ 8 ] + te[ 9 ] * te[ 9 ] + te[ 10 ] * te[ 10 ];

		return Math.sqrt( Math.max( scaleXSq, Math.max( scaleYSq, scaleZSq ) ) );

	},

	makeTranslation: function ( x, y, z ) {

		this.set(

			1, 0, 0, x,
			0, 1, 0, y,
			0, 0, 1, z,
			0, 0, 0, 1

		);

		return this;

	},

	makeRotationX: function ( theta ) {

		var c = Math.cos( theta ), s = Math.sin( theta );

		this.set(

			1, 0,  0, 0,
			0, c, - s, 0,
			0, s,  c, 0,
			0, 0,  0, 1

		);

		return this;

	},

	makeRotationY: function ( theta ) {

		var c = Math.cos( theta ), s = Math.sin( theta );

		this.set(

			 c, 0, s, 0,
			 0, 1, 0, 0,
			- s, 0, c, 0,
			 0, 0, 0, 1

		);

		return this;

	},

	makeRotationZ: function ( theta ) {

		var c = Math.cos( theta ), s = Math.sin( theta );

		this.set(

			c, - s, 0, 0,
			s,  c, 0, 0,
			0,  0, 1, 0,
			0,  0, 0, 1

		);

		return this;

	},

	makeRotationAxis: function ( axis, angle ) {

		// Based on http://www.gamedev.net/reference/articles/article1199.asp

		var c = Math.cos( angle );
		var s = Math.sin( angle );
		var t = 1 - c;
		var x = axis.x, y = axis.y, z = axis.z;
		var tx = t * x, ty = t * y;

		this.set(

			tx * x + c, tx * y - s * z, tx * z + s * y, 0,
			tx * y + s * z, ty * y + c, ty * z - s * x, 0,
			tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
			0, 0, 0, 1

		);

		 return this;

	},

	makeScale: function ( x, y, z ) {

		this.set(

			x, 0, 0, 0,
			0, y, 0, 0,
			0, 0, z, 0,
			0, 0, 0, 1

		);

		return this;

	},

	compose: function ( position, quaternion, scale ) {

		this.makeRotationFromQuaternion( quaternion );
		this.scale( scale );
		this.setPosition( position );

		return this;

	},

	decompose: function () {

		var vector = new THREEMATHS.Vector3();
		var matrix = new THREEMATHS.Matrix4();

		return function ( position, quaternion, scale ) {

			var te = this.elements;

			var sx = vector.set( te[ 0 ], te[ 1 ], te[ 2 ] ).length();
			var sy = vector.set( te[ 4 ], te[ 5 ], te[ 6 ] ).length();
			var sz = vector.set( te[ 8 ], te[ 9 ], te[ 10 ] ).length();

			// if determine is negative, we need to invert one scale
			var det = this.determinant();
			if ( det < 0 ) {
				sx = - sx;
			}

			position.x = te[ 12 ];
			position.y = te[ 13 ];
			position.z = te[ 14 ];

			// scale the rotation part

			matrix.elements.set( this.elements ); // at this point matrix is incomplete so we can't use .copy()

			var invSX = 1 / sx;
			var invSY = 1 / sy;
			var invSZ = 1 / sz;

			matrix.elements[ 0 ] *= invSX;
			matrix.elements[ 1 ] *= invSX;
			matrix.elements[ 2 ] *= invSX;

			matrix.elements[ 4 ] *= invSY;
			matrix.elements[ 5 ] *= invSY;
			matrix.elements[ 6 ] *= invSY;

			matrix.elements[ 8 ] *= invSZ;
			matrix.elements[ 9 ] *= invSZ;
			matrix.elements[ 10 ] *= invSZ;

			quaternion.setFromRotationMatrix( matrix );

			scale.x = sx;
			scale.y = sy;
			scale.z = sz;

			return this;

		};

	}(),

	makeFrustum: function ( left, right, bottom, top, near, far ) {

		var te = this.elements;
		var x = 2 * near / ( right - left );
		var y = 2 * near / ( top - bottom );

		var a = ( right + left ) / ( right - left );
		var b = ( top + bottom ) / ( top - bottom );
		var c = - ( far + near ) / ( far - near );
		var d = - 2 * far * near / ( far - near );

		te[ 0 ] = x;	te[ 4 ] = 0;	te[ 8 ] = a;	te[ 12 ] = 0;
		te[ 1 ] = 0;	te[ 5 ] = y;	te[ 9 ] = b;	te[ 13 ] = 0;
		te[ 2 ] = 0;	te[ 6 ] = 0;	te[ 10 ] = c;	te[ 14 ] = d;
		te[ 3 ] = 0;	te[ 7 ] = 0;	te[ 11 ] = - 1;	te[ 15 ] = 0;

		return this;

	},

	makePerspective: function ( fov, aspect, near, far ) {

		var ymax = near * Math.tan( THREEMATHS.Math.degToRad( fov * 0.5 ) );
		var ymin = - ymax;
		var xmin = ymin * aspect;
		var xmax = ymax * aspect;

		return this.makeFrustum( xmin, xmax, ymin, ymax, near, far );

	},

	makeOrthographic: function ( left, right, top, bottom, near, far ) {

		var te = this.elements;
		var w = right - left;
		var h = top - bottom;
		var p = far - near;

		var x = ( right + left ) / w;
		var y = ( top + bottom ) / h;
		var z = ( far + near ) / p;

		te[ 0 ] = 2 / w;	te[ 4 ] = 0;	te[ 8 ] = 0;	te[ 12 ] = - x;
		te[ 1 ] = 0;	te[ 5 ] = 2 / h;	te[ 9 ] = 0;	te[ 13 ] = - y;
		te[ 2 ] = 0;	te[ 6 ] = 0;	te[ 10 ] = - 2 / p;	te[ 14 ] = - z;
		te[ 3 ] = 0;	te[ 7 ] = 0;	te[ 11 ] = 0;	te[ 15 ] = 1;

		return this;

	},

	fromArray: function ( array ) {

		this.elements.set( array );

		return this;

	},

	toArray: function () {

		var te = this.elements;

		return [
			te[ 0 ], te[ 1 ], te[ 2 ], te[ 3 ],
			te[ 4 ], te[ 5 ], te[ 6 ], te[ 7 ],
			te[ 8 ], te[ 9 ], te[ 10 ], te[ 11 ],
			te[ 12 ], te[ 13 ], te[ 14 ], te[ 15 ]
		];

	},

	clone: function () {

		return new THREEMATHS.Matrix4().fromArray( this.elements );

	}

};

// File:src/math/Math.js

/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */

THREEMATHS.Math = {

	generateUUID: function () {

		// http://www.broofa.com/Tools/Math.uuid.htm

		var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split( '' );
		var uuid = new Array( 36 );
		var rnd = 0, r;

		return function () {

			for ( var i = 0; i < 36; i ++ ) {

				if ( i == 8 || i == 13 || i == 18 || i == 23 ) {

					uuid[ i ] = '-';

				} else if ( i == 14 ) {

					uuid[ i ] = '4';

				} else {

					if ( rnd <= 0x02 ) rnd = 0x2000000 + ( Math.random() * 0x1000000 ) | 0;
					r = rnd & 0xf;
					rnd = rnd >> 4;
					uuid[ i ] = chars[ ( i == 19 ) ? ( r & 0x3 ) | 0x8 : r ];

				}
			}

			return uuid.join( '' );

		};

	}(),

	// Clamp value to range <a, b>

	clamp: function ( x, a, b ) {

		return ( x < a ) ? a : ( ( x > b ) ? b : x );

	},

	// Clamp value to range <a, inf)

	clampBottom: function ( x, a ) {

		return x < a ? a : x;

	},

	// Linear mapping from range <a1, a2> to range <b1, b2>

	mapLinear: function ( x, a1, a2, b1, b2 ) {

		return b1 + ( x - a1 ) * ( b2 - b1 ) / ( a2 - a1 );

	},

	// http://en.wikipedia.org/wiki/Smoothstep

	smoothstep: function ( x, min, max ) {

		if ( x <= min ) return 0;
		if ( x >= max ) return 1;

		x = ( x - min ) / ( max - min );

		return x * x * ( 3 - 2 * x );

	},

	smootherstep: function ( x, min, max ) {

		if ( x <= min ) return 0;
		if ( x >= max ) return 1;

		x = ( x - min ) / ( max - min );

		return x * x * x * ( x * ( x * 6 - 15 ) + 10 );

	},

	// Random float from <0, 1> with 16 bits of randomness
	// (standard Math.random() creates repetitive patterns when applied over larger space)

	random16: function () {

		return ( 65280 * Math.random() + 255 * Math.random() ) / 65535;

	},

	// Random integer from <low, high> interval

	randInt: function ( low, high ) {

		return Math.floor( this.randFloat( low, high ) );

	},

	// Random float from <low, high> interval

	randFloat: function ( low, high ) {

		return low + Math.random() * ( high - low );

	},

	// Random float from <-range/2, range/2> interval

	randFloatSpread: function ( range ) {

		return range * ( 0.5 - Math.random() );

	},

	degToRad: function () {

		var degreeToRadiansFactor = Math.PI / 180;

		return function ( degrees ) {

			return degrees * degreeToRadiansFactor;

		};

	}(),

	radToDeg: function () {

		var radianToDegreesFactor = 180 / Math.PI;

		return function ( radians ) {

			return radians * radianToDegreesFactor;

		};

	}(),

	isPowerOfTwo: function ( value ) {

		return ( value & ( value - 1 ) ) === 0 && value !== 0;

	}

};
/** @license
 * --------------------------------------------------------------------------
 * glm-js | (c) humbletim | http://humbletim.github.io/glm-js
 * --------------------------------------------------------------------------
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2015-2016 humbletim
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
// ----------------------------------------------------------------------------
// glm.common.js - common math wrangler bits
// for full functionality this requires linking with a "math vendor" back-end
// https://github.com/humbletim/glm-js
// copyright(c) 2015 humbletim
// MIT LICENSE
// ----------------------------------------------------------------------------

try { glm.exists && alert("glm.common.js loaded over exist glm instance: "+glm); } catch(e) {}

glm = null;

GLMJS_PREFIX = 'glm-js: ';

GLM = {
   $DEBUG: 'undefined' !== typeof $GLM_DEBUG && $GLM_DEBUG,
   version: "0.0.6c",
   GLM_VERSION: 96,

   $outer: {
      polyfills: GLM_polyfills(),
      functions: {},
      intern: function(k,v) {
         if (!k) return;
         //console.warn("$GLM_intern", k,v);
         if (v === undefined && typeof k === 'object') {
            for(var p in k) GLM.$outer.intern(p, k[p]);
            return;
         }
         GLM.$DEBUG && GLM.$outer.console.debug("intern "+k, v && (v.name || typeof v));
         return GLM.$outer[k] = v;
      },
      $import: function(DLL) {
         GLM.$outer.$import = function() { throw new Error('glm.$outer.$import already called...'); };
         GLM.$outer.intern(DLL.statics);
         GLM.$template.extend(GLM,
            GLM.$template['declare<T,V,number>'](DLL['declare<T,V,number>']),
            GLM.$template['declare<T,V,...>'](DLL['declare<T,V,...>']),
            GLM.$template['declare<T,...>'](DLL['declare<T,...>']),
            GLM.$template['declare<T>'](DLL['declare<T>'])
         );
         GLM.$init(DLL);
      },
      console: $GLM_reset_logging(),
      quat_array_from_xyz: function(o) {
         var q = glm.quat(), M=glm.mat3(1);
         q['*='](glm.angleAxis(o.x, M[0]));
         q['*='](glm.angleAxis(o.y, M[1]));
         q['*='](glm.angleAxis(o.z, M[2]));
         return q.elements;
      },
      // _vec3_eulerAngles: function(q) {
      //    // adapted from three.js
      //    var te = this.mat4_array_from_quat(q);
      //    var m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
      //    m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
      //    m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ];

      //    var thiz = new glm.vec3();
      //    thiz.y = Math.asin( - glm._clamp( m31, - 1, 1 ) );

      //    if ( Math.abs( m31 ) < 0.99999 ) {
      //       thiz.x = Math.atan2( m32, m33 );
      //       thiz.z = Math.atan2( m21, m11 );
      //    } else {
      //       thiz.x = 0;
      //       thiz.z = Math.atan2( - m12, m22 );
      //    }
      //    return thiz;
      // },

       // so that people can work-around faulty TypedArray implementations
      Array: Array,
      ArrayBuffer: ArrayBuffer,
      Float32Array: Float32Array, Float64Array: Float64Array,
      Uint8Array:Uint8Array, Uint16Array: Uint16Array, Uint32Array: Uint32Array,
      Int8Array: Int8Array, Int16Array: Int16Array, Int32Array: Int32Array,
      DataView: typeof DataView !== 'undefined' && DataView,
      $rebindTypedArrays: function(alternator) {
         var ret = Object.keys(GLM.$outer)
            .filter(RegExp.prototype.test.bind(/.Array$|^ArrayBuffer$|^DataView$/))
            .map(
               function(p) {
                  var rep = alternator.call(this, p, GLM.$outer[p]);
                  if (rep !== GLM.$outer[p]) {
                     GLM.$outer.console.warn("$rebindTypedArrays("+p+")... replacing");
                     GLM.$outer[p] = rep;
                  }
                  return rep;
               });
         GLM.$subarray = GLM.patch_subarray();
         return ret;
      }
   },
   $extern: $GLM_extern,

   $log: $GLM_log,

   GLMJSError: $GLM_GLMJSError('GLMJSError'),

   _radians: function(n) { return n * this.PI / 180; }.bind(Math),
   _degrees: function(n) { return n * 180 / this.PI; }.bind(Math),

//    _degrees: $GLM_extern('degrees', '_degrees'),
//    radians: $GLM_extern("radians"),

   normalize: $GLM_extern('normalize'),
   inverse: $GLM_extern('inverse'),
   distance: $GLM_extern('distance'),
   length: $GLM_extern('length'),
   length2: $GLM_extern('length2'),
   transpose: $GLM_extern('transpose'),
   slerp: $GLM_extern("slerp"),
   mix: $GLM_extern("mix"),
   clamp: $GLM_extern('clamp'),
   angleAxis: $GLM_extern('angleAxis'),
   rotate: $GLM_extern('rotate'),
   scale: $GLM_extern('scale'),
   translate: $GLM_extern('translate'),
   lookAt: $GLM_extern('lookAt'),
   cross: $GLM_extern('cross'),
   dot: $GLM_extern('dot'),

   perspective: function(fov, aspect, near, far) {
      return GLM.$outer.mat4_perspective(fov, aspect, near, far);
   },
   ortho: function(left, right, bottom, top, near, far) {
       return GLM.$outer.mat4_ortho(left, right, bottom, top, near, far);
   },

   _eulerAngles: function(q) {
      return GLM.$outer.vec3_eulerAngles(q);
   },
   angle: function(x) {
      return Math.acos(x.w) * 2;
   },
   axis: function(x) {
      var tmp1 = 1 - x.w * x.w;
      if(tmp1 <= 0)
         return glm.vec3(0, 0, 1);
      var tmp2 = 1 / Math.sqrt(tmp1);
      return glm.vec3(x.x * tmp2, x.y * tmp2, x.z * tmp2);
   },

   $from_ptr: function(typ, ptr, byteOffset) {
      if (this !== GLM) throw new GLM.GLMJSError("... use glm.make_<type>() (not new glm.make<type>())");
      var components = new GLM.$outer.Float32Array(ptr.buffer || ptr,byteOffset||0,typ.componentLength);
      var elements = new GLM.$outer.Float32Array(components);// ensure it's a clone
      return new typ(elements);
   },
   make_vec2: function(ptr,byteOffset) { return GLM.$from_ptr.call(this, GLM.vec2, ptr, arguments.length === 2 ? byteOffset : ptr.byteOffset); },
   make_vec3: function(ptr,byteOffset) { return GLM.$from_ptr.call(this, GLM.vec3, ptr, arguments.length === 2 ? byteOffset : ptr.byteOffset); },
   make_vec4: function(ptr,byteOffset) { return GLM.$from_ptr.call(this, GLM.vec4, ptr, arguments.length === 2 ? byteOffset : ptr.byteOffset); },
   make_quat: function(ptr,byteOffset) { return GLM.$from_ptr.call(this, GLM.quat, ptr, arguments.length === 2 ? byteOffset : ptr.byteOffset); },
   make_mat3: function(ptr,byteOffset) { return GLM.$from_ptr.call(this, GLM.mat3, ptr, arguments.length === 2 ? byteOffset : ptr.byteOffset); },
   make_mat4: function(ptr,byteOffset) { return GLM.$from_ptr.call(this, GLM.mat4, ptr, arguments.length === 2 ? byteOffset : ptr.byteOffset); },

   diagonal4x4: function(v) {
      if (GLM.$typeof(v) !== 'vec4') throw new GLM.GLMJSError('unsupported argtype to GLM.diagonal4x4: '+['type:' + GLM.$typeof(v)]);
      v = v.elements;
      return new GLM.mat4(
         [v[0], 0, 0, 0,
          0, v[1], 0, 0,
          0, 0, v[2], 0,
          0, 0, 0, v[3]]
      );
   },

   diagonal3x3: function(v) {
      if (GLM.$typeof(v) !== 'vec3') throw new GLM.GLMJSError('unsupported argtype to GLM.diagonal3x3: '+['type:' + GLM.$typeof(v)]);
      v = v.elements;
      return new GLM.mat3(
         [v[0], 0, 0,
          0, v[1], 0,
          0, 0, v[2]]
      );
   },

   _toMat4: function toMat4(q) {
      return new GLM.mat4(GLM.$outer.mat4_array_from_quat(q));
   },

   FAITHFUL: true, // attempt to match GLM::to_string output ASCII-for-ASCII

   to_string: function to_string(o, opts) {
      try {
         var type = o.$type || typeof o;
         if (!GLM[type])
            throw new GLM.GLMJSError('unsupported argtype to GLM.to_string: '+['type:'+type,o]);
         if (!GLM.FAITHFUL)
            return GLM.$to_string(o, opts); // prettier-printed w/indentation
         else
            return GLM.$to_string(o, opts).replace(/[\t\n]/g,''); // flat
      } catch(e) {
         GLM.$DEBUG && GLM.$outer.console.error('to_string error: ',type,o+'',e);
         return e+'';
      }
   },

   $sizeof: function(o) { return o.BYTES_PER_ELEMENT; },
   $types: [],
   $isGLMConstructor: function(o) { return !!(o&&o.prototype instanceof GLM.$GLMBaseType); },
   $getGLMType: function(o) { return o instanceof GLM.$GLMBaseType && o.constructor || 'string' === typeof o && GLM[o] ; },
   $isGLMObject: function(o) { return !!(o instanceof GLM.$GLMBaseType && o.$type); },
   $typeof: function(o) { return o instanceof GLM.$GLMBaseType ? o.$type : 'undefined'; },

   $to_array: function(o) {
      return [].slice.call(o.elements);
   },

   $to_json: function(v,p,q) {
      if (this instanceof GLM.$GLMBaseType) { q=p, p=v, v=this; }
      return JSON.stringify(GLM.$to_object(v),p,q);
   },

   $inspect: function(v) {
      if (this instanceof GLM.$GLMBaseType)
         v = this;
      return GLM.$to_json(v,null,2);
   },

   _clamp: function (a,b,c) { return a<b?b:(a>c?c:a); },
   _abs: function(a) { return Math.abs(a); },
   _equal: function(a,b) { return a === b; },
   _epsilonEqual: function(x,y,e) { return Math.abs(x - y) < e; },
   _fract: function(a) { return a - Math.floor(a) },

   // adapted from Squeak.js (see ../lib/squeak.js)
    _frexp: (function define_frexp() {
        // mini-DataView emulator (polyfills _frexp's specific need)
        function _DataView(ab) {
            this.buffer = ab;
            this.setFloat64 = function(offset, value) {
                if (offset !== 0) throw new Error('...this is a very limited DataView emulator');
                // effectively writes the bigEndian encoding of the float...
                new Uint8Array(this.buffer).set([].reverse.call(new Uint8Array(new Float64Array([value]).buffer)), offset);
            };
            this.getUint32 = function(offset) {
                if (offset !== 0) throw new Error('...this is a very limited DataView emulator');
                return new Uint32Array(new Uint8Array([].slice.call(new Uint8Array(this.buffer)).reverse()).buffer)[1];
            };
        };
        _frexp._DataView = _DataView; // expose for unit testing
        function _frexp(value, arrptr) {
            // frexp separates a float into its mantissa and exponent
            var DV = GLM.$outer.DataView || _frexp._DataView;

            if (value == 0.0) { // zero is special
                if (arrptr && Array.isArray(arrptr)) {
                    arrptr[0] = arrptr[1] = 0;
                    return 0;
                }
                return [0,0];
            }
            var data = new DV(new GLM.$outer.ArrayBuffer(8));
            data.setFloat64(0, value);      // for accessing IEEE-754 exponent bits
            var bits = (data.getUint32(0) >>> 20) & 0x7FF;
            if (bits === 0) { // we have a subnormal float (actual zero was handled above)
                // make it normal by multiplying a large number
                data.setFloat64(0, value * Math.pow(2, 64));
                // access its exponent bits, and subtract the large number's exponent
                bits = ((data.getUint32(0) >>> 20) & 0x7FF) - 64;
            }
            var exponent = bits - 1022;                 // apply bias
            var mantissa = GLM.ldexp(value, -exponent)

            // no C pointers available; not sure which strategy is best yet...
            if (arrptr && Array.isArray(arrptr)) {
                arrptr[0] = exponent; // glm-ish behavior
                arrptr[1] = mantissa; // extra return value
                return mantissa;
            }
            return [mantissa, exponent]; // both values at once
        }
        return _frexp;
    })(),
   _ldexp: function(mantissa, exponent) {
      // construct a float from mantissa and exponent
      return exponent > 1023 // avoid multiplying by infinity
         ? mantissa * Math.pow(2, 1023) * Math.pow(2, exponent - 1023)
         : exponent < -1074 // avoid multiplying by zero
         ? mantissa * Math.pow(2, -1074) * Math.pow(2, exponent + 1074)
         : mantissa * Math.pow(2, exponent);
   }, /// Squeak.js

   _max: Math.max,
   _min: Math.min,
   sqrt: Math.sqrt,
   __sign: function(x) {
      return x > 0 ? 1 : x < 0 ? -1 : +x;
   },

    $constants: {
        epsilon: 1e-6,
        euler: 0.577215664901532860606,
        e: Math.E,
        ln_ten: Math.LN10,
        ln_two: Math.LN2,
        //Math.LOG10E,
        //Math.LOG2E,
        pi: Math.PI,
        half_pi: Math.PI/2,
        quarter_pi: Math.PI/4,
        one_over_pi: 1/Math.PI,
        two_over_pi: 2/Math.PI,
        root_pi: Math.sqrt(Math.PI),
        root_two: Math.sqrt(2),
        root_three: Math.sqrt(3),
        two_over_root_pi: 2/Math.sqrt(Math.PI),
        one_over_root_two: Math.SQRT1_2,
        root_two: Math.SQRT2
    },

   FIXEDPRECISION: 6,
   $toFixedString: function(prefix, what, props, precision) {
      if (precision === undefined)
         precision = GLM.FIXEDPRECISION;
      if (!props || !props.map) throw new Error('unsupported argtype to $toFixedString(..,..,props='+typeof props+')');
      function verify() {
          try {
              // pre-check .toFixed conversion would work
              var lp = "";
              props.map(function(p) { var w=what[lp=p]; if (!w.toFixed)throw new Error('!toFixed in w'+[w,prefix,JSON.stringify(what)]); return w.toFixed(0); });
          } catch(e) {
              GLM.$DEBUG && GLM.$outer.console.error(
                  "$toFixedString error", prefix, typeof what, Object.prototype.toString.call(what), lp
              );
              GLM.$DEBUG && glm.$log(
                  "$toFixedString error", prefix, typeof what, Object.prototype.toString.call(what), lp);
              throw new GLM.GLMJSError(e);
          }
      }
       verify();
      props = props.map(function(p) { return what[p].toFixed(precision); });
      return prefix + "(" + props.join(", ") + ")";
   }
};

GLM._sign = Math.sign || GLM.__sign;

for(var p in GLM.$constants) {
    (function(v,k) {
        GLM[k] = function() { return v; };
        GLM[k].valueOf = GLM[k];
    })(GLM.$constants[p], p);
}
// ----------------------------------------------------------------------------

GLM.$GLMBaseType = (
   function()  {
      function $GLMBaseType($class, $type) {
         var $ = $class.$ || {};
         this.$type = $type;
         this.$type_name = $.name || '<'+$type+'>';

         if ($.components)
            this.$components = $.components[0];
         this.$len =
            this.components = $class.componentLength;
         this.constructor = $class;
         this.byteLength = $class.BYTES_PER_ELEMENT;

         //this.repr = function() { return "function $GLMBaseType<"+$type+">(){ [ GLMType@"+(GLM.$template.$_module_stamp)+" ] }"; };

         //GLM.$outer.console.debug("CREATED $class: "+this.repr());

         GLM.$types.push($type);
      }
      $GLMBaseType.prototype = {
         clone: function() { return new this.constructor(new this.elements.constructor(this.elements)); },
         toString: function() {
            return GLM.$to_string(this);
         },
         inspect: function() {
            return GLM.$inspect(this);
         },
         toJSON: function() {
            return GLM.$to_object(this);
         }
      };
      Object.defineProperty(
         $GLMBaseType.prototype, 'address',
         {
            get: function() {
               var r = this.elements.byteOffset.toString(16);
               return "0x00000000".substr(0,10-r.length)+r;
           }
         });
      return $GLMBaseType;
   })();

// ----------------------------------------------------------------------------

// SpiderMonkey ~1.8.5's TypedArray.subarray was broken; this is a workaround
/*
  var f = new Float32Array([0,1,2]);
  if(f.subarray(1).subarray(0) !== f[1]) throw "broken subarrays!"
*/

(function() {
    function native_subarray(o, a, b) {
       return o.subarray(a, b || o.length);
    }

    function workaround_broken_spidermonkey_subarray(o, a, b) {
       // re-calculate subarray offsets directly
       var typedArray = o.constructor;
       b = b || o.length;
       return new typedArray(
          o.buffer, o.byteOffset +
             a * typedArray.BYTES_PER_ELEMENT,
          (b-a));
    }

    //var ab = new ArrayBuffer(16*4);
    //var fb = new Float32Array(ab);
    //if (fb.length === ab.byteLength)
    //   GLM.$outer.console.error("BROKEN TypedArrays detected");

    function test_native_subarray() {
        var f = new GLM.$outer.Float32Array([0,0]);
        f.subarray(1).subarray(0)[0] = 1;
        var result = test_native_subarray.result = [ f[1], new GLM.$outer.Float32Array(16).subarray(12,16).length ];
        return !(
            f[1] !== result[0] || // SpiderMonkey
            4 !== result[1] // QtScript
        );
    }

    function test_patched_subarray(subarray) {
        var f = new GLM.$outer.Float32Array([0,0]);
        subarray(subarray(f,1), 0)[0] = 1;
        var result = test_patched_subarray.result = [ f[1], subarray(new GLM.$outer.Float32Array(16), 12, 16).length ];
        return !(
            f[1] !== result[0] || // SpiderMonkey
            4 !== result[1] // QtScript
        );
    }

    Object.defineProperty(
       GLM, 'patch_subarray',
       {
           configurable: true,
           value: function patch_subarray() {
               var busted = !test_native_subarray();
               var subarray = busted ?
                   workaround_broken_spidermonkey_subarray :
                   native_subarray;
               subarray.workaround_broken_spidermonkey_subarray = workaround_broken_spidermonkey_subarray;
               subarray.native_subarray = native_subarray;

               if (!test_patched_subarray(subarray))
                   throw new Error('failed to resolve working TypedArray.subarray implementation... '+test_patched_subarray.result);

               return subarray;
           }
       });
 })();
GLM.$subarray = GLM.patch_subarray();

// ----------------------------------------------------------------------------

var GLM_template = GLM.$template = {
   _genArgError: function(F, dbg, TV, args) {
      if (~args.indexOf(undefined)) {
         args = args.slice(0,args.indexOf(undefined));
      }
      var no_dollars = RegExp.prototype.test.bind(/^[^$_]/);
      return new GLM.GLMJSError(
         'unsupported argtype to '+dbg+' '+F.$sig+': [typ='+TV+"] :: "+
            'got arg types: '+args.map(GLM.$template.jstypes.get)+
            " // supported types: "+Object.keys(F).filter(no_dollars).join("||"));
   },
   jstypes: {
      get: function(x) {
         return x === null ? "null" :
            x === undefined ? "undefined" :
            (x.$type ||
             GLM.$template.jstypes[typeof x] ||
             GLM.$template.jstypes[x+''] ||
             (function auxiliary(x) {
                 if ('object' === typeof x) { // older versions of node
                    if (x instanceof GLM.$outer.Float32Array) return "Float32Array";
                    if (x instanceof GLM.$outer.ArrayBuffer) return "ArrayBuffer";
                    if (Array.isArray(x)) return 'array';
                 }
                 return "<unknown "+[typeof x, x]+">";
              })(x));
      },
      0: "float",
      "boolean": "bool",
      "number": "float",
      "string": "string",
      "[object Float32Array]": "Float32Array",
      "[object ArrayBuffer]": "ArrayBuffer",
      "function":"function"
   },
   _add_overrides: function(type, kvfuncs) {
      for(var p in kvfuncs)
         if(kvfuncs[p]) GLM[p].override(type, kvfuncs[p]);
   },
   _add_inline_override: function(dbg, type, func) {
      this[type] = /*TRACING*/ /*EVAL*/eval(GLM.$template._traceable("glm_"+dbg+"_"+type, func))();
      return this;
   },
   _inline_helpers: function(F,dbg) {
      Object.defineProperty(F, 'GLM', { value: GLM });
      return {
         $type: "built-in",
         $type_name: dbg,
         $template: F,
         F: F,
         dbg: dbg,
         override: this._add_inline_override.bind(F,dbg),
         link: function(sig) {
            var func = F[sig];
            if (!func)
               func = F[[sig,undefined+'']];
            if (!func)
               throw new GLM.GLMJSError("error linking direct function for "+dbg+"<"+sig+"> or "+dbg+"<"+[sig,undefined]+">");
            if (/\bthis[\[.]/.test(func+'')) return func.bind(F);
            return func;
         }
      };
   },
   "template<T>": function(F, dbg) {
      F.$sig = "template<T>";
      var types = GLM.$template.jstypes;
      var _genArgError = GLM.$template._genArgError;
      var $GLMBaseType = GLM.$GLMBaseType;
      /*TRACING*/ return this.slingshot(
         this._inline_helpers(F,dbg),
         /*EVAL*/eval(this._traceable("Tglm_"+dbg,
         function(o) {
            //var F = arguments.callee.F;
            if (this instanceof $GLMBaseType) { o=this; }
            var T = [(o&&o.$type) || types[typeof o] || types.get(o) || "null"];
            if (!F[T])
               throw _genArgError(F, arguments.callee.dbg, T, [o]);
            return F[T](o);
         }))());
   },
   "template<T,...>": function(F, dbg) {
      F.$sig = "template<T,...>";
      var types = GLM.$template.jstypes;
      var _genArgError = GLM.$template._genArgError;
      var $GLMBaseType = GLM.$GLMBaseType;
      /*TRACING*/ return this.slingshot(
         this._inline_helpers(F,dbg),
         /*EVAL*/eval(this._traceable("Tdotglm_"+dbg,
         function(o) {
            //var F = arguments.callee.F;
            //var types = GLM.$template.jstypes;
            var args = __VA_ARGS__;
            if (this instanceof $GLMBaseType) { args.unshift(o=this); }
            var T = [(o&&o.$type) || types[typeof o] || types.get(o) || "null"];
            if (!F[T])
               throw _genArgError(F, arguments.callee.dbg, T, args);
            return F[T].apply(F, args);
         }))());
   },
   "template<T,V,number>": function(F, dbg) {
      F.$sig = "template<T,V,number>";
      var types = GLM.$template.jstypes;
      var _genArgError = GLM.$template._genArgError;
      var _genArgErrorType = function(F, dbg, v) {
          return new GLMJSError(dbg+F.$sig+': unsupported n type: '+[typeof v,v]);
      };
      var GLMJSError = GLM.GLMJSError;
      var $GLMBaseType = GLM.$GLMBaseType;
      /*TRACING*/ return this.slingshot(
         this._inline_helpers(F,dbg),
         /*EVAL*/eval(this._traceable("TVnglm_"+dbg,
         function () {
            var args = __VA_ARGS__;
            if (this instanceof $GLMBaseType) { args.unshift(this); }
            var o=args[0], p=args[1], v=args[2];
            //if (this instanceof GLM.$GLMBaseType) { v=p, p=o, o=this; }
            var TV = [(o&&o.$type) || types[typeof o] || types[o+''] || "<unknown "+o+">",
                      (p&&p.$type) || types[typeof p] || types[p+''] || "<unknown "+p+">"];
            if (!F[TV])
               throw _genArgError(F, arguments.callee.dbg, TV, [o,p,v]);
            if (typeof v !== 'number')
               throw _genArgErrorType(F, arguments.callee.dbg, v);
            return F[TV](o,p,v);
         }))());
   },
   "template<T,V,...>": function(F, dbg) {
      F.$sig = 'template<T,V,...>';
      var types = GLM.$template.jstypes;
      var $GLMBaseType = GLM.$GLMBaseType;
      var _genArgError = GLM.$template._genArgError;
      var Array = GLM.$outer.Array;
      /*TRACING*/ return this.slingshot(
         this._inline_helpers(F,dbg),
         /*EVAL*/eval(this._traceable("TVglm_"+dbg,
         function(/*o,p,a,b,c*/) {
            var args = __VA_ARGS__;
            if (this instanceof $GLMBaseType) { args.unshift(this); }
            //            if (this instanceof GLM.$GLMBaseType) { c=b, b=a, a=p, p=o, o=this; }
            var o=args[0], p=args[1];
            var TV = [(o&&o.$type) || types[typeof o],
                      (p&&p.$type) || types[typeof p] || types[p+''] || (Array.isArray(p) && "array"+p.length+"") || ""+p+""];
            if (!F[TV]) { //alert(this.constructor+'');
               throw _genArgError(F, arguments.callee.dbg, TV, args); }
            return F[TV].apply(F, args);
            //return F[TV](o,p,a,b,c);
         }))());
   },

   override: function(TV, p, TSP, ret, force) {
      GLM.$DEBUG && GLM.$outer.console.debug('glm.$template.override: ', TV, p, TSP.$op?'$op: ["'+TSP.$op+'"]':"");
      if (!ret) throw new Error('unspecified target group '+ret+' (expected override(<TV>, "p", {TSP}, ret={GROUP}))');
      var merge = ret[p];
      if (merge && merge.$op !== TSP.$op) {
         throw new Error('glm.$template.override: mismatch merging existing override: .$op "'+
                         [merge.$op,'!=',TSP.$op].join(" ")+'" '+
                         ' p='+[p,merge.$op,TSP.$op,
                                "||"+Object.keys(merge.$template).join("||")]);
      }
      var overlay = GLM.$template[TV](GLM.$template.deNify(TSP, p), p);

      if (merge && merge.F.$sig !== overlay.F.$sig) {
         throw new Error('glm.$template.override: mismatch merging existing override: .$sig "'+
                         [merge && merge.F.$sig,'!=',overlay.F.$sig].join(" ")+'" '+
                         ' p='+[p,merge && merge.F.$sig,overlay.F.$sig,
                                "||"+Object.keys(merge && merge.$template || {}).join("||")]);
      }
      overlay.$op = TSP.$op;
      if (!merge) {
         ret[p] = overlay;
         GLM.$DEBUG && log_override(ret[p], []);
      } else {
         for(var P in overlay.$template) {
            if (P === '$op' || P === '$sig') continue;
            var existing = P in merge.$template;
            if (!existing || force === true) {
               GLM.$DEBUG && GLM.$outer.console.debug("glm.$template.override: "+p+" ... "+P+" merged");
               merge.$template[P] = overlay.$template[P];
            } else if (existing) {
               GLM.$DEBUG && GLM.$outer.console.debug("glm.$template.override: "+p+" ... "+P+" skipped");
            }
         }

         if (GLM.$DEBUG) {
            var oldsigs = [];
            Object.keys(merge.$template).forEach(
               function(P) {
                  if (!(P in overlay.$template)) {
                     GLM.$DEBUG && GLM.$outer.console.debug("glm.$template.override: "+p+" ... "+P+" carried-forward");
                     oldsigs.push(P);
                  }
               }
            );
            log_override(ret[p], oldsigs);
         }
      }

      function log_override(retp, oldsigs) {
         GLM.$outer.console.debug("glm.$template.override: "+p+" ... "+
                                  (Object.keys(retp.$template)
                                   .filter(function(x){return !~x.indexOf('$')})
                                   .map(function(x){ return !~oldsigs.indexOf(x) ? "*"+x+"*" : x; })
                                   .join(" | ")));
      }
//       if (TSP.$op)
//          ret[TSP.$op] = ret[p];
      return ret;
   },

   _override: function(TV, TS, ret) {
      for(var p in TS) {
          //console.warn("_override", p);
          if (p !== 'mat4_scale' && typeof TS[p] !== 'object')
              throw new GLM.GLMJSError('expect object property overrides' + [p,TS[p], Object.keys(ret)]);
          if (typeof TS[p] === 'object') {
              this.override(TV, p, TS[p], ret, true /*force / replace existing*/);
          } else
              ret_scale = 5;
      }
      return ret;
   },
   slingshot: function() {
      return this.extend.apply(this, [].reverse.call(arguments));
   },
   extend: function(dest, sources) {
      [].slice.call(arguments,1)
         .forEach(function(source) {
                     if (!source) return;
                     for(var p in source)
                        if (source.hasOwnProperty(p))
                            dest[p] = source[p];
                  });
      return dest;
   },
   'declare<T,V,...>': function operations(TS) {
      //console.warn("operations", TS);
      if (!TS) return {};
      return this._override("template<T,V,...>",TS,GLM.$outer.functions);
   },
   'declare<T>': function calculators(TS) {
      //console.warn("FUNCTION_SOURCES", TS);
      if (!TS) return {};
      return this._override("template<T>",TS,GLM.$outer.functions);
   },
   'declare<T,...>': function varargs_functions(TS) {
      if (!TS) return {};
      //console.warn("FUNCTION_SOURCES", TS);
      return this._override("template<T,...>",TS,GLM.$outer.functions);
   },
   'declare<T,V,number>': function functions(TS) {
      if (!TS) return {};
      //console.warn("FUNCTION_SOURCES", TS);
      return this._override("template<T,V,number>",TS,GLM.$outer.functions);
   },
   _tojsname: function(hint) {
      return (hint || "_").replace(/[^$a-zA-Z0-9_]/g,'_');
   },
   _traceable: function(hint, _src) {
      var src = _src;
      if ('function' !== typeof src)
         throw new GLM.GLMJSError("_traceable expects tidy function as second arg "+src);
      if (!hint) throw new GLM.GLMJSError("_traceable expects hint or what's the point" + [src,hint]);
      hint = this._tojsname(hint||"_traceable");
      src = (src.toString()).replace(/^(\s*var\s*(\w+)\s*=\s*)__VA_ARGS__;/mg,
                             function(_,rep,varname) {
                                return rep+
                                   'new Array(arguments.length);for(var I=0;I<varname.length;I++)varname[I]=arguments[I];'.replace(/I/g,'__VA_ARGS__I').replace(/varname/g,varname);
                             })
         .replace(/\barguments[.]callee\b/g, hint);
       //if (/callee/.test(src))throw new Error(src);
      if (!/^function _traceable/.test(src)) { //src.split(/^\s*function\b/).length === 2) {
         // not already a factory; wrap it
         src = ('function _traceable(){ "use strict"; SRC; return HINT; }')
            .replace("HINT", hint.replace(/[$]/g,'$$$$'))
            .replace("SRC", src.replace(/[$]/g,'$$$$').replace(/^function\s*\(/,'function '+hint+'('));
      } else {
         throw new GLM.GLMJSError("already wrapped in a _traceable: "+[src,hint]);
      }
      src = "1,"+src;
      if (GLM.$DEBUG) {
         try {
            eval(src);
         } catch(e) {
            console.error('_traceable error', hint, src, _src,e);
            throw e;
         }
      }
      return src;
   },

   // this expands TSPs like { 'vec<N>': function(a) { return N; } }
   // ... into { vec2: function(a) { return 2; }, vec3: ..., vec4: ... }
   deNify: function(TSP, hint) {
      var rng = { vec: [2,3,4], mat: [3,4] };
      var _tojsname = this._tojsname.bind(this);
      for(var TN in TSP) {
         var bN = false;
         TN.replace(/([vV]ec|[mM]at)(?:\w*)<N>/,
            function(_, vorm) {
               bN = true;
               var tpl = TSP[TN];
               delete TSP[TN];
               rng[vorm.toLowerCase()].forEach(
                  function(N){
                     var kn = TN.replace(/<N[*]N>/g,N*N).replace(/<N>/g,N);
                     if (!( kn in TSP )) {
                        var fname = _tojsname("glm_"+hint+"_"+kn);
                        //GLM.$outer.console.warn("implicit "+kn);
                         TSP[kn] = /*EVAL*/eval(
                             "'use strict'; 1,"+(tpl+'')
                                 .replace(/^function\s*\(/,'function '+fname+'(')
                                 .replace(/N[*]N/g,N*N).replace(/N/g,N)
                         );
                        //console.error('TN:',TN,kn,TSP[kn]);
                     }
                  }
               );
            }.bind(this));
         if (/^[$]/.test(TN)) GLM.$DEBUG && GLM.$outer.console.debug("@ NOT naming "+TN);
         else if (!bN && 'function' === typeof TSP[TN] && !TSP[TN].name) {
            GLM.$DEBUG && GLM.$outer.console.debug("naming "+_tojsname(hint+"_"+TN));
            /*TRACING*/ TSP[TN] = /*EVAL*/eval(this._traceable("glm_"+hint+"_"+TN, TSP[TN]))();
         }
      }
      //GLM.$outer.console.warn(TN);
      return TSP;
   },
   $_module_stamp: +new Date(),

   // see also: http://stackoverflow.com/a/31194949
   _iso: '/[*][^/\*]*[*]/',
   _get_argnames: function $args(func) {
      return (func+'').replace(/\s+/g,'')
         .replace(new RegExp(this._iso,'g'),'') // strip simple comments
         .split('){',1)[0].replace(/^[^(]*[(]/,'') // extract the parameters
         .replace(/=[^,]+/g,'') // strip any ES6 defaults
         .split(',').filter(Boolean); // split & filter [""]
   },

    _fix_$_names: function($type, $) {
      if (1) {
         // make sure methods have a reasonable function name for profiling
         Object.keys($)
            .filter(function(p) { return 'function' === typeof $[p] && !$[p].name })
            .map(function(p) {
                    var hint = $type+"_"+p;
                    GLM.$DEBUG && GLM.$outer.console.debug("naming $."+p+" == "+hint, this._traceable(hint, $[p]));
                    /*TRACING*/ $[p] = /*EVAL*/eval(this._traceable("glm_"+hint,$[p]))();
                 }.bind(this));
      }
      return $;
    },
    _typedArrayMaker: function($len, Float32Array) {
        return function makeTypedArray(n) {
            if (n.length === $len)
                return new Float32Array( n );
            var elements = new Float32Array( $len );
            elements.set(n);
            return elements;
        };
    },

   GLMType: function ($type, _$) {
      var $ = this._fix_$_names($type, _$);
      var $len = $.identity.length;

       var getBuilder = (function(Object, GLM, $, $type, _get_argnames, GLMJSError) {
           var $$ = {}
           for(var p in $)
               if (typeof $[p] === 'function') {
                   (function(builder) {
                       $$[p] = function(args) { return builder.apply($, args); };
                   })($[p]);
               }
           return function getBuilder(args) {
               var n = args[0];
               var sig = typeof n + args.length;
               var builder = $$[sig];

               if (!builder) {
                   var s = 'glm.'+$type;
                   var provided = s + '('+args.map(function(_){return typeof _})+')';
                   var hints = Object.keys($)
                       .filter(
                           function(_) {
                               return typeof $[_] === 'function' && /^\w+\d+$/.test(_); }
                       )
                       .map(function(_) {
                           return s+'('+_get_argnames($[_])+')';
                       });
                   throw new GLMJSError(
                       'no constructor found for: '+provided+'\n'+
                           'supported signatures:\n\t'+
                           hints.join('\n\t'));
               }
               return builder;
           };
       })(Object, GLM, $, $type, GLM.$template._get_argnames.bind(GLM.$template), GLM.GLMJSError);

       var verifyLength = (function(Object, GLM, $, $type, _get_argnames, GLMJSError) {
           return function verifyLength(n, fail) {
               GLM.$DEBUG > 2 && GLM.$outer.console.info("adopting elements...", typeof n);
               if (n.length != $len) {
                   if (fail === false)
                       return fail;
                   GLM.$outer.console.error(
                       $type+' elements size mismatch: '+
                           ['wanted:'+$len, 'handed:'+n.length]
                   );
                   var nn = GLM.$subarray(n,0,$len);
                   throw new GLM.GLMJSError(
                       $type+' elements size mismatch: '+
                           ['wanted:'+$len, 'handed:'+n.length,
                            'theoreticaly-correctable?:'+(nn.length ===  $len)]
                   );
               }
               return n;
           }
       })(Object, GLM, $, $type, GLM.$template._get_argnames.bind(GLM.$template), GLM.GLMJSError);

       var makeTypedArray = this._typedArrayMaker($len, GLM.$outer.Float32Array);

       var isTypedArray = (function($outer) {
           return function isTypedArray(n) {
               return n instanceof $outer.Float32Array;
           };
       })(GLM.$outer);

       var $class = (function(Array, Object, GLM, $, $type, _get_argnames, GLMJSError, _traceable) {
           return /*TRACING*/ /*EVAL*/eval(_traceable("glm_"+$type+"$class", function(n) {
         //var $class = arguments.callee;
         var args = __VA_ARGS__;
         var builder = getBuilder(args);
         var elements;
         //GLM.$outer.console.warn(sig, $type, n, $type, this.$type, this.constructor);
         var $class = getClass();
         if (!(this instanceof $class)) { //(!isASelf(this)) {
            // if we're called as a regular function, redirect to "new $class()"
            // new $class(<Float32Array>) will use <Float32Array> by reference
            // $class(<Float32Array>) will use <Float32Array> by copy
              if (isTypedArray(n) && n.length === $len)
                  elements = makeTypedArray(n);
              else
                  elements = builder(args);
              return new $class(elements);
         } else {
            // called as "new $class()"
             if (isTypedArray(n)) {
               // note: $class(<Float32Array>) is a special case in which we adopt the passed buffer
               //       (bypassing the builder / causing updates to the existing buffer instead)
                elements = verifyLength(n);
            } else {
                elements = makeTypedArray(builder(args));
            }
             //this.elements = elements;
             Object.defineProperty(this, 'elements', { enumerable: false, configurable: true, value: elements });
         }
      }))();
       })(Array, Object, GLM, $, $type, GLM.$template._get_argnames.bind(GLM.$template), GLM.GLMJSError, GLM.$template._traceable.bind(GLM.$template));

       function getClass() {
           return $class;
       }
       function isASelf(t) {
           return t instanceof getClass();
       }
      // resolve shorthand defs like $.components=['xyz',...] into [['x','y',z'], ...]
      $.components = $.components ?
         $.components.map(
            function(v) { return 'string' === typeof(v) ? v.split("") : v; }
         ) : [];

      $class.$ = $;
      $class.componentLength = $len;
      $class.BYTES_PER_ELEMENT = $len * GLM.$outer.Float32Array.BYTES_PER_ELEMENT,
      $class.prototype = new GLM.$GLMBaseType($class, $type);
      $class.toJSON = function() { var ob={ glm$type: $type, glm$class: $class.prototype.$type_name, glm$eg: new $class().object };for(var p in $class)if(!/function |^[$]/.test(p+$class[p]))ob[p]=$class[p]; return ob; return { glm$type_name: this.$type_name, glm$type: $type, BYTES_PER_ELEMENT: this.BYTES_PER_ELEMENT }; };

      return $class;
   }
};

GLM.$template['declare<T,V,...>'](
   {
      cross: {
         'vec2,vec2': function(a, b) {
            return this.GLM.vec3(0,0,a.x * b.y - a.y * b.x);
         }
      },
      distance: {
          'vec<N>,vec<N>': function(a, b) {
              return this.GLM.length(b.sub(a));
          }
      }
   });
GLM.$template['declare<T,V,number>'](
   {
      mix: {
         "float,float": function(v,n,rt) {
            return n*rt+v*(1-rt);
         },
         "vec<N>,vec<N>": function(v,n,rt) {
            //if (rt === undefined) throw new Error('glm.mix<vecN,vecN>(v,n,rt) requires 3 arguments');
            var rtm1 = (1-rt);
            var ret = new this.GLM.vecN(new (v.elements.constructor)(N));
             var re = ret.elements,
                 ve = v.elements,
                 ne = n.elements;
             for(var i = 0; i < N; i++)
                 re[i] = ne[i]*rt+ve[i]*rtm1;
             return ret;
         }
      },
      clamp: {
         "float,float": function(n,a,b) {
            return GLM._clamp(n,a,b);
         },
         "vec<N>,float": function(v,a,b) {
            return new GLM.vecN(GLM.$to_array(v).map(function(n){ return GLM._clamp(n,a,b); }));
         }
      },
      epsilonEqual: {
         'float,float': GLM._epsilonEqual,
         'vec<N>,vec<N>': function(a,b,ep) {
            var eq = this['float,float'];
            var ret = glm.bvecN();
            for(var i=0; i < N; i++)
               ret[i] = eq(a[i],b[i],ep);
            return ret;
         },
         //'bvec<N>,bvec<N>': function(a,b,ep) { return this['vecN,vecN'](a,b,ep); },
         'ivec<N>,ivec<N>': function(a,b,ep) { return this['vecN,vecN'](a,b,ep); },
         'uvec<N>,uvec<N>': function(a,b,ep) { return this['vecN,vecN'](a,b,ep); },
         'quat,quat': function(a,b,ep) {
            var eq = this['float,float'];
            var ret = glm.bvec4();
            for(var i=0; i < 4; i++)
               ret[i] = eq(a[i],b[i],ep);
            return ret;
         },
         'mat<N>,mat<N>': function(a,b,ep) {
            throw new GLM.GLMJSError("error: 'epsilonEqual' only accept floating-point and integer scalar or vector inputs");
         }
      }

   });

GLM.$template.extend(
   GLM, GLM.$template['declare<T>'](
   {
      degrees: {
         "float": function(n) { return this.GLM._degrees(n); },
         "vec<N>": function(o) {
            return new this.GLM.vecN(this.GLM.$to_array(o).map(this.GLM._degrees));
         }
      },
      radians: {
         "float": function(n) { return this.GLM._radians(n); },
         "vec<N>": function(o) {
            return new this.GLM.vecN(this.GLM.$to_array(o).map(this.GLM._radians));
         }
      },
      sign: {
         "null":function() { return 0; },
         "undefined": function() { return NaN; },
         "string": function() { return NaN; },
         "float": function(n) { return GLM._sign(n); },
         "vec<N>": function(o) {
            return new GLM.vecN(GLM.$to_array(o).map(GLM._sign));
         },
         "ivec<N>": function(o) {
            return new GLM.ivecN(GLM.$to_array(o).map(GLM._sign));
         }
      },
      abs: {
         "float": function(n) { return GLM._abs(n); },
         "vec<N>": function(o) {
            return new GLM.vecN(GLM.$to_array(o).map(GLM._abs));
         }
      },
      fract: {
         "float": function(n) { return GLM._fract(n); },
         "vec<N>": function(o) {
            return new GLM.vecN(GLM.$to_array(o).map(GLM._fract));
         }
      },
      all: {
         "vec<N>": function(o) { return N === GLM.$to_array(o).filter(Boolean).length; },
         "bvec<N>": function(o) { return N === GLM.$to_array(o).filter(Boolean).length; },
         "ivec<N>": function(o) { return N === GLM.$to_array(o).filter(Boolean).length; },
         "uvec<N>": function(o) { return N === GLM.$to_array(o).filter(Boolean).length; },
         "quat": function(o) { return 4 === GLM.$to_array(o).filter(Boolean).length; }

      },

      $to_object: {
         "vec2": function(v) { return {x:v.x, y:v.y}; },
         "vec3": function(v) { return {x:v.x, y:v.y, z:v.z}; },
         "vec4": function(v) { return {x:v.x, y:v.y, z:v.z, w:v.w}; },
         "uvec2":function(v) { return {x:v.x, y:v.y}; },
         "uvec3":function(v) { return {x:v.x, y:v.y, z:v.z}; },
         "uvec4":function(v) { return {x:v.x, y:v.y, z:v.z, w:v.w}; },
         "ivec2":function(v) { return {x:v.x, y:v.y}; },
         "ivec3":function(v) { return {x:v.x, y:v.y, z:v.z}; },
         "ivec4":function(v) { return {x:v.x, y:v.y, z:v.z, w:v.w}; },
         "bvec2":function(v) { return {x:!!v.x, y:!!v.y}; },
         "bvec3":function(v) { return {x:!!v.x, y:!!v.y, z:!!v.z}; },
         "bvec4":function(v) { return {x:!!v.x, y:!!v.y, z:!!v.z, w:!!v.w}; },
         "quat": function(v) { return {w:v.w, x:v.x, y:v.y, z:v.z}; },
         "mat3": function(v) { return {0:this.vec3(v[0]),
                                       1:this.vec3(v[1]),
                                       2:this.vec3(v[2])}; },
         "mat4": function(v) { return {0:this.vec4(v[0]),
                                       1:this.vec4(v[1]),
                                       2:this.vec4(v[2]),
                                       3:this.vec4(v[3])}; }
      },

       // adapted from OpenGL Mathematics (glm.g-truc.net) glm/gtc/quaternion.inl
       roll: {
           $atan2: Math.atan2,
           'quat': function(q) {
		       return (this.$atan2((2) * (q.x * q.y + q.w * q.z), q.w * q.w + q.x * q.x - q.y * q.y - q.z * q.z));
	       }
       },
       pitch: {
           $atan2: Math.atan2,
           'quat': function(q) {
		       return (this.$atan2((2) * (q.y * q.z + q.w * q.x), q.w * q.w - q.x * q.x - q.y * q.y + q.z * q.z));
	       }
       },
       yaw: {
           $asin: Math.asin,
           'quat': function(q) {
		       //return this.$asin((-2) * (q.x * q.z - q.w * q.y));
               // GLM 0.9.8 fix for NaN
               return this.$asin(this.GLM.clamp((-2) * (q.x * q.z - q.w * q.y), (-1), (1)));
	       }
       },
       eulerAngles: {
           'quat': function(x) {
               return this.GLM.vec3(this.GLM.pitch(x), this.GLM.yaw(x), this.GLM.roll(x));
           }
       }
       /// glm/gtc/quaternion.inl
   }),
   GLM.$template['declare<T,...>'](
      {
         $from_glsl: {
            'string': function(v, returnType) {
               var ret;
               v.replace(/^([$\w]+)\(([-.0-9ef, ]+)\)$/,
                      function(_,what, dat) {
                         var type = glm[what] || glm['$'+what];
                         if (!type) throw new GLM.GLMJSError("glsl decoding issue: unknown type '"+what+"'");
                         ret = dat.split(',').map(parseFloat);
                         if (!returnType || returnType === type)
                            ret = type.apply(glm, ret);
                         else if (returnType === true || returnType === Array) {
                             while (ret.length < type.componentLength)
                                 ret.push(ret[ret.length-1]);
                             return ret;
                         } else throw new GLM.GLMJSError("glsl decoding issue: second argument expected to be undefined|true|Array");
                      });
               return ret;
            }
         },

         $to_glsl: {
            "vec<N>": function(v, opts) {
               var arr = GLM.$to_array(v);
               if (opts && typeof opts === 'object' && "precision" in opts)
                  arr = arr.map(function(_) { return _.toFixed(opts.precision); });
               // un-expand identical trailing values
               while(arr.length && arr[arr.length-2] === arr[arr.length-1])
                  arr.pop();
               return v.$type+"("+arr+")";
            },
            "uvec<N>": function(v, opts) { return this.vecN(v, opts); },// will pick up "uvecN" from $type
            "ivec<N>": function(v, opts) { return this.vecN(v, opts); },// will pick up "ivecN" from $type
            "bvec<N>": function(v, opts) { return this.vecN(v, opts); },// will pick up "bvecN" from $type
            quat: function(q, opts) { // note: quat()s aren't actually available in GLSL yet
               var precision;
               if (opts && typeof opts === 'object' && "precision" in opts) precision = opts.precision;
               if((q.x+q.y+q.z)===0)
                  return "quat("+(precision === undefined ? q.w : q.w.toFixed(precision))+")";
               return this.vec4(q, opts);
               //return "quat("+GLM.$to_array(q)+")";
            },
            'mat<N>': function(M, opts) {
               var precision;
               if (opts && typeof opts === 'object' && "precision" in opts) precision = opts.precision;
               // FIXME: this could fail on particular diagonals that sum to N
               var m=GLM.$to_array(M);
               if (precision !== undefined)
                  m = m.map(function(_) { return _.toFixed(precision); });
               var ss=m.reduce(function(s,e){return s+1*e; },0);
               if (ss === m[0]*N) return "matN("+m[0]+")";
               return "matN("+m+")";
            }
         },

         frexp: {
            "float": function(val,arrptr) {
               return arguments.length === 1 ?
                  this['float,undefined'](val) :
                  this['float,array'](val, arrptr);
            },
            "vec<N>": function(fvec, ivec) {
               if (arguments.length < 2)
                  throw new GLM.GLMJSError('frexp(vecN, ivecN) expected ivecN as second parameter');
               return GLM.vecN(
                  GLM.$to_array(fvec).map(
                     function(x,_) {
                        var mantissa_exp = GLM._frexp(x);
                        ivec[_] = mantissa_exp[1];
                        return mantissa_exp[0];
                     })
               );
            },
            // referenced here only (from float/vec<N>)
            "float,undefined": function(val) {
               return GLM._frexp(val);
            },
            "float,array": function(val,arr) {
               return GLM._frexp(val, arr);
            }
         },
         ldexp: {
            "float": GLM._ldexp,
            "vec<N>": function(fvec, ivec) {
               return GLM.vecN(
                  GLM.$to_array(fvec).map(
                     function(x,_) {
                        return GLM._ldexp(x,ivec[_]);
                     })
               );
            }
         }
      }
   )
);

GLM.$template['declare<T,V,...>'](
   {
      rotate: {
         'float,vec3': function(theta, axis) {
            return this.GLM.$outer.mat4_angleAxis(theta, axis);
         },
         'mat4,float': function(mat, theta, vec) {
            return mat.mul(this.GLM.$outer.mat4_angleAxis(theta, vec));
         }
      },
       scale: {
           $outer: GLM.$outer,
           'mat4,vec3': function(mat, v) {
               return mat.mul(this.$outer.mat4_scale(v));
           },
           'vec3,undefined': function(v) { return this.$outer.mat4_scale(v); }
      },
      translate: {
         'mat4,vec3': function(mat, v) {
            return mat.mul(this.GLM.$outer.mat4_translation(v));
         },
         'vec3,undefined': function(v) { return this.GLM.$outer.mat4_translation(v); }
      },
      angleAxis: {
         'float,vec3': function(angle, axis) {
            return this.GLM.$outer.quat_angleAxis(angle, axis);
         }
         // GLM 0.9.5 supported this signature, but 0.9.6 dropped it
         //'float,float':  function(angle,x,y,z) {
         //   return GLM.$outer.quat_angleAxis(angle, glm.vec3(x,y,z));
         //}
      },
      min: {
         "float,float": function(a,b) { return this.GLM._min(a,b); },
         "vec<N>,float": function(o,b) {
             return new this.GLM.vecN(this.GLM.$to_array(o).map(function(v){ return this.GLM._min(v,b); }.bind(this)));
         }
      },
      max: {
         "float,float": function(a,b) { return this.GLM._max(a,b); },
         "vec<N>,float": function(o,b) {
            return new this.GLM.vecN(this.GLM.$to_array(o).map(function(v){ return this.GLM._max(v,b); }.bind(this)));
         }
      },
      equal: {
         'float,float': GLM._equal,
         'vec<N>,vec<N>': function(a,b) {
            var eq = this['float,float'];
            var ret = glm.bvecN();
            for(var i=0; i < N; i++)
               ret[i] = eq(a[i],b[i]);
            return ret;
         },
         'bvec<N>,bvec<N>': function(a,b) { return this['vecN,vecN'](a,b); },
         'ivec<N>,ivec<N>': function(a,b) { return this['vecN,vecN'](a,b); },
         'uvec<N>,uvec<N>': function(a,b) { return this['vecN,vecN'](a,b); },
         'quat,quat': function(a,b) {
            var eq = this['float,float'];
            var ret = glm.bvec4();
            for(var i=0; i < 4; i++)
               ret[i] = eq(a[i],b[i]);
            return ret;
         }
      },

       // adapted from OpenGL Mathematics (glm.g-truc.net) glm/gtx/quaternion.inl
       _slerp: {
           'quat,quat': function(x, y, a) {
		       var z = y;

		       var cosTheta = glm.dot(glm.vec4(x), glm.vec4(y));

		       // If cosTheta < 0, the interpolation will take the long way around the sphere.
		       // To fix this, one quat must be negated.
		       if (cosTheta < (0))
		       {
			       z        = y.mul(-1);
			       cosTheta = -cosTheta;
		       }

		       // Perform a linear interpolation when cosTheta is close to 1 to avoid side effect of sin(angle) becoming a zero denominator
		       if(cosTheta > (1) - glm.epsilon())
		           {
			           // Linear interpolation
			           return glm.quat(
				           glm.mix(x.w, z.w, a),
				           glm.mix(x.x, z.x, a),
				           glm.mix(x.y, z.y, a),
				           glm.mix(x.z, z.z, a));
		           }
		           else
		       {
			       // Essential Mathematics, page 467
			       var angle = Math.acos(cosTheta);
			       return (x.mul(Math.sin((1 - a) * angle))  + z.mul(Math.sin(a * angle))) / Math.sin(angle);
		       }
	       }
       },
       rotation: {
         'vec3,vec3': function(orig, dest) {
            var cosTheta = this.$dot(orig, dest);
             var rotationAxis = new (orig.constructor)(new (orig.elements.constructor)(3));

            if(cosTheta >= 1 - this.$epsilon)
               return this.$quat();

            if(cosTheta < -1 + this.$epsilon)
               {
                  // special case when vectors in opposite directions :
                  // there is no "ideal" rotation axis
                  // So guess one; any will do as long as it's perpendicular to start
                  // This implementation favors a rotation around the Up axis (Y),
                  // since it's often what you want to do.
                  rotationAxis = this.$cross(this.$m[2], orig); //glm.vec3(0, 0, 1)
                  if(this.$length2(rotationAxis) < this.$epsilon) // bad luck, they were parallel, try again!
                     rotationAxis = this.$cross(this.$m[0], orig);//glm.vec3(1, 0, 0)

                  rotationAxis = this.$normalize(rotationAxis);
                  return this.$angleAxis(this.$pi, rotationAxis);
               }

            // Implementation from Stan Melax's Game Programming Gems 1 article
            rotationAxis = this.$cross(orig, dest);

            var s = this.$sqrt(((1) + cosTheta) * (2));
            var invs = (1) / s;

            return this.$quat(
               s * (0.5),
               rotationAxis.x * invs,
               rotationAxis.y * invs,
               rotationAxis.z * invs);
         }
       }, /// glm/gtx/quaternion.inl

       project: {
           // adapted from OpenGL Mathematics (glm.g-truc.net) glm/gtc/matrix_transform.inl
           'vec3,mat4': function project(obj, model, proj, viewport) {
		       var tmp = glm.vec4(obj, (1));
		       tmp = model ['*']( tmp );
		       tmp = proj ['*']( tmp );

		       tmp ['/=']( tmp.w );
		       tmp = tmp ['*'] (0.5) ['+'] (0.5);
		       tmp[0] = tmp[0] * (viewport[2]) + (viewport[0]);
		       tmp[1] = tmp[1] * (viewport[3]) + (viewport[1]);

		       return glm.vec3(tmp);
	       } /// glm/gtc/matrix_transform.inl
       },
       unProject: {
           // adapted from OpenGL Mathematics (glm.g-truc.net) glm/gtc/matrix_transform.inl
           'vec3,mat4': function unProject(win, model, proj, viewport) {
		       var Inverse = glm.inverse(proj ['*']( model ));

		       var tmp = glm.vec4(win, (1));
		       tmp.x = (tmp.x - (viewport[0])) / (viewport[2]);
		       tmp.y = (tmp.y - (viewport[1])) / (viewport[3]);
		       tmp = tmp ['*']( (2) ) ['-'](glm.vec4(1));

		       var obj = Inverse ['*']( tmp );
		       obj['/=']( obj.w );

		       return glm.vec3(obj);
	       } /// glm/gtc/matrix_transform.inl
       },
       orientedAngle: {
           // adapted from OpenGL Mathematics (glm.g-truc.net) glm/gtx/vector_angle.inl
           'vec3,vec3': function orientedAngle(x,y,ref) {
		       var Angle = Math.acos(glm.clamp(glm.dot(x, y), (0), (1)));
		       return glm.mix(Angle, -Angle, glm.dot(ref, glm.cross(x, y)) < 0 ? 1 : 0);
           } /// glm/gtx/vector_angle.inl
       }
   });

// like glm.to_string; tho this also supports rounding to a precision
GLM.$to_string = GLM.$template['declare<T,...>'](
   {
      $to_string: {
         "function": function(func) {
            return "[function "+(func.name||"anonymous")+"]";
         },
         "ArrayBuffer": function(b) {
            return "[object ArrayBuffer "+JSON.stringify({byteLength: b.byteLength})+"]";
         },
         "Float32Array": function(b) {
            return "[object Float32Array "+JSON.stringify({length: b.length, byteOffset: b.byteOffset, byteLength: b.byteLength, BPE: b.BYTES_PER_ELEMENT})+"]";
         },
         "float": function(what, opts) {
            return GLM.$toFixedString("float", { value: what }, ['value'], opts && opts.precision);
         },
         string: function(what) { return what; },
         bool: function(what) { return 'bool('+what+')'; },
         'vec<N>': function(what, opts) {
            return GLM.$toFixedString(what.$type_name, what, what.$components, opts && opts.precision);
         },
         'uvec<N>': function(what, opts) {
            var prec = (opts && typeof opts === 'object' && opts.precision) || 0;
            return GLM.$toFixedString(what.$type_name, what, what.$components, prec);
            //return what.$type_name+"("+glm.$to_array(what)+")";
         },
         'ivec<N>': function(what, opts) {
            var prec = (opts && typeof opts === 'object' && opts.precision) || 0;
            return GLM.$toFixedString(what.$type_name, what, what.$components, prec);
         },
         'bvec<N>': function(what, opts) {
            return what.$type_name+'('+GLM.$to_array(what).map(Boolean).join(', ')+')';
         },
         'mat<N>': function(what, opts) {
            var ret = [0,1,2,3].slice(0,N)
            .map(function(_) { return what[_]; }) // into columns
            .map(function(wi) { // each column's vecN
                    return GLM.$toFixedString("\t", wi, wi.$components, opts && opts.precision);
                 });
            return what.$type_name + '(\n'+ ret.join(", \n") +"\n)";
         },
         quat: function(what, opts) {
            what = GLM.degrees(GLM.eulerAngles(what));
            return GLM.$toFixedString("<quat>"+what.$type_name, what, ['x','y','z'], opts && opts.precision);
         }
      }
   }).$to_string;

GLM.$template['declare<T,V,...>'](
   {
      copy: {
         $op: '=',
         'vec<N>,vec<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'vec<N>,array<N>': function(me,you) { me.elements.set(you); return me; },
         'vec<N>,uvec<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'vec<N>,ivec<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'vec<N>,bvec<N>': function(me,you) { me.elements.set(you.elements); return me; },

         'uvec<N>,uvec<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'uvec<N>,array<N>': function(me,you) { me.elements.set(you); return me; },
         'uvec<N>,vec<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'uvec<N>,ivec<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'uvec<N>,bvec<N>': function(me,you) { me.elements.set(you.elements); return me; },

         'ivec<N>,ivec<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'ivec<N>,array<N>': function(me,you) { me.elements.set(you); return me; },
         'ivec<N>,vec<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'ivec<N>,uvec<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'ivec<N>,bvec<N>': function(me,you) { me.elements.set(you.elements); return me; },

         'bvec<N>,ivec<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'bvec<N>,array<N>': function(me,you) { me.elements.set(you); return me; },
         'bvec<N>,vec<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'bvec<N>,uvec<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'bvec<N>,bvec<N>': function(me,you) { me.elements.set(you.elements); return me; },

         'quat,quat': function(me,you) { me.elements.set(you.elements); return me; },
         'mat<N>,mat<N>': function(me,you) { me.elements.set(you.elements); return me; },
         'mat<N>,array<N>': function(me,you) {
            you = you.reduce(function(a,b) {
                                if (!a.concat) throw new GLM.GLMJSError("matN,arrayN -- [[.length===4] x 4] expected");
                                return a.concat(b);
                             });
            if (you === N) throw new GLM.GLMJSError("matN,arrayN -- [[N],[N],[N],[N]] expected");
            return me['='](you);
         },
         'mat<N>,array<N*N>': function(me,you) { me.elements.set(you); return me; },
         'mat4,array9': function(me,you) { me.elements.set(new GLM.mat4(you).elements); return me; }
      },
      sub: {
         $op: '-',
         _sub: function(me,you) {
            return (this.GLM.$to_array(me).map(function(v,_) { return v - you[_]; }));
         },
         'vec<N>,vec<N>': function(me,you) { return new this.GLM.vecN(this._sub(me,you)); },
         'vec<N>,uvec<N>': function(me,you) { return new this.GLM.vecN(this._sub(me,you)); },
         'uvec<N>,uvec<N>': function(me,you) { return new this.GLM.uvecN(this._sub(me,you)); },
         'uvec<N>,ivec<N>': function(me,you) { return new this.GLM.uvecN(this._sub(me,you)); },
         'vec<N>,ivec<N>': function(me,you) { return new this.GLM.vecN(this._sub(me,you)); },
         'ivec<N>,uvec<N>': function(me,you) { return new this.GLM.ivecN(this._sub(me,you)); },
         'ivec<N>,ivec<N>': function(me,you) { return new this.GLM.ivecN(this._sub(me,you)); }
      },
      sub_eq: {
         $op: '-=',
          'vec<N>,vec<N>': function(me,you) {
              var a = me.elements, b = you.elements;
              for(var i=0; i < N; i++)
                  a[i] = a[i] - b[i];
              return me;
         },
         'vec<N>,uvec<N>': function(me,you) { return this['vecN,vecN'](me,you); },
         'uvec<N>,uvec<N>': function(me,you) { return this['vecN,vecN'](me,you); },
         'uvec<N>,ivec<N>': function(me,you) { return this['vecN,vecN'](me,you); },
         'vec<N>,ivec<N>': function(me,you) { return this['vecN,vecN'](me,you); },
         'ivec<N>,ivec<N>': function(me,you) { return this['vecN,vecN'](me,you); },
         'ivec<N>,uvec<N>': function(me,you) { return this['vecN,vecN'](me,you); }
      },
      add: {
         $op: '+',
         _add: function(me,you) {
            return (this.GLM.$to_array(me).map(function(v,_) { return v + you[_]; }));
         },
         'vec<N>,float': function(me,you) { return new this.GLM.vecN(this._add(me,[you,you,you,you])); },
         'vec<N>,vec<N>': function(me,you) { return new this.GLM.vecN(this._add(me,you)); },
         'vec<N>,uvec<N>': function(me,you) { return new this.GLM.vecN(this._add(me,you)); },
         'uvec<N>,uvec<N>': function(me,you) { return new this.GLM.uvecN(this._add(me,you)); },
         'uvec<N>,ivec<N>': function(me,you) { return new this.GLM.uvecN(this._add(me,you)); },
         'vec<N>,ivec<N>': function(me,you) { return new this.GLM.vecN(this._add(me,you)); },
         'ivec<N>,ivec<N>': function(me,you) { return new this.GLM.ivecN(this._add(me,you)); },
         'ivec<N>,uvec<N>': function(me,you) { return new this.GLM.ivecN(this._add(me,you)); }
      },
      add_eq: {
         $op: '+=',
         'vec<N>,vec<N>': function(me,you) {
             var a = me.elements, b = you.elements;
             for(var i=0; i < N; i++)
                 a[i] = a[i] + b[i];
             return me;
           //this.GLM.$to_array(me).map(function(v,_) { return me.elements[_] = v + you[_]; });
         },
         'vec<N>,uvec<N>': function(me,you) { return this['vecN,vecN'](me,you); },
         'uvec<N>,uvec<N>': function(me,you) { return this['vecN,vecN'](me,you); },
         'uvec<N>,ivec<N>': function(me,you) { return this['vecN,vecN'](me,you); },
         'vec<N>,ivec<N>': function(me,you) { return this['vecN,vecN'](me,you); },
         'ivec<N>,ivec<N>': function(me,you) { return this['vecN,vecN'](me,you); },
         'ivec<N>,uvec<N>': function(me,you) { return this['vecN,vecN'](me,you); }
      },
      div: {
         $op: '/',
         'vec<N>,float': function(me, k) {
            return new this.GLM.vecN(
               this.GLM.$to_array(me).map(function(v,_) { return v / k; })
            );
         }
      },
      div_eq: {
         $op: '/=',
         'vec<N>,float': function(me, k) {
            for(var i=0; i < N ; i++)
              me.elements[i] /= k;
            return me;
         }
      },
      mul: {
         $op: '*',
         'vec<N>,vec<N>': function(me, you) {
            return new this.GLM.vecN(
                this.GLM.$to_array(me).map(function(v,_) { return v  * you[_]; })
            );
         }
      },
      eql_epsilon: (
         function(epsilonEqual) {
            return {
               $op: '~=',
               'vec<N>,vec<N>': epsilonEqual,
               'mat<N>,mat<N>': epsilonEqual,
               'quat,quat': epsilonEqual,
               'uvec<N>,uvec<N>': epsilonEqual,
               'ivec<N>,ivec<N>': epsilonEqual
            };
         }
      )(function epsilonEqualAB(a,b) { return this.GLM.all(this.GLM.epsilonEqual(a,b,this.GLM.epsilon())); }),
      eql: (
         function(equal) {
            return {
               $op: '==',
               'mat<N>,mat<N>': function(me,you) {
                  return you.elements.length === glm.$to_array(me)
                     .filter(function(v,_) { return v === you.elements[_]; }).length;
               },
               'vec<N>,vec<N>': equal,
               'quat,quat': equal,
               'uvec<N>,uvec<N>': equal,
               'ivec<N>,ivec<N>': equal,
               'bvec<N>,bvec<N>': equal
            };
         }
      )(function equalAB(a,b) { return GLM.all(GLM.equal(a,b)); })
   });

// ----------------------------------------------------------------------------
// typeof support for catch-all to_string()
GLM['string'] = {
   $type_name: "string", $: {  }
};
GLM['number'] = {
   $type_name: "float", $: {  }
};
GLM['boolean'] = {
   $type: 'bool', $type_name: "bool", $: {  }
};

// ----------------------------------------------------------------------------
GLM.vec2 = GLM.$template.GLMType(
   'vec2',
   {
      name: 'fvec2',
      identity: [0,0],
      components: [ 'xy', '01' ],
      'undefined0': function() { return this.identity; },
      'number1': function(x) {
         return [x,x];
      },
      'number2': function(x,y) {
         return [x,y];
      },
      'object1': function(o) {
         if (o!==null)
         switch(o.length){
         case 4: // vec4 -> vec2 reduction
         case 3: // vec3 -> vec2 reduction
         case 2: return [o[0], o[1]];
         default:
               if ("y" in o && "x" in o) {
                  if (typeof o.x !== typeof o.y)
                     throw new GLM.GLMJSError('unrecognized .x-ish object passed to GLM.vec2: '+o);
                  if (typeof o.x === 'string') // coerce into numbers
                     return [o.x*1, o.y*1];
                  return [o.x, o.y];
               }
         }
         throw new GLM.GLMJSError('unrecognized object passed to GLM.vec2: '+o);
      }
   }); // GLM.vec2.$
// ----------------------------------------------------------------------------
GLM.uvec2 = GLM.$template.GLMType(
   'uvec2',
   {
      name: 'uvec2',
      identity: [0,0],
      components: [ 'xy', '01' ],
      _clamp: function(x) { return ~~x; }, // match observed GLM C++ behavior
      'undefined0': function() { return this.identity; },
      'number1': function(x) {
         x=this._clamp(x);
         return [x,x];
      },
      'number2': function(x,y) {
         x=this._clamp(x);
         y=this._clamp(y);
         return [x,y];
      },
      'object1': function(o) {
         switch(o.length){
         case 4: // vec4 -> vec2 reduction
         case 3: // vec3 -> vec2 reduction
         case 2: return [o[0], o[1]].map(this._clamp);
         default:
               if ("y" in o && "x" in o) {
                  if (typeof o.x !== typeof o.y) throw new GLM.GLMJSError('unrecognized .x-ish object passed to GLM.'+this.name+': '+o);
                  return [o.x, o.y].map(this._clamp);
               }
         }
         throw new GLM.GLMJSError('unrecognized object passed to GLM.'+this.name+': '+o);
      }
   }); // GLM.uvec2.$

// ----------------------------------------------------------------------------
GLM.vec3 = GLM.$template.GLMType(
   'vec3',
   {
      name: 'fvec3',
      identity: [0,0,0],
      components: [ 'xyz', '012', 'rgb' ],
      'undefined0': function() { return GLM.vec3.$.identity; },
      'number1': function(x) {
         return [x,x,x];
      },
      'number2': function(x,y) {
         return [x,y,y];
      },
      'number3': function(x,y,z) {
         return [x,y,z];
      },
       Error: GLM.GLMJSError,
      'object1': function(o) {
         if (o) {
            switch(o.length){
            case 4: // vec4 -> vec3 reduction
            case 3: return [o[0], o[1], o[2]];
            case 2: return [o[0], o[1], o[1]];
            default:
                  if ("z" in o /*&& "y" in o*/ && "x" in o) {
                     if (typeof o.x !== typeof o.y)
                        throw new this.Error('unrecognized .x-ish object passed to GLM.vec3: '+o);
                     if (typeof o.x === 'string') // coerce into numbers
                        return [o.x*1, o.y*1, o.z*1];
                     return [o.x, o.y, o.z];
                  }
            }
         }
         throw new this.Error('unrecognized object passed to GLM.vec3: '+o);
      },
      'object2': function(o,z) {
         if (o instanceof GLM.vec2 || o instanceof GLM.uvec2 || o instanceof GLM.ivec2 || o instanceof GLM.bvec2)
            return [o.x, o.y, z];
         throw new GLM.GLMJSError('unrecognized object passed to GLM.vec3(o,z): '+[o,z]);
      }
   }); // GLM.vec3.$

// ----------------------------------------------------------------------------
GLM.uvec3 = GLM.$template.GLMType(
   'uvec3',
   {
      name: 'uvec3',
      identity: [0,0,0],
      components: [ 'xyz', '012' ],
      _clamp: GLM.uvec2.$._clamp,
      'undefined0': function() { return this.identity; },
      'number1': function(x) {
         x=this._clamp(x);
         return [x,x,x];
      },
      'number2': function(x,y) {
         x=this._clamp(x);
         y=this._clamp(y);
         return [x,y,y];
      },
      'number3': function(x,y,z) {
         x=this._clamp(x);
         y=this._clamp(y);
         z=this._clamp(z);
         return [x,y,z];
      },
      'object1': function(o) {
         if (o) {
            switch(o.length){
            case 4: // vec4 -> vec3 reduction
            case 3: return [o[0], o[1], o[2]].map(this._clamp);
            case 2: return [o[0], o[1], o[1]].map(this._clamp);
            default:
                  if ("z" in o /*&& "y" in o*/ && "x" in o) {
                     if (typeof o.x !== typeof o.y)
                        throw new GLM.GLMJSError('unrecognized .x-ish object passed to GLM.'+this.name+': '+o);
                     return [o.x, o.y, o.z].map(this._clamp);
                  }
            }
         }
         throw new GLM.GLMJSError('unrecognized object passed to GLM.'+this.name+': '+o);
      },
      'object2': function(o,z) {
         if (o instanceof GLM.vec2)
            return [o.x, o.y, z].map(this._clamp);
         if (o instanceof GLM.uvec2 || o instanceof GLM.ivec2 || o instanceof GLM.bvec2)
            return [o.x, o.y, this._clamp(z)];

         throw new GLM.GLMJSError('unrecognized object passed to GLM.'+this.name+'(o,z): '+[o,z]);
      }
   }); // GLM.uvec3.$

// ----------------------------------------------------------------------------

GLM.vec4 = GLM.$template.GLMType(
   'vec4',
   {
      name: 'fvec4',
      identity: [0,0,0,0],
      components: ['xyzw','0123','rgba'],
      'undefined0': function() { return this.identity; },
      'number1': function(x) {
         return [x,x,x,x];
      },
      'number2': function(x,y) {
         return [x,y,y,y];
      },
      'number3': function(x,y,z) {
         return [x,y,z,z];
      },
      'number4': function(x,y,z,w) {
         return [x,y,z,w];
      },
      Error: GLM.GLMJSError,
      'object1': function(o) {
         if (o) {
            switch(o.length){
            case 4: return [o[0], o[1], o[2], o[3]];
            case 3: return [o[0], o[1], o[2], o[2]];
            case 2: return [o[0], o[1], o[1], o[1]];
            default:
                  if ("w" in o /*&& "z" in o && "y" in o*/ && "x" in o)  {
                     if (typeof o.x !== typeof o.w)
                        throw new this.Error('unrecognized .x-ish object passed to GLM.vec4: '+o);
                     if (typeof o.x === 'string') // coerce into numbers
                        return [o.x*1, o.y*1, o.z*1, o.w*1];
                     return [o.x, o.y, o.z, o.w];
                  }
            }
         }
         throw new this.Error('unrecognized object passed to GLM.vec4: '+[o,o&&o.$type]);
      },
      $GLM: GLM,
      'object2': function(o,w) {
         if (o instanceof this.$GLM.vec3 || o instanceof this.$GLM.uvec3 || o instanceof this.$GLM.ivec3 || o instanceof this.$GLM.bvec3)
            return [o.x, o.y, o.z, w];
         throw new this.$GLM.GLMJSError('unrecognized object passed to GLM.vec4(o,w): '+[o,w]);
      },
      'object3': function(o,z,w) {
         if (o instanceof this.$GLM.vec2 || o instanceof this.$GLM.uvec2 || o instanceof this.$GLM.ivec2 || o instanceof this.$GLM.bvec2)
            return [o.x, o.y, z, w];
         throw new this.$GLM.GLMJSError('unrecognized object passed to GLM.vec4(o,z,w): '+[o,z,w]);
      }
   }
); // GLM.vec4.$

// ----------------------------------------------------------------------------

GLM.uvec4 = GLM.$template.GLMType(
   'uvec4',
   {
      name: 'uvec4',
      identity: [0,0,0,0],
      components: [ 'xyzw', '0123' ],
      _clamp: GLM.uvec2.$._clamp,
      'undefined0': function() { return this.identity; },
      'number1': function(x) {
         x=this._clamp(x);
         return [x,x,x,x];
      },
      'number2': function(x,y) {
         x=this._clamp(x);
         y=this._clamp(y);
         return [x,y,y,y];
      },
      'number3': function(x,y,z) {
         x=this._clamp(x);
         y=this._clamp(y);
         z=this._clamp(z);
         return [x,y,z,z];
      },
      'number4': function(x,y,z,w) {
         return [x,y,z,w].map(this._clamp);
      },
      Error: GLM.GLMJSError,
      'object1': function(o) {
         if (o) {
            switch(o.length){
            case 4: return [o[0], o[1], o[2], o[3]].map(this._clamp);
            case 3: return [o[0], o[1], o[2], o[2]].map(this._clamp);
            case 2: return [o[0], o[1], o[1], o[1]].map(this._clamp);
            default:
                  if ("w" in o /*&& "z" in o && "y" in o*/ && "x" in o) {
                     if (typeof o.x !== typeof o.y)
                        throw new this.Error('unrecognized .x-ish object passed to GLM.'+this.name+': '+o);
                     return [o.x, o.y, o.z, o.w].map(this._clamp);
                  }
            }
         }
         throw new GLM.GLMJSError('unrecognized object passed to GLM.'+this.name+': '+[o,o&&o.$type]);
      },
      'object2': function(o,w) {
         if (o instanceof GLM.vec3)
            return [o.x, o.y, o.z, w].map(this._clamp);
         if (o instanceof GLM.uvec3 || o instanceof GLM.ivec3 || o instanceof GLM.bvec3)
            return [o.x, o.y, o.z, this._clamp(w)];
         throw new GLM.GLMJSError('unrecognized object passed to GLM.'+this.name+'(o,w): '+[o,w]);
      },
      'object3': function(o,z,w) {
         if (o instanceof GLM.vec2)
            return [o.x, o.y, z, w].map(this._clamp);
         if (o instanceof GLM.uvec2 || o instanceof GLM.ivec2 || o instanceof GLM.bvec2)
            return [o.x, o.y, this._clamp(z), this._clamp(w)];
         throw new GLM.GLMJSError('unrecognized object passed to GLM.'+this.name+'(o,z,w): '+[o,z,w]);
      }
   }
); // GLM.uvec4.$

// ----------------------------------------------------------------------------
// observed GLM behavior is that ivec2 and uvec2 seem to behave identically
GLM.ivec2 = GLM.$template.GLMType(
   'ivec2', GLM.$template.extend({}, GLM.uvec2.$, { name: 'ivec2' })
);
GLM.ivec3 = GLM.$template.GLMType(
   'ivec3', GLM.$template.extend({}, GLM.uvec3.$, { name: 'ivec3' })
);
GLM.ivec4 = GLM.$template.GLMType(
   'ivec4', GLM.$template.extend({}, GLM.uvec4.$, { name: 'ivec4' })
);
// first-pass at bvec emulation
GLM.bvec2 = GLM.$template.GLMType(
   'bvec2', GLM.$template.extend(
      {}, GLM.uvec2.$, { name: 'bvec2',
                         'boolean1': GLM.uvec2.$.number1,
                         'boolean2': GLM.uvec2.$.number2
                       })
);
GLM.bvec3 = GLM.$template.GLMType(
   'bvec3', GLM.$template.extend(
      {}, GLM.uvec3.$, { name: 'bvec3',
                         'boolean1': GLM.uvec3.$.number1,
                         'boolean2': GLM.uvec3.$.number2,
                         'boolean3': GLM.uvec3.$.number3
                       })
);
GLM.bvec4 = GLM.$template.GLMType(
   'bvec4', GLM.$template.extend(
      {}, GLM.uvec4.$, { name: 'bvec4',
                         'boolean1': GLM.uvec4.$.number1,
                         'boolean2': GLM.uvec4.$.number2,
                         'boolean3': GLM.uvec4.$.number3,
                         'boolean4': GLM.uvec4.$.number4
                       })
);
GLM.bvec2.$._clamp = GLM.bvec3.$._clamp = GLM.bvec4.$._clamp =
    function _bclamp(x) { return !!x; };
// ----------------------------------------------------------------------------
GLM.mat3 = GLM.$template.GLMType(
   'mat3',
   {
      name: 'mat3x3',
      identity : [1, 0, 0,
                  0, 1, 0,
                  0, 0, 1],
      'undefined0' : function(M) { return this.identity; },
      'number1': function(n) {
         if (n === 1) {
            return this.identity;
         }
         return [n, 0, 0,
                 0, n, 0,
                 0, 0, n];
      },
      'number9': function(
         c1r1, c1r2, c1r3,
         c2r1, c2r2, c2r3,
         c3r1, c3r2, c3r3
      ) {
         return arguments;
      },
      Error: GLM.GLMJSError,
      $vec3: GLM.vec3,
      'object1': function(o) {
         if (o) {
            var m4 = o.elements || o;
            if (m4.length === 16) {
               return [ // mat4 -> mat3
                  m4[0+0], m4[0+1], m4[0+2],
                  m4[4+0], m4[4+1], m4[4+2],
                  m4[8+0], m4[8+1], m4[8+2]
               ];
            }
            if (m4.length === 9)
               return m4;
            // JSON-encoded objects may arrive this way: {"0":{"x": ...
            if (0 in m4 && 1 in m4 && 2 in m4  &&
                !(3 in m4) && typeof m4[2] === 'object' )
               return [
                  m4[0],m4[1],m4[2]
               ].map(this.$vec3.$.object1)
                .reduce(function(a,b) { return a.concat(b); });
         }
         throw new this.Error('unrecognized object passed to GLM.mat3: '+o);
      },
      'object3': function(c1,c2,c3) {
         return [c1,c2,c3].map(glm.$to_array)
            .reduce(function(a,b) { return a.concat(b); });
      }

   }); // GLM.mat3.$

// ----------------------------------------------------------------------------
GLM.mat4 = GLM.$template.GLMType(
   'mat4',
   {
      name: 'mat4x4',
      identity: [1, 0, 0, 0,
                 0, 1, 0, 0,
                 0, 0, 1, 0,
                 0, 0, 0, 1],
      'undefined0' : function() { return this.identity; },
      'number16': function(
         c1r1, c1r2, c1r3, c1r4,
         c2r1, c2r2, c2r3, c2r4,
         c3r1, c3r2, c3r3, c3r4,
         c4r1, c4r2, c4r3, c4r4
      ) {
         return arguments;
      },
      'number1' : function(n) {
         if (n === 1)
            return this.identity;
         return [n, 0, 0, 0,
                 0, n, 0, 0,
                 0, 0, n, 0,
                 0, 0, 0, n];
      },
      Error: GLM.GLMJSError,
      $vec4: GLM.vec4,
      'object1' : function(o) {
         var m4;
         if (o) {
            m4 = o.elements || o;
            if (m4.length === 9) {
               // mat3 -> mat4
               return [
                  m4[0+0], m4[0+1], m4[0+2], 0,
                  m4[3+0], m4[3+1], m4[3+2], 0,
                  m4[6+0], m4[6+1], m4[6+2], 0,
                  0      , 0      , 0      , 1
               ];
            }
            if (m4.length === 4 && m4[0] && m4[0].length === 4) {
               return m4[0].concat(m4[1],m4[2],m4[3]);
            }
            if (m4.length === 16)
               return m4;

            // JSON-encoded objects may arrive this way: {"0":{"x": ...
            if (0 in m4 && 1 in m4 && 2 in m4 && 3 in m4 &&
                !(4 in m4) && typeof m4[3] === 'object' )
               return [
                  m4[0],m4[1],m4[2],m4[3]
               ].map(this.$vec4.$.object1)
                .reduce(function(a,b) { return a.concat(b); });
      }
         throw new this.Error('unrecognized object passed to GLM.mat4: '+[o,m4&&m4.length]);
      },
      'object4': function(c1,c2,c3,c4) {
         return [c1,c2,c3,c4].map(glm.$to_array)
            .reduce(function(a,b) { return a.concat(b); });
      }

   }); // GLM.mat4.$


// ----------------------------------------------------------------------------

GLM.quat = GLM.$template.GLMType(
   'quat',
   {
      identity: [0,0,0,1],
      components: ['xyzw','0123'],
      'undefined0': function() { return this.identity; },
      'number1': function(w) {
         if (w !== 1)
            throw new Error('only quat(1) syntax supported for quat(number1 args)...');
         return this.identity;
      },
      'number4': function(w,x,y,z) {
         return [x,y,z,w];
      },
      $GLM: GLM,
      $M3: GLM.mat3(),
      $quat_array_from_zyx: function(o) {
         //TODO: optimizations?
         //var q = this.$GLM.quat();
         var M3 = this.$M3;
          return (
                 this.$GLM.$outer.quat_angleAxis(o.z, M3[2])
            .mul(this.$GLM.$outer.quat_angleAxis(o.y, M3[1]))
            .mul(this.$GLM.$outer.quat_angleAxis(o.x, M3[0]))
          ).elements;
      },
      'object1': function(o) {
         if (o) {
            if (o instanceof this.$GLM.mat4)
               return this.$GLM.$outer.quat_array_from_mat4(o);
            if (o.length === 4)
               return [o[0], o[1], o[2], o[3]];
            if (o instanceof this.$GLM.quat)
               return [o.x, o.y, o.z, o.w];
            if (o instanceof this.$GLM.vec3)
                return this.$quat_array_from_zyx(o);
            if ("w" in o && "x" in o) {
               if (typeof o.x === 'string') // coerce into numbers
                  return [o.x*1, o.y*1, o.z*1, o.w*1];
               return [o.x, o.y, o.z, o.w];
            }
         }
         throw new this.$GLM.GLMJSError('unrecognized object passed to GLM.quat.object1: '+[o,o&&o.$type, typeof o, o&&o.constructor]);
      }
   });


// ----------------------------------------------------------------------------
// indexers and swizzles
(function() {

    var rigswizzle = function(o, arr, visible, noswizzles) {
       var default_properties = {
           def: function(k,v) {
             //console.warn("okv", o.prototype, k, v);
             this[k] = v;
             Object.defineProperty(o.prototype, k, v);
          }
       };
       o.$properties = o.$properties || default_properties;
       var def = o.$properties.def.bind(o.$properties);

       //console.warn("rigswizzle", o.prototype.$type_name, arr);

       // indexer templates
       var indexers = [0,1,2,3].map(
          function(_) {
             return {
                enumerable: visible,
                get: function getter() { return this.elements[_]; },
                set: function setter(v) { this.elements[_] = v; }
             };
          });

       // wire-up new o.x, o.y etc.
       arr.forEach(function(a,_) { def(a, indexers[_]); });

       // swizzle (non-numeric, non-_) prop sets
       if (isNaN(arr[0]) && !/^_/.test(arr[0])) {

          var _arr = arr.slice();//clone
          // like .xyzw, ,.xyz, .xy
          var $subarray = GLM.$subarray;
          do {
             (function(p,vn,n) {
                 if (vn === 'quat') vn = 'vec'+n;
                 var glmtype = GLM[vn];
                 def(p, {
                        enumerable: false,
                        get: function getter() { return new glmtype($subarray(this.elements,0*n,(0+1)*n)); },//this.elements.subarray(0*n,(0+1)*n)); },
                        set: function setter(val) { return new glmtype($subarray(this.elements,0*n,(0+1)*n))['='](val); }
                     });
              })(_arr.join(""), o.prototype.$type.replace(/[1-9]$/, _arr.length), _arr.length);
          } while(_arr[1] != _arr.pop());

          if (noswizzles) return o.$properties;

          _arr = arr.slice();//clone

          // like .yz, .yzw, .zw
          // TODO: algorithmize
          var other = ({
                          'xyz': { yz: 1 },
                          'xyzw': { yzw: 1, yz: 1, zw: 2 }
                       })[_arr.join("")];
          if (other) {
             for(var p in other) {
                (function(p, vn, n, offset) {
                    def(p, {
                           enumerable: false,
                           get: function getter() { return new GLM[vn](GLM.$subarray(this.elements,0*n+offset,(0+1)*n+offset)); },
                           set: function setter(val) { return new GLM[vn](GLM.$subarray(this.elements,0*n+offset,(0+1)*n+offset))['='](val); }
                        });
                 })(p, o.prototype.$type.replace(/[1-9]$/, p.length), p.length, other[p]);
             }
          }
       };
       return o.$properties;
    };

    rigswizzle(GLM.vec2, GLM.vec2.$.components[0] /*xy*/, true);
    rigswizzle(GLM.vec2, GLM.vec2.$.components[1] /*01*/);

    rigswizzle(GLM.vec3, GLM.vec3.$.components[0] /*xyz*/, true);
    rigswizzle(GLM.vec3, GLM.vec3.$.components[1] /*012*/);
    rigswizzle(GLM.vec3, GLM.vec3.$.components[2] /*rgb*/);

    rigswizzle(GLM.vec4, GLM.vec4.$.components[0] /*xyzw*/, true);
    rigswizzle(GLM.vec4, GLM.vec4.$.components[1] /*0123*/);
    rigswizzle(GLM.vec4, GLM.vec4.$.components[2] /*rgba*/);

    // quat .wxyz
    rigswizzle(GLM.quat, GLM.quat.$.components[0] /*xyzw*/, true, "noswizzles");
    rigswizzle(GLM.quat, GLM.quat.$.components[1] /*0123*/);

    GLM.quat.$properties
       .def('wxyz', {
              enumerable: false,
              get: function() { return new GLM.vec4(this.w,this.x,this.y,this.z); },
              set: function(v) { v=GLM.vec4(v); return this['='](GLM.quat(v.x,v.y,v.z,v.w)); }
           });

    ['uvec2','uvec3','uvec4','ivec2','ivec3','ivec4','bvec2','bvec3','bvec4'].forEach(
       function(_vecN) {
          rigswizzle(GLM[_vecN], GLM[_vecN].$.components[0] /*xy[z][w]*/, true);
          rigswizzle(GLM[_vecN], GLM[_vecN].$.components[1] /*01[2][3]*/);
       });

    // rigswizzle(GLM.uvec2, GLM.uvec2.$.components[0] /*xy*/, true);
    // rigswizzle(GLM.uvec2, GLM.uvec2.$.components[1] /*01*/);
    // rigswizzle(GLM.uvec3, GLM.uvec3.$.components[0] /*xyz*/, true);
    // rigswizzle(GLM.uvec3, GLM.uvec3.$.components[1] /*012*/);
    // rigswizzle(GLM.uvec4, GLM.uvec4.$.components[0] /*xyzw*/, true);
    // rigswizzle(GLM.uvec4, GLM.uvec4.$.components[1] /*0123*/);

    // legacy THREE.js interop detection
    Object.defineProperty(GLM.quat.prototype, '_x', { get: function() { throw new Error('erroneous quat._x access'); } });

    // less common swizzle patterns
    var lesscommon = {
        2: {
            yx: {
                enumerable: false,
                get: function() { return new GLM.vec2(this.y,this.x); },
                set: function(v) { v=GLM.vec2(v); this.y = v[0]; this.x = v[1]; }
            }
        },
        3: {
            xz: {
                enumerable: false,
                get: function() { return new GLM.vec2(this.x,this.z); },
                set: function(v) { v=GLM.vec2(v); this.x = v[0]; this.z = v[1]; }
            },
            zx: {
                enumerable: false,
                get: function() { return new GLM.vec2(this.z,this.x); },
                set: function(v) { v=GLM.vec2(v); this.z = v[0]; this.x = v[1]; }
            },
            xzy: {
                enumerable: false,
                get: function() { return new GLM.vec3(this.x,this.z,this.y); },
                set: function(v) { v=GLM.vec3(v); this.x = v[0]; this.z = v[1]; this.y = v[2]; }
            }
        },
        4: {
            xw: {
                enumerable: false,
                get: function() { return new GLM.vec2(this.x,this.w); },
                set: function(v) { v=GLM.vec2(v); this.x = v[0]; this.w = v[1]; }
            },
            wz: {
                enumerable: false,
                get: function() { return new GLM.vec2(this.w,this.z); },
                set: function(v) { v=GLM.vec2(v); this.w = v[0]; this.z = v[1]; }
            },
            wxz: {
                enumerable: false,
                get: function() { return new GLM.vec3(this.w,this.x,this.z); },
                set: function(v) { v=GLM.vec3(v); this.w = v[0]; this.x = v[1]; this.z = v[2]; return this; }
            },
            xyw: {
                enumerable: false,
                get: function() { return new GLM.vec3(this.x,this.y,this.w); },
                set: function(v) { v=GLM.vec3(v); this.x = v[0]; this.y = v[1]; this.w = v[2]; return this; }
            },
            xzw: {
                enumerable: false,
                get: function() { return new GLM.vec3(this.x,this.z,this.w); },
                set: function(v) { v=GLM.vec3(v); this.x = v[0]; this.z = v[1]; this.w = v[2]; }
            },
            wxyz: {
                enumerable: false,
                get: function() { return new GLM.vec4(this.w,this.x,this.y,this.z); },
                set: function(v) { v=GLM.vec4(v); this.w = v[0]; this.x = v[1]; this.y = v[2]; this.z = v[3]; return this; }
            }
        }
    };
    for(var N in lesscommon) {
        for(var p in lesscommon[N]) {
            if (N <= 2)
                GLM.vec2.$properties.def(p, lesscommon[N][p])
            if (N <= 3)
                GLM.vec3.$properties.def(p, lesscommon[N][p])
            if (N <= 4)
                GLM.vec4.$properties.def(p, lesscommon[N][p])
        }
    }

    // cached NxN matrix column accessors
    var szfloat = GLM.$outer.Float32Array.BYTES_PER_ELEMENT;
    GLM.$partition = function cols(mat_prototype, vec, nrows, cache_prefix) {
       if (nrows === undefined) throw new GLM.GLMJSError('nrows is undefined');
       // mat column accessors -- eg: mat[0] as a read/write vec
       var vec_length = vec.$.identity.length;

       // if unspecified then assume square
       nrows = nrows || vec_length;

       //GLM.$outer.console.info("GLM.$partition", [vec_length,nrows].join("x"));
       var CACHEDBG = function(x) { GLM.$DEBUG > 3 && GLM.$outer.console.debug('CACHEDBG: '+x); };
       //var elements = mat_prototype.elements;
       var bytesper = szfloat * vec_length;
       for(var i=0; i < nrows; i++) {
          (function(index) {
              var offset = index * bytesper;
              var cache_index = cache_prefix && cache_prefix + index;
              var _index = index * vec_length;
             Object.defineProperty(
                mat_prototype, index,
                   { configurable: true,
                     enumerable: true,
                     set: function setter(o) {
                        if (o instanceof vec)
                           this.elements.set(o.elements, _index);
                        else if (o && o.length === vec_length) {
                           this.elements.set(o, _index);
                        } else
                        throw new GLM.GLMJSError("unsupported argtype to "+
                                             (mat_prototype&&mat_prototype.$type)+"["+index+'] setter: '+
                                             [typeof o,o]);
                     },
                     get: function getter() {
                        if (cache_prefix) {
                           if (this[cache_index]) {
                              if (!index) { CACHEDBG("cache hit "+cache_index); }
                              //Object.defineProperty(this, index, {configurable: true, enumerable: false, get: function() { return this[cache_index] }});
                              return this[cache_index];
                           }
                           if (!index) { CACHEDBG("cache miss "+cache_index); }
                        }
                        var t;
                        // this.elements.subarray (which can be reentrant)
                        // didn't work as reliably as new Float32Array(.buffer,...)
                        var v = new vec(
                           t = GLM.$subarray(this.elements, _index, _index + vec_length)
                        );
                        if(!(v.elements === t)) throw new GLM.GLMJSError("v.elements !== t "+[GLM.$subarray, v.elements.constructor=== t.constructor, v.elements.buffer === t.buffer])
                        //if(!(v.elements === t)) throw new GLM.GLMJSError("v.elements !== t");
                        if (cache_prefix) {
                           // defineProperty to mask from enumeration
                           Object.defineProperty(
                              this, cache_index,
                              {
                                 configurable: true,
                                 enumerable: false,
                                 value: v
                              });
                        }
                        return v;//this[cache_index];
                     }
                   });
           })(i);
       }
    };//GLM.$partition
    GLM.$partition(GLM.mat4.prototype, GLM.vec4, 4, '_cache_');
    GLM.$partition(GLM.mat3.prototype, GLM.vec3, 3, '_cache_');
 })(); //indexers and swizzlers

GLM.$dumpTypes = function(out) {
   GLM.$types.forEach(
      function(p) {
         if (GLM[p].componentLength) {
            out("GLM."+p, JSON.stringify(
                   {
                      '#type': GLM[p].prototype.$type_name,
                      '#floats': GLM[p].componentLength,
                      '#bytes': GLM[p].BYTES_PER_ELEMENT
                   }));
         }
      });
};

GLM.$init = function(hints) {
   if (hints.prefix)
      GLMJS_PREFIX = hints.prefix;

   GLM.$prefix = GLMJS_PREFIX;

   var DBG = hints.log || function() {};

   try { DBG("GLM-js: ENV: "+_ENV._VERSION); } catch(e) {}

   DBG("GLM-JS: initializing: "+JSON.stringify(hints,0,2));
   DBG(JSON.stringify({'functions':Object.keys(GLM.$outer.functions)}));

    //GLM.$outer.vec3_eulerAngles = GLM.$outer.vec3_eulerAngles || GLM.$outer._vec3_eulerAngles;
    //GLM.eulerAngles = GLM.$outer.vec3_eulerAngles.bind(GLM.$outer);
    GLM.toMat4 = (function(mat4, outer) { return function toMat4(q) { return new mat4(outer.mat4_array_from_quat(q)); } })(GLM.mat4, GLM.$outer);

    GLM.$template.extend(GLM.rotation.$template, {
        $quat: GLM.quat,
        $dot: GLM.dot.link('vec3,vec3'),
        $epsilon: GLM.epsilon(),
        $m: GLM.mat3(),
        $pi: GLM.pi(),
        $length2: GLM.length2.link('vec3'),
        $cross: GLM.cross.link('vec3,vec3'),
        $normalize: GLM.normalize.link('vec3'),
        $angleAxis: GLM.angleAxis.link('float,vec3'),
        $sqrt: GLM.sqrt
    });

   // augmented metadata
   GLM.$symbols = [];
   for(var p in GLM) {
      if (typeof GLM[p] === 'function') {
         if (/^[a-z]/.test(p)) // for glm.using_namespace and other metaprog
            GLM.$symbols.push(p);
      }
   }

   GLM.$types.forEach(
      function(p) {
         var type = GLM[p].prototype.$type;
         for(var op in GLM.$outer.functions) {
            var theop = GLM.$outer.functions[op];
            if (theop.$op) { // mixin operator-likes
               GLM.$DEBUG && GLM.$outer.console.debug("mapping operator<"+type+"> "+op+" / "+theop.$op);
               GLM[p].prototype[op] = theop; // longform (eg: .mul)
               GLM[p].prototype[theop.$op] = theop; //shortform (eg: ['*'])
            }
         }
      });

   DBG("GLM-JS: "+GLM.version+" emulating "+
       "GLM_VERSION="+GLM.GLM_VERSION+" "+
       "vendor_name="+hints.vendor_name+" "+
       "vendor_version="+hints.vendor_version);
   glm.vendor = hints;
};

// yes, this is doing what you think
// (exporting GLM.$symbols to globals, invoking function, restoring old globals)
// (... currently only used for testing parity with C++ GLM...)
GLM.using_namespace = function(tpl) {
   GLM.$DEBUG && GLM.$outer.console.debug("GLM.using_namespace munges globals; it should probably not be used!");
    GLM.using_namespace.$tmp = {
        ret: undefined,
        tpl: tpl,
        names: GLM.$symbols,
        saved: {},
        evals: [],
        restore: [],
        before: [],
        after: []
    };

    eval(GLM.using_namespace.$tmp.names
         .map(function(x,_) { return "GLM.using_namespace.$tmp.saved['"+x+"'] = GLM.using_namespace.$tmp.before["+_+"] = 'undefined' !== typeof "+x+";" }).join("\n")
        );
   GLM.$DEBUG && console.warn("GLM.using_namespace before #globals: "+GLM.using_namespace.$tmp.before.length);

   GLM.using_namespace.$tmp.names.map(function(x) {
                var cme = "GLM.using_namespace.$tmp.saved['"+x+"']=undefined;"+
                   "delete GLM.using_namespace.$tmp.saved['"+x+"'];";

                //try {
                   GLM.using_namespace.$tmp.restore.push(x+"=GLM.using_namespace.$tmp.saved['"+x+"'];"+cme);
                //} catch(e) {
                //   restore.push(x+"=undefined;delete "+x+";"+cme);
                //}
                GLM.using_namespace.$tmp.evals.push(x+"=GLM."+x+";");
             });
   eval(GLM.using_namespace.$tmp.evals.join("\n"));

   GLM.using_namespace.$tmp.ret = tpl();

   eval(GLM.using_namespace.$tmp.restore.join("\n"));
   eval(GLM.using_namespace.$tmp.names.map(function(x,_) { return "GLM.using_namespace.$tmp.after["+_+"] = 'undefined' !== typeof "+x+";" }).join("\n"));
    GLM.$DEBUG && console.warn("GLM.using_namespace after #globals: "+GLM.using_namespace.$tmp.after.length);
    var ret = GLM.using_namespace.$tmp.ret;
    delete GLM.using_namespace.$tmp;
   // if ((before.length+after.length) !== 0) {
   //    throw new Error(JSON.stringify({before:before,after:after, usn: Object.keys(GLM.using_namespace)}));
   // }
   // if (before.length !== after.length) {
   //    throw new Error(JSON.stringify({before:before,after:after, usn: Object.keys(GLM.using_namespace)}));
   // }
   return ret;
};

function $GLM_extern(func, local) {
   //try { console.debug("extern "+func, local||""); } catch(e){}
   local = local || func;
   return function() {
      GLM[local] = GLM.$outer.functions[func] || GLM.$outer[func];
      if (!GLM[local]) throw new GLM.GLMJSError('$GLM_extern: unresolved external symbol: '+func);
      GLM.$DEBUG && GLM.$outer.console.debug('$GLM_extern: resolved external symbol '+func+' '+typeof GLM[local]);
      return GLM[local].apply(this, arguments);
   };
}

function GLM_polyfills() {
    var filled = {};
    if (!( "bind" in Function.prototype )) {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Polyfill
        filled.bind = Function.prototype.bind = function(b){
            if(typeof this!=="function"){throw new TypeError("not callable");}
            function c(){}var a=[].slice,f=a.call(arguments,1),e=this,
            d=function(){
                return e.apply(this instanceof c?this:b||global,f.concat(a.call(arguments)));
            };
            c.prototype=this.prototype||c.prototype;d.prototype=new c();return d;};
    }
    return filled;
}

$GLM_reset_logging.current = function() {
   return {
      $GLM_log: typeof $GLM_log !== 'undefined' && $GLM_log,
      $GLM_console_log: typeof $GLM_console_log !== 'undefined' && $GLM_console_log,
      $GLM_console_prefixed: typeof $GLM_console_prefixed !== 'undefined' && $GLM_console_prefixed,
      console: GLM.$outer.console
   };
};

function $GLM_reset_logging(force) {
   if (force && typeof force === 'object') {
      $GLM_log = force.$GLM_log;
      $GLM_console_log = force.$GLM_console_log;
      $GLM_console_factory = force.$GLM_console_factory;
      GLM.$outer.console = force.console;
      force = false; // fall-thru for any missing values
   }
   // support glm.$log being injected for easier testing
   if (force || 'undefined' === typeof $GLM_log)
      $GLM_log = function(x,y) {
         GLM.$outer.console.log.apply(
            GLM.$outer.console,
            [].slice.call(arguments).map(
               function(x){
                  var jstype = typeof x;
                  if (jstype === 'xboolean' || jstype === 'string')
                     return x+'';
                  if (GLM.$isGLMObject(x) || !isNaN(x))
                     return GLM.to_string(x);
                  return x+'';
               })
         );
      };

   // ditto for consolidated console writes
   if (force || 'undefined' === typeof $GLM_console_log) {
      $GLM_console_log = function(prefix, args) {
         (console[prefix]||function(){}).apply(
            console,
            [].slice.call(arguments,1)
         );
      };
   }
   if (force || 'undefined' === typeof $GLM_console_factory) {
      $GLM_console_factory = function(prefix) { return $GLM_console_log.bind($GLM_console_log, prefix); };
   }

   var con = (
      function(factory) {
         var ret = {};
         "debug,warn,info,error,log,write"
         .replace(/\w+/g,
                  function(prop) {
                     ret[prop] = factory(prop);
                  });
         return ret;
      })($GLM_console_factory);
     if ('object' === typeof GLM) {
         if (GLM.$outer)
             GLM.$outer.console = con;
         GLM.$log = $GLM_log;
     }
   return con;
}//$GLM_reset_logging
try{ window.$GLM_reset_logging = this.$GLM_reset_logging = $GLM_reset_logging; }catch(e){}
GLM.$reset_logging = $GLM_reset_logging;
GLM.$log = GLM.$log || $GLM_log;
//http://stackoverflow.com/a/27925672/1684079
function $GLM_GLMJSError(name, init) {
   function E(message) {
      this.name = name;
      this.stack = (new Error()).stack;
      if (Error.captureStackTrace)
         Error.captureStackTrace(this, this.constructor);
      this.message = message;
      init && init.apply(this, arguments);
   }
   E.prototype = new Error();
   E.prototype.name = name;
   E.prototype.constructor = E;
   return E;
}

//try { module.exports = GLM; } catch(e) {}
// ----------------------------------------------------------------------------
// three.js GLM math adapter
// copyright(c) 2015 humbletim
// https://github.com/humbletim/glm-js
// MIT LICENSE
// ----------------------------------------------------------------------------

if (typeof THREE === 'undefined')
   throw new Error('this adapter requires THREE to be availed...');

THREE.exists;

glm = GLM;

var DLL = {
   vendor_name: "three.js",
   vendor_version: THREE.REVISION,

   _name: 'glm.three.js',
   _version: '0.0.2',

   prefix: 'glm-js[three]: '
};

DLL['statics'] = {
   $mat4: new THREE.Matrix4(),
   mat4_perspective: function(fov, aspect, near, far) {
      fov = glm.degrees(fov);
      return new glm.mat4(
         new Float32Array(this.$mat4.makePerspective( fov, aspect, near, far ).elements)
      );
   },
   mat4_ortho: function(left, right, bottom, top, near, far) {
      near = near || -1;
      far = far || 1;
      // NOTE: "bottom, top" becomes "top, bottom" in the below call
      //    (which then makes results match up with GLM 0.9.6 / 0.9.8 C++ results...)
      return new glm.mat4(
          new Float32Array(this.$mat4.makeOrthographic( left, right, top, bottom, near, far ).elements)
      );
   },
   mat4_angleAxis: function(theta, axis) {
      return new glm.mat4(
         this.$mat4.makeRotationAxis(axis,theta)
      );
//      return glm.make_mat4(
//          this.$mat4.makeRotationAxis(axis,theta).elements
//       );
   },
   quat_angleAxis: function(angle, axis) {
      return new glm.quat(
         this.$quat.setFromAxisAngle(glm.normalize(axis), angle)
      );
   },
   mat4_translation: function(v) {
      return new glm.mat4(
         this.$mat4.makeTranslation(v.x,v.y,v.z)
      );
//       return glm.make_mat4(
//          this.$mat4.makeTranslation(v.x,v.y,v.z).elements
//       );
   },
   mat4_scale: function(v) {
      return new glm.mat4(
         this.$mat4.makeScale(v.x,v.y,v.z)
      );
//       return glm.make_mat4(
//          this.$mat4.makeScale(v.x,v.y,v.z).elements
//       );
   },
   // $euler: new THREE.Euler(),
   // vec3_eulerAngles: function(q) {
   //    return new glm.vec3(this.$euler.setFromQuaternion(q, 'ZYX'));
   // },
   mat4_array_from_quat: function(q) {
      return this.$mat4.makeRotationFromQuaternion(q).toArray();
   },
   $quat: new THREE.Quaternion(),
   quat_array_from_mat4: function(o) {
      return this.$quat.setFromRotationMatrix(o).toArray();
   }
};

DLL['declare<T,V,...>'] =
   {
      'mul': {
         $op: '*',
         '$vec<N>': 'new THREE.VectorN()',
         $quat: THREE.Quaternion.prototype.fromArray.bind(new THREE.Quaternion()),
         $quat2: THREE.Quaternion.prototype.fromArray.bind(new THREE.Quaternion()),
         'quat,quat': function(a,b) {
            a = this.$quat(a.elements);
            b = this.$quat2(b.elements);
            return new glm.quat(a.multiply(b));
         },
         'quat,vec3': function(a,b) {
            return this.$vec3.applyQuaternion.call(
               b.clone(), this.$quat(a.elements)
            );
         },
         'quat,vec4': function(a,b) {
            return this.$vec4.applyMatrix4.call(b.clone(), glm.toMat4(a));
         },
         'vec4,quat': function(a,b) { return this['quat,vec4'](glm.inverse(b),a); },
         'vec3,quat': function(a,b) { return this['quat,vec3'](glm.inverse(b),a); },
         '$vec<N>_multiplyScalar': 'THREE.VectorN.prototype.multiplyScalar',
         'vec<N>,float': function(a,b) {
            return this.$vecN_multiplyScalar.call(a.clone(), b);
         },
         'quat,float': function(a,b) { return this['vec4,float'](a,b); },
         'mat4,vec4': function(a,b) {
            return this.$vec4.applyMatrix4.call(b.clone(), a);
         },
         'vec4,mat4': function(a,b) { return this['mat4,vec4'](glm.inverse(b),a); },
         $mat4_multiplyMatrices: THREE.Matrix4.prototype.multiplyMatrices,
         'mat<N>,mat<N>': function(a,b) {
            // THREE has no mat3*mat3 function?
            a = new glm.mat4(a);
            b = new glm.mat4(b);
            return new glm.matN(this.$mat4_multiplyMatrices.call(a, a, b));
         }
      },
      'mul_eq': {
         $op: '*=',
         '$vec<N>': 'new THREE.VectorN()',
         $quat: THREE.Quaternion.prototype.fromArray.bind(new THREE.Quaternion()),
         $quat2: THREE.Quaternion.prototype.fromArray.bind(new THREE.Quaternion()),
         'quat,quat': function(a,b) {
            var A = this.$quat(a.elements);
            b = this.$quat2(b.elements);
            A.multiply(b);
            a.elements.set(A.toArray());
            return a;
         },

         '$vec<N>_multiplyScalar': 'THREE.VectorN.prototype.multiplyScalar',
         'vec<N>,float': function(a,b) {
            return this.$vecN_multiplyScalar.call(a, b);
         },
         $mat4_multiplyMatrices: THREE.Matrix4.prototype.multiplyMatrices,
         'mat4,mat4': function(a,b) {
            return this.$mat4_multiplyMatrices.call(a, a, b);
         },
         $mat4_copy_multiplyMatrices: THREE.Matrix4.prototype.multiplyMatrices.bind(new THREE.Matrix4()),
         'mat3,mat3': function(a,b) {
            // THREE has no mat3*mat3 function?
            return a.copy(
               new glm.mat3(
                  this.$mat4_copy_multiplyMatrices(new glm.mat4(a), new glm.mat4(b))
               ));
         },

         // note: v3 *= q; is not supported by GLM C++
         //  but v3['*='](q); seems to perform slightly-better in JS
         //  and can be used as: glm.mul_eq.link('inplace:vec3,quat')(v3,q);
         'inplace:vec3,quat': function(b,a) {
            return this.$vec3.applyQuaternion.call(
               b, this.$quat(a.elements).inverse()
            );
         },
         'inplace:vec4,mat4': function(b,a) {
            return this.$vec4.applyMatrix4.call(b, glm.inverse(a));
         }
      },
      cross: {
         $vec3_cross: THREE.Vector3.prototype.crossVectors,
         'vec3,vec3': function(a,b) {
            return this.$vec3_cross.call(glm.vec3(), a, b);
         }
      },
      dot: {
         $vec3_dot: THREE.Vector3.prototype.dot,
         $vec4_dot: THREE.Vector4.prototype.dot,
         'vec3,vec3': function(a,b) {
            return this.$vec3_dot.call(a, b);
         },
         'vec4,vec4': function(a,b) {
            return this.$vec4_dot.call(a, b);
         }
      },
      lookAt: {
          $mat4_lookAt: THREE.Matrix4.prototype.lookAt,
          'vec3,vec3': function(eye,target,up) {
              return glm.inverse(this.$mat4_lookAt.call(glm.mat4(), eye, target, up));
          }
      }
   };//operations

DLL['declare<T,V,number>'] = {
   mix: {
      $quat: THREE.Quaternion.prototype.fromArray.bind(new THREE.Quaternion()),
      $quat2: THREE.Quaternion.prototype.fromArray.bind(new THREE.Quaternion()),
       "quat,quat": function(a,b,rt) {
         return new glm.quat(
            this.$quat(a.elements)
               .slerp(this.$quat2(b.elements),rt)
         );
      }
   }
}; // functions
DLL['declare<T,V,number>'].slerp = DLL['declare<T,V,number>'].mix;

DLL['declare<T>'] = {
   normalize: {
      '$vec<N>': 'new THREE.VectorN()',
      'vec<N>': function(q) {
         return new glm.vecN(this.$vecN.copy(q).normalize());
      },
      $quat: THREE.Quaternion.prototype.fromArray.bind(new THREE.Quaternion()),
      quat: function(q) {
         return new glm.quat(this.$quat(q.elements).normalize());
      },
   },
   length2: {
      '$vec<N>': 'new THREE.VectorN()',
      "vec<N>": function(v) { return this.$vecN.lengthSq.call(v); },
      $quat: THREE.Quaternion.prototype.fromArray.bind(new THREE.Quaternion()),
      quat: function(q) { return this.$quat(q.elements).lengthSq(); },
   },
   length: {
      '$vec<N>': 'new THREE.VectorN()',
      "vec<N>": function(v) { return this.$vecN.length.call(v); },
      $quat: THREE.Quaternion.prototype.fromArray.bind(new THREE.Quaternion()),
      quat: function(q) { return this.$quat(q.elements).length(); },
   },
   inverse: {
      $quat: THREE.Quaternion.prototype.fromArray.bind(new THREE.Quaternion()),
      $mat4: new THREE.Matrix4(),
      quat: function(q) {
         //return new glm.quat(this.$quat.set(q.x,q.y,q.z,q.w).inverse());
         return new glm.quat(this.$quat(q.elements).inverse());
      },
      //slowmat4: function(m) { return new glm.mat4(this.$mat4.getInverse(m)); },
      _pm: { identity:function(){this.elements.set(glm.mat4.$.identity);return this;},
             multiplyScalar: function(n) { for(var i=0;i<16; i++)this.elements[i]*=n;}},
      mat4: function(m) { m=m.clone(); this._pm.elements=m.elements; this.$mat4.getInverse.call(this._pm,m); return m;},
   },
   transpose: {
      $mat4_transpose: THREE.Matrix4.prototype.transpose,
      mat4: function(m) { return this.$mat4_transpose.call(m.clone()); },
   }
};

glm.$outer.$import(DLL);

glm.$THREE = (
   function() {
      var map = {
         g2t: GLM.$template.deNify(
            {
               'vec<N>': function(g) {
                  var t = new THREE.VectorN();
                  return t.set.apply(t, glm.$to_array(g));
               },
               'mat<N>': function(g) {
                  var t = new THREE.MatrixN();
                  return t.copy(g);//(t, glm.$to_array(g));
               },
               'quat': function(g) {
                  var t = new THREE.Quaternion();
                  return t.set.apply(t, glm.$to_array(g));
               }
            }),
         t2g: GLM.$template.deNify(
            {
               'Vector<N>': function(t) {
                  return new glm.vecN(t);
               },
               'Matrix<N>': function(t) {
                  return new glm.matN(t);
               },
               'Quaternion': function(t) {
                  return new glm.quat(t._w,t._x,t._y,t._z);
               },
               'Euler': function(t) {
                  return new glm.vec3(t);
               }
            })
      };
      function mapper(keymap, ns) {
         var _key = keymap._key = Object.keys(keymap);
         var _ref = keymap._ref = keymap._key.map(function(k) { return ns[k]; });
         return keymap.byObject = (function(ob) {
            var idx = _ref.indexOf(ob.constructor);
            if (!~idx) throw new GLM.GLMJSError("unsupported argtype for remapping (index not found): "+ob);
            var redir = this[_key[idx]];
            if (!redir) throw new GLM.GLMJSError("unsupported argtype for remapping (key not found): "+ob);
            return redir.apply(this, arguments);
                 }.bind(keymap));
      }
      return {
         $map: map,
         to_glm: mapper(map.t2g, THREE),
         from_glm: mapper(map.g2t, glm)
      };
   }
)();

try { module.exports = glm; } catch(e) {}
