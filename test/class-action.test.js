import { ClassAction } from "../dist/class-action.js";
import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert'

describe('ClassAction.constructor', async (t) => {
    await it('Should construct a valid ClassAction', (t) => {
        const classAction = new ClassAction();
        assert.equal(classAction instanceof ClassAction, true);
        assert.deepEqual(Object.keys(classAction), []);
    });

    await it('Should construct a ClassAction containing the given reactions', (t) => {
        const reaction1 = new ClassAction(), reaction2 = new ClassAction();
        const classAction = new ClassAction(reaction1, reaction2);
        assert.deepEqual(classAction.reactions, [reaction1, reaction2]);
    });

    await it('Should allow subclasses to overwrite specified reactions ', (t) => {
        const reaction1 = new ClassAction(), reaction2 = new ClassAction();
        class MyClassAction extends ClassAction {
            reactions = [reaction1]
        }
        const classAction = new MyClassAction(reaction1, reaction2);
        assert.deepEqual(classAction.reactions, [reaction1]);
    });

    await it('Should allow subclasses to extend specified reactions ', (t) => {
        const reaction1 = new ClassAction(), reaction2 = new ClassAction();
        class MyClassAction extends ClassAction {
            constructor(...reactions) {
                super(reaction1, ...reactions)
            }
        }
        const classAction = new MyClassAction(reaction1, reaction2);
        assert.deepEqual(classAction.reactions, [reaction1, reaction1, reaction2]);
    });

});

describe('ClassAction.getReactions', async (t) => {
    await it('Should return all static reactions if present ', (t) => {
        const reaction1 = new ClassAction(), reaction2 = new ClassAction();
        class MyClassAction extends ClassAction {
            static reactions = [reaction1, reaction2]
        }
        assert.deepEqual(MyClassAction.getReactions(), [reaction1, reaction2]);
    });
    await it('Should return an empty arry if there are no static reactions ', (t) => {
        assert.deepEqual(ClassAction.getReactions(), []);
    });
});

describe('ClassAction#getReactions', async (t) => {
    await it('Should return all instance reactions if present ', (t) => {
        const reaction1 = new ClassAction(), reaction2 = new ClassAction();
        const classAction = new ClassAction(reaction1, reaction2);
        assert.deepEqual(classAction.getReactions(), [reaction1, reaction2]);
    });
    await it('Should return an empty arry if there are no instance reactions ', (t) => {
        const classAction = new ClassAction();
        assert.deepEqual(classAction.getReactions(), []);
    });
});

describe('ClassAction#getAllReactions', async (t) => {
    await it('Should return all static and instance reactions ', (t) => {
        const reaction1 = new ClassAction(), reaction2 = new ClassAction();
        class MyClassAction extends ClassAction {
            static reactions = [reaction1, reaction2]
        }
        const classAction = new MyClassAction(reaction1, reaction2);
        assert.deepEqual(classAction.getAllReactions(), [reaction1, reaction2, reaction1, reaction2]);
    });
});

describe('ClassAction.doAction', async (t) => {
    await it('Should perform only the local action ', (t) => {
        let count = 0;
        class MyClassAction extends ClassAction {
            doAction(context) {
                count++;
            }
        }
        const classAction = new MyClassAction(new MyClassAction(), new MyClassAction());
        assert.equal(count, 0);
        classAction.doAction();
        assert.equal(count, 1);
    });
});

describe('ClassAction.act', async (t) => {
    await it('Should perform the local action and the reactions ', (t) => {
        let count = 0;
        class MyClassAction extends ClassAction {
            doAction(context) {
                count++;
            }
        }
        const classAction = new MyClassAction(new MyClassAction(), new MyClassAction());
        assert.equal(count, 0);
        classAction.act();
        assert.equal(count, 3);
    });
});

describe('ClassAction.doReactions', async (t) => {
    await it('Should trigger only the reactions ', (t) => {
        let count = 0;
        class MyClassAction extends ClassAction {
            doAction(context) {
                count++;
            }
        }
        const classAction = new MyClassAction(new MyClassAction(), new MyClassAction());
        assert.equal(count, 0);
        classAction.doReactions();
        assert.equal(count, 2);
    });
});

describe('ClassAction.addReactions', async (t) => {
    await it('Should add all specified reactions ', (t) => {
        const reaction1 = new ClassAction(), reaction2 = new ClassAction();
        const classAction = new ClassAction(reaction1, reaction2);
        assert.deepEqual(classAction.reactions, [reaction1, reaction2]);
        classAction.addReactions(reaction2, reaction2);
        assert.deepEqual(classAction.reactions, [reaction1, reaction2, reaction2, reaction2]);
    });
});

describe('ClassAction.removeReaction', async (t) => {
    await it('Should remove the specified reaction ', (t) => {
        const reaction1 = new ClassAction(), reaction2 = new ClassAction();
        const classAction = new ClassAction(reaction1, reaction2);
        assert.deepEqual(classAction.reactions, [reaction1, reaction2]);
        classAction.removeReaction(reaction2);
        assert.deepEqual(classAction.reactions, [reaction1]);
    });
});
