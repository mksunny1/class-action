[**class-action**](../README.md) • **Docs**

***

[class-action](../globals.md) / ClassAction

# Class: ClassAction\<T\>

An object which can produce an effect and trigger all its reactions 
to produce theirs. It enables a form of metaprogramming where we 
replace object methods with class actions which can both perform an 
operation (like normal methods) and invoke further operations on 
reactions they contain. Reactions are also class actions, so we can 
compose operations to any depth we want. We can easily modify 
class-action trees since everything is accessible in a few properties 
and methods.

These are just some of the use cases we have found for this primitive:

1. Writing composable and extensible functions and methods.

2. Creating more flexible class implementations with parts that can be 
augmented, changed or stripped down later without memory or 
performance hit.

3. Wrapping regular objects to reactively perform  
operations like setting or deleting properties or calling 
methods.

## Type Parameters

• **T**

## Constructors

### new ClassAction()

> **new ClassAction**\<`T`\>(...`reactions`): [`ClassAction`](ClassAction.md)\<`T`\>

Creates a new ClassAction object containing the optionally provided reactions.

#### Parameters

• ...**reactions**: [`ClassAction`](ClassAction.md)\<`any`\>[]

#### Returns

[`ClassAction`](ClassAction.md)\<`T`\>

#### Example

```ts
import { ClassAction } from 'class-action'
const classAction = new ClassAction()
```

#### Defined in

