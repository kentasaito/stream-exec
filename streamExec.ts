/**
 * Executes a shell command asynchronously and streams stdout and stderr.
 * 
 * @param command The shell command to execute.
 * @param options Additional options for Deno.Command (optional).
 * @param stdoutCallback The callback function to handle stdout (default: console.log).
 * @param stderrCallback The callback function to handle stderr (default: console.error).
 * @returns A promise that resolves once the command finishes execution.
 */
export async function streamExec(
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
