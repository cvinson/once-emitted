# Once-Emitted
### Create a Promise that listens for an event and can resolve or reject based on the event's arguments

[![Node.js CI](https://github.com/cvinson/once-emitted/actions/workflows/test.yml/badge.svg)](https://github.com/cvinson/once-emitted/actions/workflows/test.yml)

## Installation


## API

### once(emitter, eventName, { timeout, resolveOn, rejectOn });

Creates a promise that listens to `emitter` for an event with the name `eventName`.
The promise will reject if the `timeout` (milliseconds) is reached without the event firing or without `resolveOn` or `rejectOn` returning `true`.
The `once` function will pass the emitter listener arguments through to `resolveOn` and `rejectOn`.

```javascript
import { once } from 'once-emitted';
import { EventEmitter } from 'events';

const emitter = new EventEmitter();

const promise = once(emitter, 'statusChange', {
  timeout: 10000,
  resolveOn: (status) => (status === 'initialized'),
  rejectOn: (status) => (['timedOut', 'unauthorized'].includes(status))
});

emitter.emit('statusChange', 'initialized');

const result = await promise;

// { result: ['initialized'] }
```
