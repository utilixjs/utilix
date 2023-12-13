# Elapse

Calculates and tracks the elapsed time, to create a customizable timer that can be started, paused, resumed, and stopped. It’s useful for tracking elapsed time in applications where you need to manage time-based events.

- `resume()`: Resumes the elapse timer.
- `stop()`: Stops the elapse timer.

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

// Start the elapse timer
elapse.start();

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
