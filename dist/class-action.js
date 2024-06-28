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
export class ClassAction {
    /**
     * Creates a new ClassAction object containing the optionally provided reactions.
     *
     * @example
     * import { ClassAction } from 'class-action'
     * const classAction = new ClassAction()
     *
     * @param reactions
     */
    constructor(...reactions) {
        if (reactions.length) {
            if (!(this.hasOwnProperty('reactions')))
                this.reactions = reactions;
            else
                this.reactions.push(...reactions);
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
    static getReactions(context) {
        if (!(this.hasOwnProperty('reactions')))
            return [];
        else
            return this.reactions;
    }
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
    *getReactions(context) {
        if (this.hasOwnProperty('reactions')) {
            for (let reaction of this.reactions)
                yield reaction;
        }
        if (this.hasOwnProperty('keyedReactions')) {
            let reaction;
            for (let reactions of Object.values(this.keyedReactions))
                for (reaction of reactions)
                    yield reaction;
        }
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
    *getAllReactions(context) {
        for (let reaction of this.constructor.getReactions(context))
            yield reaction;
        for (let reaction of this.getReactions(context))
            yield reaction;
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
    act(context) {
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
    doAction(context) {
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
    doReactions(context) {
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
    addReactions(...reactions) {
        if (!(this.hasOwnProperty('reactions')))
            this.reactions = [];
        this.reactions.push(...reactions);
    }
    /**
     * Adds the given reactions to the list of reactions with the key.
     *
     * @param reactionKey
     * @param reactions
     */
    addKeyedReactions(reactionKey, ...reactions) {
        if (!(this.hasOwnProperty('keyedReactions')))
            this.keyedReactions = {};
        if (!(this.keyedReactions.hasOwnProperty(reactionKey)))
            this.keyedReactions[reactionKey] = [];
        this.keyedReactions[reactionKey].push(...reactions);
    }
    /**
     * Removes the specified reactions.
     *
     * @example
     * import { ClassAction } from 'class-action'
     * const reaction1 = new ClassAction(), reaction2 = new ClassAction();
     * const myClassAction = new ClassAction(reaction1, reaction2);
     * myClassAction.removeReactions(reaction2);
     *
     * @param reactions
     */
    removeReactions(...reactions) {
        if (!(this.hasOwnProperty('reactions')))
            return;
        for (let reaction of reactions) {
            this.reactions.splice(this.reactions.indexOf(reaction), 1);
        }
    }
    /**
     * Removes the reactions with the specified keys.
     *
     * @param reactionKeys
     * @returns
     */
    removeKeyedReactions(...reactionKeys) {
        if (!(this.hasOwnProperty('keyedReactions')))
            return;
        for (let key of reactionKeys)
            delete this.keyedReactions[key];
    }
}
