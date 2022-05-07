/* jshint esversion: 9, -W097 */
/* For dealing with spline curves */
/* global THREE, AFRAME, setTimeout */
'use strict';

import { HTMLMesh } from './HTMLMesh.js';

const schema = {
	type: 'selector',
};

documentation:{
	schema.description = `HTML element to use.`;
	console.log(`Display an interactive HTML element in the scene.`);
}

AFRAME.registerComponent('html', {
	schema: schema,
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
			this.observer.disconnect();
			this.data.removeEventListener('change', this.rerender);
		}
	}
});
