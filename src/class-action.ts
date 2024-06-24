/**
 * An object which can produce an effect and trigger all its reactions 
 * to produce theirs. It enables a form of metaprogramming where we 
 * replace object methods with class actions which can both perform an 
 * operation (like normal methods) and invoke further operations on 
 * reactions they contain. Reactions are also class actions, so we can 
 * compose operations to any depth we want. We can easily modify 
 * class-action trees since everything is accessible in a few properties 
 * and methods.
 * 
 * These are just some of the use cases we have found for this primitive:
 * 
 * 1. Writing composable and extensible functions and methods.
 * 
 * 2. Creating more flexible class implementations with parts that can be 
 * augmented, changed or stripped down later without memory or 
 * performance hit.
 * 
 * 3. Wrapping regular objects to reactively perform  
 * operations like setting or deleting properties or calling 
 * methods.
 * 
 * 
 * 
 */
export class ClassAction<T> {
    /**
     * Static reactions. These will be associated with all class-action 
     * instances created with the same class without being present on 
     * every instance. In most cases, such actions should be stateless, 
     * though you may deliberately want to share state in some scenarios.
     * 
     * @example
     * import { ClassAction } from 'class-action'
     * const reaction1 = new ClassAction(), reaction2 = new ClassAction();
     * class MyClassAction extends ClassAction {
     *    static reactions = [reaction1, reaction2]
     * }
     * const myClassAction1 = new MyClassAction();
     * const myClassAction2 = new MyClassAction();
     * 
     */
    static reactions: ClassAction<any>[];

    /**
     * Instance reactions. These are reactions added to every class-action 
     * instance. They may be necessary when they require internal state that 
     * differ between instances.
     * 
     * @example
     * import { ClassAction } from 'class-action'
     * const reaction1 = new ClassAction(), reaction2 = new ClassAction();
     * const myClassAction = new ClassAction(reaction1, reaction2);
     * 
     */
    reactions?: ClassAction<any>[]
    
    /**
     * Creates a new ClassAction object containing the optionally provided reactions.
     * 
     * @example
     * import { ClassAction } from 'class-action'
     * const classAction = new ClassAction()
     * 
     * @param reactions 
     */
    constructor(...reactions: ClassAction<any>[]) {
        if (reactions.length) {
            if (!(this.hasOwnProperty('reactions'))) this.reactions = reactions;
            else this.reactions.push(...reactions);
        }
    }
    /**
     * This is the method called by instances to obtain the static reactions.
     * It enables a more dynamic way of overriding static reactions in a 
     * derived class.
     * By default it simply returns {@link ClassAction.reactions}.
     * 
     * @example
     * import { ClassAction } from 'class-action'
     * const reaction1 = new ClassAction(), reaction2 = new ClassAction();
     * class MyClassAction extends ClassAction {
     *    static reactions = [reaction1, reaction2]
     * }
     * MyClassAction.getReactions();
     * 
     * @returns 
     */
    static getReactions<T>(context?: T) { return this.reactions || [] }

    /**
     * Returns all instance reactions of this ClassAction.
     * By default it simply returns {@link ClassAction#reactions}.
     * 
     * @example
     * import { ClassAction } from 'class-action'
     * const reaction1 = new ClassAction(), reaction2 = new ClassAction();
     * const myClassAction = new ClassAction(reaction1, reaction2);
     * myClassAction.getReactions();
     * 
     * @param context 
     * @returns 
     */
    getReactions(context?: T) { 
        if (!(this.hasOwnProperty('reactions'))) return []
        else return this.reactions
    }

    /**
     * Gets all class and instance reactions. This is used internally 
     * to obtain all reactions to trigger after the local action has 
     * been executed.
     * 
     * @example
     * import { ClassAction } from 'class-action'
     * const reaction1 = new ClassAction(), reaction2 = new ClassAction();
     * class MyClassAction extends ClassAction {
     *    static reactions = [reaction1, reaction2]
     * }
     * const myClassAction = new MyClassAction(reaction1, reaction2);
     * myClassAction.getAllReactions();
     * 
     * @param context 
     * @returns 
     */
    getAllReactions(context?: T) {
        const result = (<typeof ClassAction>this.constructor).getReactions(context);
        return [result, this.getReactions(context)].flat();
    }
    /**
     * Performs the local action and triggers all reactions.
     * 
     * @example
     * import { ClassAction } from 'class-action'
     * class MyClassAction extends ClassAction {
     *    doAction(context) {
     *      console.log(context.msg);
     *    }
     * }
     * const myClassAction = new MyClassAction(new MyClassAction(), new MyClassAction());
     * myClassAction.act({ msg: 'nice work' });
     * // prints 'nice work' thrice...
     * 
     */
    act(context?: T): any {
        this.doAction(context);
        this.doReactions(context);
    }
    /**
     * Performs the local action
     * 
     * @example
     * import { ClassAction } from 'class-action'
     * class MyClassAction extends ClassAction {
     *    doAction(context) {
     *      console.log(context.msg);
     *    }
     * }
     * const myClassAction = new MyClassAction(new MyClassAction(), new MyClassAction());
     * myClassAction.doAction({ msg: 'nice work' });
     * // prints 'nice work' once...
     * 
     * @param context 
     */
    doAction(context?: T): any {
        
    }
    /**
     * Triggers all reactions of this ClassAction
     * 
     * @example
     * import { ClassAction } from 'class-action'
     * class MyClassAction extends ClassAction {
     *    doAction(context) {
     *      console.log(context.msg);
     *    }
     * }
     * const myClassAction = new MyClassAction(new MyClassAction(), new MyClassAction());
     * myClassAction.doReactions({ msg: 'nice work' });
     * // prints 'nice work' twice...
     * 
     * @param context 
     */
    doReactions(context?: T): any {
        for (let reaction of this.getAllReactions(context)) {
            reaction.act(context);
        }
    }
    /**
     * Adds the given reactions to this ClassAction. This allows for  
     * more implementation flexibility in derived classes.
     * 
     * @example
     * import { ClassAction } from 'class-action'
     * const reaction1 = new ClassAction(), reaction2 = new ClassAction();
     * const myClassAction = new ClassAction(reaction1, reaction2);
     * class MyClassAction extends ClassAction {
     *    doAction(context) {
     *      console.log('Added reaction');
     *    }
     * }
     * myClassAction.addReactions(new MyClassAction())
     * myClassAction.act()
     * 
     * @param reactions 
     */
    addReactions(...reactions: ClassAction<any>[]) {
        if (!(this.hasOwnProperty('reactions'))) this.reactions = [];
        this.reactions.push(...reactions);
    }

    /**
     * Removes the specified reaction.
     * 
     * @example
     * import { ClassAction } from 'class-action'
     * const reaction1 = new ClassAction(), reaction2 = new ClassAction();
     * const myClassAction = new ClassAction(reaction1, reaction2);
     * myClassAction.removeReaction(reaction2);
     * 
     * @param reaction 
     */
    removeReaction(reaction: ClassAction<any>) {
        if (!(this.hasOwnProperty('reactions'))) return;
        this.reactions.splice(this.reactions.indexOf(reaction), 1);
    }
}
