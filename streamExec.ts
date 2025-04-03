/**
 * Executes a shell command asynchronously and streams stdout and stderr.
 * 
 * @param command The shell command to execute.
 * @param options Additional options for Deno.Command (optional).
 * @param stdoutCallback Callback function to handle stdout (default: console.log).
 * @param stderrCallback Callback function to handle stderr (default: console.error).
 * @returns A promise that resolves with the command's exit code.
 */
export async function streamExec(
  command: string,
  options: Deno.CommandOptions = {},
  stdinValue = "",
  stdoutCallback = console.log,
  stderrCallback = console.error,
): Promise<number> {
  const process = new Deno.Command(command, {
    ...options,
    stdin: "piped",
    stdout: "piped",
    stderr: "piped",
  }).spawn();

  const stdinWriter = process.stdin.getWriter();
  await stdinWriter.write(new TextEncoder().encode(stdinValue));
  stdinWriter.close();

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

  const { code } = await process.status;
  return code;
}
