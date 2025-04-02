async function streamExec(
  command: string,
  options: Deno.CommandOptions = {},
  stdoutCallback = console.log,
  stderrCallback = console.error,
) {
  const process = new Deno.Command(command, {
    ...options,
    stdout: "piped",
    stderr: "piped",
  }).spawn();

  const stdoutReader = process.stdout.getReader();
  const stderrReader = process.stderr.getReader();
  const decoder = new TextDecoder();

  async function readStream(
    reader: ReadableStreamDefaultReader<Uint8Array>,
    callback: (msg: string) => void,
  ) {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      callback(decoder.decode(value).trim());
    }
  }

  await Promise.all([
    readStream(stdoutReader, stdoutCallback),
    readStream(stderrReader, stderrCallback),
  ]);
}
