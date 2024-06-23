# Class Action

This is a simple library for creating composable functions. It helps to create methods or functions that may need to be modified later without introducing performance issues from multiple code compilation. 

A class action is simply an object with a local action method and an optional list of reaction objects which are also `ClassAction` instances. Not only can reactions be added or removed later and nested to any depth, but the classes can be extended and composed freely to achieve whatever effect we want. We have used class-action as the primary abstraction for implementing a transparent and extensible reactivity system in [action-component](https://github.com/mksunny1/action-component).


## Installation

You can get class-action in 3 ways:

### CDN (GitHub Pages)

No installation required. 

### NPM

`npm i class-action`

### Direct download

Download or clone the repository. 


## Usage

### Import from a CDN
```js
import { ClassAction } from "mksunny1.github.io/class-action/dist/class-action.js";
```

### Import from node_modules

```js
import { ClassAction } from "class-action";
```

### Import from a local directory

```js
import { ClassAction } from "/class-action/dist/class-action.js";
```

### Create a class action.

```js
class MyClassAction extends ClassAction {
    constructor(value, ...reactions) {
        super(...reactions);
        this.value = value;
    }
    doAction(context) {
        context.value = (context.value || 0) + this.value;
    }
}

const myClassAction = new MyClassAction(5, new MyClassAction(2), new MyClassAction(7));
const context = { };
myClassAction.act(myContext);
console.log(myContext);   // prints 14
myClassAction.act(myContext);
console.log(myContext);   // prints 28
myClassAction.reactions.splice(0, 1);
myClassAction.act(myContext);
console.log(myContext);   // prints 40
```


## Documentation

This library exports a single class with a very simple API which can be picked up in a few minutes [here](./docs//api/classes/ClassAction.md).


## Contributing

If you want to improve class-action, contribute to this project. You can contribute in many areas. See the [contributing guidelines](./CONTRIBUTING.md). You can also show your support by sponsoring us.

[![](https://www.paypalobjects.com/en_GB/i/btn/btn_donate_LG.gif)](https://www.paypal.com/donate/?hosted_button_id=S2ZW3RJSDHASW)


## Sponsors

...
