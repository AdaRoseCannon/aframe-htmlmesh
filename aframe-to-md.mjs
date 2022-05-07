import tablemark from "tablemark";
const myArgs = process.argv.slice(2);

const handler = {
	get(target, prop, receiver) {
		return target[prop] || function () {
			// console.log(prop);
		};
	}
};

function processSchema(obj, property) {
	const out = {};
	if (property) out.property = property;
	out.type = obj.type || typeof obj.default;
	if (obj.oneOf) {
		out.description = `${obj.description || ""}. One of ${obj.oneOf.join(', ')}`;
	} else {
		out.description = `${obj.description || ""}`;
	}
	if (typeof obj.default === 'object' || typeof obj.default === 'string') {
		out.default = JSON.stringify(obj.default);
	} else {
		out.default = obj.default;
	}
	return out;
}

global.THREE = new Proxy({
	MathUtils: {
		generateUUID: ()=>({replace:function(){}})
	}
}, handler);
global.AFRAME= {
	registerComponent: function (name, details) {
		const table = [];
		if (details.schema.description) {
			const out = processSchema(details.schema);
			table.push(out);
		} else {
			for (const [property, obj] of Object.entries(details.schema)) {
				const out = processSchema(obj, property);
				table.push(out);
			}
		}
		console.log(`### ${name} component` + '\n');
		if (details.description) {
			console.log(details.description + '\n');
		}
		if (table.length) {
			console.log(tablemark(table));
		} else {
			console.log("No configuration required");
		}
	},
	registerShader: function (name, details) {
		this.registerComponent(name, details);
	},
	registerPrimitive: function (name, details) {
		const table = [];
		console.log(`### &lt;${name}&gt;` + '\n');
		if (details.description) console.log(details.description + '\n');
		if (details.defaultComponents) {
			const table = [];
			for (const [defaultComponent, settings] of Object.entries(details.defaultComponents)) {
				const out = {defaultComponent, settings: JSON.stringify(settings)};
				table.push(out);
			}
			if (table.length) {
				console.log(`**Default Components:**` + '\n');
				console.log(tablemark(table));
			}
		}
		if (details.mappings) {
			const table = [];
			for (const [property, mapping] of Object.entries(details.mappings)) {
				const out = {property, mapping:JSON.stringify(mapping)};
				table.push(out);
			}
			if (table.length) {
				console.log(`**Entity Attribute Mappings:**` + '\n');
				console.log(tablemark(table));
			}
		}
	}
}
import(myArgs[0]);
