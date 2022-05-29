import EventEmitter from 'events';
import { once } from './once-emitted.mjs';
import { test } from 'tape';

test('resolves on first invocation if no resolveOn or rejectOn functions are passed', async function(t) {
  const emitter = new EventEmitter();
  const promise = once(emitter, 'changed');

  emitter.emit('changed', 'argument');

  const result = await promise;
  t.ok(result);
});

test('does not resolve on other events', async function(t) {
  const emitter = new EventEmitter();
  const promise = once(emitter, 'changed');

  emitter.emit('not changed', 'not changed argument');
  emitter.emit('still not changed', 'still not changed argument');
  emitter.emit('changed', 'changed argument');

  const result = await promise;
  t.same(result, ['changed argument']);
});

test('rejects on timeout', async function(t) {
  const emitter = new EventEmitter();
  t.plan(1);
  
  try {
    const result = await once(emitter, 'changed', { timeout: 100 });
    t.fail(result);
  } catch (error) {
    t.ok(error);
  }
});

test('resolves when resolveOn returns true', async function(t) {
  const emitter = new EventEmitter();
  t.plan(1);

  try {
    const promise = once(emitter, 'changed', {
      timeout: 100,
      resolveOn: (...args) => (args[0] === 'changed argument')
    });

    emitter.emit('not changed', 'not changed argument');
    emitter.emit('still not changed', 'still not changed argument');
    emitter.emit('changed', 'changed argument');


    const result = await promise;
    t.ok(result);
  } catch (error) {
    t.fail(error);
  }
});

test('rejects when rejectOn returns true', async function(t) {
  const emitter = new EventEmitter();
  t.plan(1);

  try {
    const promise = once(emitter, 'changed', {
      timeout: 100,
      rejectOn: (...args) => (args[0] === 'changed argument')
    });

    emitter.emit('not changed', 'not changed argument');
    emitter.emit('still not changed', 'still not changed argument');
    emitter.emit('changed', 'changed argument');

    const result = await promise;
    t.fail(result);
  } catch (error) {
    t.ok(error);
  }
});

test('resolves when event that satisfies resolvesOn is emitted before one that satisfies rejectsOn', async function(t) {
  const emitter = new EventEmitter();
  t.plan(1);

  try {
    const promise = once(emitter, 'changed', {
      timeout: 100,
      resolveOn: (...args) => (args[0] === 'pass'),
      rejectOn: (...args) => (args[0] === 'fail')
    });

    emitter.emit('changed', 'pass');
    emitter.emit('changed', 'fail');

    const result = await promise;
    t.ok(result);
  } catch (error) {
    t.fail(error);
  }
});

test('rejects when event that satisfies rejectsOn is emitted before one that satisfies resolvesOn', async function(t) {
  const emitter = new EventEmitter();
  t.plan(1);

  try {
    const promise = once(emitter, 'changed', {
      timeout: 100,
      resolveOn: (...args) => (args[0] === 'pass'),
      rejectOn: (...args) => (args[0] === 'fail')
    });

    emitter.emit('changed', 'fail');
    emitter.emit('changed', 'pass');

    const result = await promise;
    t.fail(result);
  } catch (error) {
    t.ok(error);
  }
});
