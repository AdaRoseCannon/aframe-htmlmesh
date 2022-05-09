/* jshint esversion: 9, -W097 */
/* For dealing with spline curves */
/* global THREE, AFRAME, setTimeout, console */
'use strict';

import { HTMLMesh } from './HTMLMesh.js';

const schemaPointer = {
	activationType: {
		oneOf: ['event', 'proximity'],
		default: 'event'
	},
	downEvents: {
		type: 'array',
		default: ['selectstart']
	},
	upEvents: {
		type: 'array',
		default: ['selectend']
	},
	clickEvents: {
		type: 'array',
		default: ['select']
	},

};

const schemaHTML = {
	type: 'selector',
};

documentation:
{
	schemaHTML.description = `HTML element to use.`;
	schemaPointer.activationType.description = `Use an event for mouse down and up or proximity between two elements`;
	schemaPointer.downEvents.description = `Event to trigger 'mouseDown' events`;
	schemaPointer.upEvents.description = `Event to trigger 'mouseUp' events`;
	schemaPointer.clickEvents.description = `Event to trigger 'click' events`;
	console.log(`Display an interactive HTML element in the scene.`);
}

const _pointer = new THREE.Vector2();
const _event = { type: '', data: _pointer };
AFRAME.registerComponent('html-pointer', {
	schema: schemaPointer,
	init() {
		this.htmlEl = null;
		this.onDown = e => this.handle('mousedown', e);
		this.onUp = e => this.handle('mouseup', e);
		this.onClick = e => this.handle('click', e);

		this.onIntersection = e => this.htmlEl = e.detail.els[0];
		this.onIntersectionCleared = _e => this.htmlEl = null;
		this.el.addEventListener('raycaster-intersection', this.onIntersection);
		this.el.addEventListener('raycaster-intersection-cleared', this.onIntersectionCleared);
	},
	handle(type, e) {
		if (this.htmlEl) {
			const intersection = this.el.components.raycaster.getIntersection(this.htmlEl);
			if (intersection) {
				const mesh = this.htmlEl.getObject3D('html');
				const uv = intersection.uv;
				_event.type = type;
				_event.data.set( uv.x, 1 - uv.y );
				mesh.dispatchEvent( _event );
			}
		}
	},
	update(oldData = {}) {
		if (oldData.downEvents) {
			for (const eventName of oldData.downEvents) {
				this.el.removeEventListener(eventName, this.onDown);
			}
		}

		if (oldData.upEvents) {
			for (const eventName of oldData.upEvents) {
				this.el.removeEventListener(eventName, this.onUp);
			}
		}

		if (oldData.clickEvents) {
			for (const eventName of oldData.clickEvents) {
				this.el.removeEventListener(eventName, this.onClick);
			}
		}

		if (this.data.activationType === 'event') {
			for (const eventName of this.data.downEvents) {
				this.el.addEventListener(eventName, this.onDown);
			}
			for (const eventName of this.data.upEvents) {
				this.el.addEventListener(eventName, this.onUp);
			}
			for (const eventName of this.data.clickEvents) {
				this.el.addEventListener(eventName, this.onClick);
			}
		}
	},
	remove() {
		this.el.removeEventListener('raycaster-intersection', this.onIntersection);
		this.el.removeEventListener('raycaster-intersection-cleared', this.onIntersectionCleared);
	},
});

AFRAME.registerComponent('html', {
	schema: schemaHTML,
	init() {
		this.rerender = this.rerender.bind(this);
	},
	update() {
		this.remove();
		if (!this.data) return;
		const mesh = new HTMLMesh(this.data);
		this.el.setObject3D('html', mesh);
		this.data.addEventListener('input', this.rerender);
	},
	rerender() {
		const mesh = this.el.getObject3D('html');
		if (mesh && !mesh.material.map.scheduleUpdate) {
			mesh.material.map.scheduleUpdate = setTimeout( () => mesh.material.map.update(), 16 );
		}
	},
	remove() {
		if (this.el.getObject3D('html')) {
			this.el.removeObject3D('html');
			this.data.removeEventListener('change', this.rerender);
		}
	},
});
