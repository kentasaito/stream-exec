# stream-exec

A Deno module for executing shell commands asynchronously with real-time stdout and stderr streaming.

## Features

- Executes commands asynchronously
- Streams both stdout and stderr line by line
- Supports callback functions for custom handling

## Installation

```sh
deno add jsr:@kenta/stream-exec
```

## Usage

```ts
import { streamExec } from "@kenta/stream-exec";

await streamExec("echo One; sleep 1; echo T-W-O >&2; sleep 1; echo Three!", {
  stdoutCallback: (data) => console.log("stdout:", data),
  stderrCallback: (data) => console.error("stderr:", data),
});
```

