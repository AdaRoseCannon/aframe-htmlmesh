# AFrame-HTML

Include in `<head>`:

```html
<script src="https://cdn.jsdelivr.net/npm/aframe-htmlmesh@2.6.0/build/aframe-html.min.js"></script>
```

and in your `<a-scene>`:

```html
<a-sphere color="black" radius="0.01" id="cursor" material="shader:flat" visible="false"></a-sphere>
<a-entity html="html:#my-interface;cursor:#cursor;" position="0 1.5 -0.5"></a-entity>
```

Examples:

- [Basic Example](https://ada.is/aframe-htmlmesh/)
- [More advanced example that uses aframe-htmlmesh on your wrist (aframe-xr-boilerplate)](https://github.com/AdaRoseCannon/aframe-xr-boilerplate)

You can find on the A-Frame wiki the [supported and not supported css features](https://aframe.wiki/en/#!pages/gui.md#htmlmesh).

![image](https://user-images.githubusercontent.com/4225330/167301172-50270499-ac85-4b14-a25e-f82454b19cb0.png)

<!--DOCS-->
### html component

| Property | Type     | Description                                               | Default |
| :------- | :------- | :-------------------------------------------------------- | :------ |
| html     | selector | HTML element to use.                                      |         |
| cursor   | selector | Visual indicator for where the user is currently pointing |         |

<!--DOCS_END-->
