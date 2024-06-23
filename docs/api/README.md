**class-action** • [**Docs**](globals.md)

***

# Class Action

This is a simple library for creating composable functions. It helps to create methods or functions that may need to be modified later without introducing performance issues from multiple code compilation. 

A class action is simply an object with a local action method and an optional list of reaction objects which are also `ClassAction` instances. Not only can reactions be added or removed later and nested to any depth, but the classes can be extended and composed freely to achieve whatever effect we want. We have used class-action as the primary abstraction for implementing a transparent and extensible reactivity system in [action-component](https://github.com/mksunny1/action-component).

## Installation

You can install class-action in 2 ways:

### Direct download

Download or clone the repository. It contains both JavaScript and TypeScript files.

### NPM

`npm i class-action`

## Usage

Depending on how you bring class-action into your app, there may be subtle differences in how to import the libraries:

### Direct download

```js
import { ClassAction } from "./class-action/dist/class-action.js";
```

```ts
import { ClassAction } from "./class-action/src/class-action";
```

### NPM

```js
import { ClassAction } from "class-action";
```

```ts
import { ClassAction } from "class-action";
```

## Documentation

This library exports a single class with a very simple API which can be picked up in a few minutes [here]().

## Contributing

If you want to improve class-action, contribute to this project. You can contribute in many areas. See the [contribution guidelines](). You can also show your support by sponsoring us.

[![](https://www.paypalobjects.com/en_GB/i/btn/btn_donate_LG.gif)](https://www.paypal.com/donate/?hosted_button_id=S2ZW3RJSDHASW)

## Sponsors

...
