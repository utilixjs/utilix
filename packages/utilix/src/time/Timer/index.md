# Timer

Countdown timer that starts from a given initial time and counts down to zero. The countdown can be paused, resumed, and stopped.

## Usage

```ts
import { Timer, TimeSpan } from './';

const timer = new Timer(5000, {
	interval: 1000,
	onTick() {
		console.log(`Time: ${time.toString()}`);
	}
});
const time = new TimeSpan(() => timer.time);
time.setDefaultFormat("mm:ss");
```
