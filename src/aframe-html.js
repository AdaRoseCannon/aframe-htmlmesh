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
		this.el.addEventListener('click', e => this.handle('click', e));
		this.el.addEventListener('mouseleave', e => this.handle('mouseleave', e));
		this.el.addEventListener('mouseenter', e => this.handle('mouseenter', e));
		this.el.addEventListener('mouseup', e => this.handle('mouseup', e));
		this.el.addEventListener('mousedown', e => this.handle('mousedown', e));
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
		if (this.el.getObject3D('html')) {
			this.el.removeObject3D('html');
			this.data.html.removeEventListener('change', this.rerender);
		}
	},
});