[class-action.ts:67](https://github.com/mksunny1/class-action/blob/99e9dbff5e20c254b0433d21d21fcbb4bdbd7f51/src/class-action.ts#L67)

## Properties

### reactions?

> `optional` **reactions**: [`ClassAction`](ClassAction.md)\<`any`\>[]

Instance reactions. These are reactions added to every class-action 
instance. They may be necessary when they require internal state that 
differ between instances.

#### Example

```ts
import { ClassAction } from 'class-action'
const reaction1 = new ClassAction(), reaction2 = new ClassAction();
const myClassAction = new ClassAction(reaction1, reaction2);
```

#### Defined in

[class-action.ts:56](https://github.com/mksunny1/class-action/blob/99e9dbff5e20c254b0433d21d21fcbb4bdbd7f51/src/class-action.ts#L56)

***

### reactions

> `static` **reactions**: [`ClassAction`](ClassAction.md)\<`any`\>[]

Static reactions. These will be associated with all class-action 
instances created with the same class without being present on 
every instance. In most cases, such actions should be stateless, 
though you may deliberately want to share state in some scenarios.

#### Example

```ts
import { ClassAction } from 'class-action'
const reaction1 = new ClassAction(), reaction2 = new ClassAction();
class MyClassAction extends ClassAction {
   static reactions = [reaction1, reaction2]
}
const myClassAction1 = new MyClassAction();
const myClassAction2 = new MyClassAction();
```

#### Defined in

[class-action.ts:43](https://github.com/mksunny1/class-action/blob/99e9dbff5e20c254b0433d21d21fcbb4bdbd7f51/src/class-action.ts#L43)

## Methods

### act()

> **act**(`context`?): `any`

Performs the local action and triggers all reactions.

#### Parameters

• **context?**: `T`

#### Returns

`any`

#### Example

```ts
import { ClassAction } from 'class-action'
class MyClassAction extends ClassAction {
   doAction(context) {
     console.log(context.msg);
   }
}
const myClassAction = new MyClassAction(new MyClassAction(), new MyClassAction());
myClassAction.act({ msg: 'nice work' });
// prints 'nice work' thrice...
```

#### Defined in

[class-action.ts:145](https://github.com/mksunny1/class-action/blob/99e9dbff5e20c254b0433d21d21fcbb4bdbd7f51/src/class-action.ts#L145)

***

### addReactions()

> **addReactions**(...`reactions`): `void`

Adds the given reactions to this ClassAction. This allows for  
more implementation flexibility in derived classes.

#### Parameters

• ...**reactions**: [`ClassAction`](ClassAction.md)\<`any`\>[]

#### Returns

`void`

#### Example

```ts
import { ClassAction } from 'class-action'
const reaction1 = new ClassAction(), reaction2 = new ClassAction();
const myClassAction = new ClassAction(reaction1, reaction2);
class MyClassAction extends ClassAction {
   doAction(context) {
     console.log('Added reaction');
   }
}
myClassAction.addReactions(new MyClassAction())
myClassAction.act()
```

#### Defined in

[class-action.ts:207](https://github.com/mksunny1/class-action/blob/99e9dbff5e20c254b0433d21d21fcbb4bdbd7f51/src/class-action.ts#L207)

***

### doAction()

> **doAction**(`context`?): `any`

Performs the local action

#### Parameters

• **context?**: `T`

#### Returns

`any`

#### Example

```ts
import { ClassAction } from 'class-action'
class MyClassAction extends ClassAction {
   doAction(context) {
     console.log(context.msg);
   }
}
const myClassAction = new MyClassAction(new MyClassAction(), new MyClassAction());
myClassAction.doAction({ msg: 'nice work' });
// prints 'nice work' once...
```

#### Defined in

[class-action.ts:165](https://github.com/mksunny1/class-action/blob/99e9dbff5e20c254b0433d21d21fcbb4bdbd7f51/src/class-action.ts#L165)

***

### doReactions()

> **doReactions**(`context`?): `any`

Triggers all reactions of this ClassAction

#### Parameters

• **context?**: `T`

#### Returns

`any`

#### Example

```ts
import { ClassAction } from 'class-action'
class MyClassAction extends ClassAction {
   doAction(context) {
     console.log(context.msg);
   }
}
const myClassAction = new MyClassAction(new MyClassAction(), new MyClassAction());
myClassAction.doReactions({ msg: 'nice work' });
// prints 'nice work' twice...
```

#### Defined in

[class-action.ts:184](https://github.com/mksunny1/class-action/blob/99e9dbff5e20c254b0433d21d21fcbb4bdbd7f51/src/class-action.ts#L184)

***

### getAllReactions()

> **getAllReactions**(`context`?): [`ClassAction`](ClassAction.md)\<`any`\>[]

Gets all class and instance reactions. This is used internally 
to obtain all reactions to trigger after the local action has 
been executed.

#### Parameters

• **context?**: `T`

#### Returns

[`ClassAction`](ClassAction.md)\<`any`\>[]

#### Example

```ts
import { ClassAction } from 'class-action'
const reaction1 = new ClassAction(), reaction2 = new ClassAction();
class MyClassAction extends ClassAction {
   static reactions = [reaction1, reaction2]
}
const myClassAction = new MyClassAction(reaction1, reaction2);
myClassAction.getAllReactions();
```

#### Defined in

[class-action.ts:126](https://github.com/mksunny1/class-action/blob/99e9dbff5e20c254b0433d21d21fcbb4bdbd7f51/src/class-action.ts#L126)

***

### getReactions()

> **getReactions**(`context`?): [`ClassAction`](ClassAction.md)\<`any`\>[]

Returns all instance reactions of this ClassAction.
By default it simply returns [ClassAction#reactions](ClassAction.md#reactions).

#### Parameters

• **context?**: `T`

#### Returns

[`ClassAction`](ClassAction.md)\<`any`\>[]

#### Example

```ts
import { ClassAction } from 'class-action'
const reaction1 = new ClassAction(), reaction2 = new ClassAction();
const myClassAction = new ClassAction(reaction1, reaction2);
myClassAction.getReactions();
```

#### Defined in

[class-action.ts:104](https://github.com/mksunny1/class-action/blob/99e9dbff5e20c254b0433d21d21fcbb4bdbd7f51/src/class-action.ts#L104)

***

### removeReaction()

> **removeReaction**(`reaction`): `void`

Removes the specified reaction.

#### Parameters

• **reaction**: [`ClassAction`](ClassAction.md)\<`any`\>

#### Returns

`void`

#### Example

```ts
import { ClassAction } from 'class-action'
const reaction1 = new ClassAction(), reaction2 = new ClassAction();
const myClassAction = new ClassAction(reaction1, reaction2);
myClassAction.removeReaction(reaction2);
```

#### Defined in

[class-action.ts:223](https://github.com/mksunny1/class-action/blob/99e9dbff5e20c254b0433d21d21fcbb4bdbd7f51/src/class-action.ts#L223)

***

### getReactions()

> `static` **getReactions**\<`T`\>(`context`?): [`ClassAction`](ClassAction.md)\<`any`\>[]

This is the method called by instances to obtain the static reactions.
It enables a more dynamic way of overriding static reactions in a 
derived class.
By default it simply returns [ClassAction.reactions](ClassAction.md#reactions-1).

#### Type Parameters

• **T**

#### Parameters

• **context?**: `T`

#### Returns

[`ClassAction`](ClassAction.md)\<`any`\>[]

#### Example

```ts
import { ClassAction } from 'class-action'
const reaction1 = new ClassAction(), reaction2 = new ClassAction();
class MyClassAction extends ClassAction {
   static reactions = [reaction1, reaction2]
}
MyClassAction.getReactions();
```

#### Defined in

[class-action.ts:89](https://github.com/mksunny1/class-action/blob/99e9dbff5e20c254b0433d21d21fcbb4bdbd7f51/src/class-action.ts#L89)
