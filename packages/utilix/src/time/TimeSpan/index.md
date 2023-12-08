# TimeSpan

Object that represents a time interval (duration of time or elapsed time) that is measured as a positive or negative number of days, hours, minutes, seconds, and fractions of a second. 

## Format

You can use the `formatted` property or `toString` function to get formatted time interval according to the string of tokens passed in (`-[d\.]hh:mm:ss[\.fff]` by default).

```ts
const time = new TimeSpan(251000);

console.log(time.formatted); // 00:04:11
console.log(time.toString('m:ss')); // 4:11
```

::: tip
You can use the `[]` token in the format string to conditionally print time unit only when the absolute value of the total number (except for seconds fractions which in this case the value itself) is not zero, you can also add suffix and/or prefix but it should be with literal string delimiter `''` or escape character `\`.

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
