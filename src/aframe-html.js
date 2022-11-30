/* jshint esversion: 9, -W097 */
/* For dealing with spline curves */
/* global THREE, AFRAME, setTimeout, console */
'use strict';

import { HTMLMesh } from './HTMLMesh.js';

const schemaHTML = {
	html: {
		type: 'selector',
	},
	cursor: {
		type: 'selector',
	}
};

documentation:
{
	schemaHTML.html.description = `HTML element to use.`;
	schemaHTML.cursor.description = `Visual indicator for where the user is currently pointing`;
}

const _pointer = new THREE.Vector2();
const _event = { type: '', data: _pointer };
AFRAME.registerComponent('html', {
	schema: schemaHTML,
	init() {
		this.rerender = this.rerender.bind(this);
		this.handle = this.handle.bind(this);
		this.onClick = e => this.handle('click', e);
		this.onMouseLeave = e => this.handle('mouseleave', e);
		this.onMouseEnter = e => this.handle('mouseenter', e);
		this.onMouseUp = e => this.handle('mouseup', e);
		this.onMouseDown = e => this.handle('mousedown', e);
	},
	play() {
		this.el.addEventListener('click', this.onClick);
		this.el.addEventListener('mouseleave', this.onMouseLeave);
		this.el.addEventListener('mouseenter', this.onMouseEnter);
		this.el.addEventListener('mouseup', this.onMouseUp);
		this.el.addEventListener('mousedown', this.onMouseDown);
	},
	pause() {
		this.el.removeEventListener('click', this.onClick);
		this.el.removeEventListener('mouseleave', this.onMouseLeave);
		this.el.removeEventListener('mouseenter', this.onMouseEnter);
		this.el.removeEventListener('mouseup', this.onMouseUp);
		this.el.removeEventListener('mousedown', this.onMouseDown);
	},
	update() {
		this.remove();
		if (!this.data.html) return;
		const mesh = new HTMLMesh(this.data.html);
		this.el.setObject3D('html', mesh);
		this.data.html.addEventListener('input', this.rerender);
		this.data.html.addEventListener('change', this.rerender);
		this.cursor = this.data.cursor ? this.data.cursor.object3D : null;
	},
	tick() {
		if (this.activeRaycaster) {
			const intersection = this.activeRaycaster.components.raycaster.getIntersection(this.el);
			this.handle('mousemove', {
				detail: {
					cursorEl: this.activeRaycaster,
					intersection
				}
			});
		}
	},
	handle(type, evt) {
		const intersection = evt.detail.intersection;
		const raycaster = evt.detail.cursorEl;
		if (type === 'mouseenter') {
			this.activeRaycaster = raycaster;
		}
		if (type === 'mouseleave' && this.activeRaycaster === raycaster) {
			this.activeRaycaster = null;
		}
		if (this.cursor) this.cursor.visible = false;
		if (intersection) {
			const mesh = this.el.getObject3D('html');
			const uv = intersection.uv;
			_event.type = type;
			_event.data.set( uv.x, 1 - uv.y );
			mesh.dispatchEvent( _event );

			if (this.cursor) {
				this.cursor.visible = true;
				this.cursor.parent.worldToLocal(this.cursor.position.copy(intersection.point));
			}
		}
	},
	rerender() {
		const mesh = this.el.getObject3D('html');
		if (mesh && !mesh.material.map.scheduleUpdate) {
			mesh.material.map.scheduleUpdate = setTimeout( () => mesh.material.map.update(), 16 );
		}
	},
	remove() {
		const mesh = this.el.getObject3D('html');
		if (mesh) {
			this.el.removeObject3D('html');
			this.data.html.removeEventListener('input', this.rerender);
			this.data.html.removeEventListener('change', this.rerender);
			mesh.dispose();
		}
		this.activeRaycaster = null;
		this.cursor = null;
	},
});
