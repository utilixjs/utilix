# TimeSpan

Object that represents a time interval (duration of time or elapsed time) that is measured as a positive or negative number of days, hours, minutes, seconds, and fractions of a second. 

## Usage

### Basic

```ts
import { TimeSpan } from 'utilix';

// initializes with the total number of milliseconds
const time = new TimeSpan(44711000);

console.log(time.hours);   // 12
console.log(time.minutes); // 25
console.log(time.seconds); // 11

// initializes with specified number of hours, minutes, and seconds
console.log((new TimeSpan(2, 99, 18)).toString()); // 03:39:18
```

### From time unit

```ts
import { TimeSpan } from 'utilix';

console.log(TimeSpan.fromDays(1.23456).toString());    // 1.05:37:45.984
console.log(TimeSpan.fromHours(0.2539).toString());    // 00:15:14.040
console.log(TimeSpan.fromMinutes(60).toString());      // 01:00:00
console.log(TimeSpan.fromSeconds(32.157).toString());  // 00:00:32.157
```

### Parse

```ts
import { TimeSpan } from 'utilix';

console.log(TimeSpan.parse('54864').toString('s.ff'));   // 54.86
console.log(TimeSpan.parse('77:88:99.100').toString());  // 3.06:29:39.100
console.log(TimeSpan.parse('498.57s').toString());       // 00:08:18.570
console.log(TimeSpan.parse('1:1').toString());           // 00:01:01
console.log(TimeSpan.parse('-24.3d').toString());        // -24.07:12:00
```

### Getter function

```ts
import { TimeSpan } from "utilix";

const initTime = Date.now();
const upTime =  new TimeSpan(() => Date.now() - initTime);

setInterval(() => {
	console.log("Up time:", upTime.toString());
}, 1000);
```

## Format

You can use the `formatted` property or `toString` function to get formatted time interval according to the string of tokens passed in (`-[d\.]hh:mm:ss[\.fff]` by default).

```ts
const time = new TimeSpan(251000);

console.log(time.formatted); // 00:04:11
console.log(time.toString('m:ss')); // 4:11
```

::: tip
The `[]` token can be used in the format string to conditionally print time unit only when the absolute value of the total number (except for seconds fractions which in this case the value itself) is not zero, you can also add suffix and/or prefix but it should be with literal string delimiter `''` or escape character `\`.

```ts
const time = new TimeSpan(518651000);
console.log(time.toString('[d\\:][hh\\:]mm:ss[\\.fff]')); // 6:00:04:11
```
:::

**List of all available format tokens:**

| Token          | Output   | Description                                                                                   |
| --------------- | -------- | --------------------------------------------------------------------------------------------- |
| `-`             | -        | Negative sign, which indicates a negative time interval.                                      |
| `+`             | + -      | Positive or negative sign, that indicates the time interval.                                  |
| `d`             | 0-...    | The number of days.                                                                           |
| `dd`-`dddddddd` | 00-...   | The number of days, padded with leading zeros as needed.                                      |
| `h`             | 0-23     | The number of hours.                                                                          |
| `hh`            | 00-23    | The number of hours, 2-digits.                                                                |
| `H`             | 0-...    | The total number of hours.                                                                    |
| `HH`            | 0-...    | The total number of hours, padded with leading zeros as needed.                               |
| `hh`            | 00-23    | The number of hours, 2-digits.                                                                |
| `m`             | 0-59     | The number of minutes.                                                                        |
| `mm`            | 00-59    | The number of minutes, 2-digits.                                                              |
| `M`             | 0-...    | The total number of minutes.                                                                  |
| `MM`            | 0-...    | The total number of minutes, padded with leading zeros as needed.                             |
| `s`             | 0-59     | The number of seconds.                                                                        |
| `ss`            | 00-59    | The number of seconds, 2-digits.                                                              |
| `S`             | 0-...    | The total number of seconds.                                                                  |
| `SS`-`SSSSSSSS` | 00-...   | The total number of seconds, padded with leading zeros as needed.                             |
| `f`             | 0-9      | The tenths of a second.                                                                       |
| `ff`            | 00-99    | The hundredths of a second.                                                                   |
| `fff`           | 000-999  | The number of milliseconds.                                                                   |
| `'string'`      | _string_ | Literal string delimiter.                                                                     |
| `\S`            | _S_      | The escape character.                                                                         |
| `[hh\:]`        | 05:      | Conditionally print with suffix and/or prefix when the value of the total number is not zero. |
