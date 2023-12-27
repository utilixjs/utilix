# Elapse

Calculates and tracks the elapsed time, to create a customizable timer that can be started, paused, resumed, and stopped. It’s useful for tracking elapsed time in applications where you need to manage time-based events.

## Usage

```ts
import { Elapse } from 'utilix';

// Create a new Elapse instance with a 1 second interval
const elapse = new Elapse({
	interval: 1000,
	onTick: (time) => {
		console.log(`Elapsed time: ${time}ms`);
	},
});

// After some time, pause the elapse timer
setTimeout(() => {
	elapse.pause();
}, 5000);

// After some more time, resume the elapse timer
setTimeout(() => {
	elapse.resume();
}, 10000);

// Finally, stop the elapse timer
setTimeout(() => {
	elapse.stop();
}, 15000);
```

### Manual start

By default the elapse timer will start immediately, to disable this behavior, set the `interval.immediate` option to `false`:

```ts
const elapse = new Elapse({
	interval: { delay: 1000, immediate: false },
	// ...
});

// Start the elapse timer manually
elapse.start();
```
