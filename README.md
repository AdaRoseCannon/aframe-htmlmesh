# AFrame-HTML

```html
<a-sphere color="black" radius="0.01" id="cursor" material="shader:flat"></a-sphere>
<a-entity html="html:#my-interface;cursor:#cursor;" position="0 1.5 -0.5"></a-entity>
```

![image](https://user-images.githubusercontent.com/4225330/167301172-50270499-ac85-4b14-a25e-f82454b19cb0.png)

<!--DOCS-->
### html component

| Property | Type     | Description            | Default |
| :------- | :------- | :--------------------- | :------ |
| html     | selector | HTML element to use.   |         |
| cursor   | selector | Visual indicator for where the user is currently pointing |         |

<!--DOCS_END-->
