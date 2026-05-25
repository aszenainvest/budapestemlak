import pty
import os
import sys

# Command to run
cmd = ["pnpm", "payload", "migrate:create", "add_property_archive_block"]

print("[Python Script] Starting pseudo-terminal spawn...", flush=True)

# Spawn process with pseudo-terminal
pid, fd = pty.fork()

if pid == 0:
    # Child process
    os.execvp(cmd[0], cmd)
else:
    # Parent process
    buffer = b""
    while True:
        try:
            data = os.read(fd, 1024)
            if not data:
                break
            # Write to stdout
            sys.stdout.buffer.write(data)
            sys.stdout.flush()
            
            buffer += data
            # Check for prompts in the buffer
            if b"created or renamed" in buffer or b"Is enum" in buffer or b"Is table" in buffer or b"\xe2\x9d\xaf" in buffer:
                # Detected a prompt, write CR to the pseudo-terminal input
                print("\n[Python Script] Detected prompt, writing CR to pseudo-terminal...", flush=True)
                os.write(fd, b"\r")
                buffer = b""
        except OSError:
            break

    # Wait for child to exit
    _, status = os.waitpid(pid, 0)
    print(f"\n[Python Script] Migration generator finished with status {status}", flush=True)
