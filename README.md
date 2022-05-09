# AFrame-HTML

```html
<a-entity html="#my-interface" position="0 1.5 -0.5"></a-entity>
```

![image](https://user-images.githubusercontent.com/4225330/167301172-50270499-ac85-4b14-a25e-f82454b19cb0.png)

<!--DOCS-->
Display an interactive HTML element in the scene.
### html-pointer component

| Property       | Type   | Description                                                                                   | Default         |
| :------------- | :----- | :-------------------------------------------------------------------------------------------- | :-------------- |
| activationType | string | Use an event for mouse down and up or proximity between two elements. One of event, proximity | "event"         |
| downEvents     | array  | Event to trigger 'mouseDown' events                                                           | ["selectstart"] |
| upEvents       | array  | Event to trigger 'mouseUp' events                                                             | ["selectend"]   |
| clickEvents    | array  | Event to trigger 'click' events                                                               | ["select"]      |

### html component

| Type     | Description          | Default |
| :------- | :------------------- | :------ |
| selector | HTML element to use. |         |

<!--DOCS_END-->
