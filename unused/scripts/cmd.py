
#!/usr/bin/env python3
"""Simple helper to run shell commands.

Usage:
  python scripts/cmd.py <command parts...>
Example:
  python scripts/cmd.py ls -la /tmp
"""
import subprocess
from typing import List


def run_cmd(command: str) -> None:
    """Run a shell command, streaming stdout/stderr to the terminal.

    Raises CalledProcessError on non-zero exit.
    """
    print(f"> {command}")
    try:
        subprocess.run(command, shell=True, check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error executing command '{command}': {e}")
        raise


def run_cmds(commands: List[str]) -> None:
    for c in commands:
        run_cmd(c)


if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(prog="cmd.py", description="Run a shell command from Python")
    parser.add_argument('command', nargs='+', help='Shell command parts (they will be joined)')
    args = parser.parse_args()
    run_cmd(' '.join(args.command))

