+++
title = "Automated Backups Using rclone + Box"
date = "2025-02-25"
description = "A guy decides to share his backup setup"

[extra]
comment = true
repo_view = true
read_time = true

[taxonomies]
tags=["tutorial"]
+++

## Motivation

As a college student, I've had my fair share of data loss nightmares. From the time my final project got corrupted right before finals week to accidentally deleting important files, I've learned the hard way that **regular backups are non-negotiable**. Fortunately, most universities provide students with cloud storage – in my case, Rice University gives each student a generous 2TB of Box storage. But how do we efficiently use this resource for automatic, reliable backups? Enter rclone, the command-line Swiss Army knife for cloud storage.

## What is rclone?

Rclone is a command-line program that allows you to sync files between your local machine and various cloud storage providers. Think of it as rsync for the cloud, but with Windows support built-in! It supports dozens of cloud storage systems including Box, Google Drive, Dropbox, and OneDrive. The beauty of rclone is that it's:

- Free and open-source
- Feature-rich (encryption, filtering, mounting, etc.)
- Incredibly efficient with bandwidth and resources
- Cross-platform (works on Windows, macOS, Linux, and more)
- No GUI required (though GUI wrappers exist for those who prefer them)
- Scriptable for easy automation

Here's what my Box storage usage looks like after using rclone for over a year:

```
Storage Used
764.9 GB of 2.0 TB
Max File Size
50.0 GB
```

While rclone is a command-line tool, don't let that intimidate you if you're a Windows user! I'll provide detailed instructions for all platforms, with special attention to Windows-specific considerations throughout this guide.

Let's get started with setting up your own automated backup system!

## Installation

First, we need to install rclone on your machine. The process varies slightly depending on your operating system.

### Windows

For Windows users, there are several installation methods:

Method 1: Installer (Recommended for most users)
1. Download the installer from the [rclone downloads page](https://rclone.org/downloads/)
2. Run the `.exe` file
3. Follow the installation wizard
4. The installer will add rclone to your PATH automatically

Method 2: Portable zip file
1. Download the zip file from the [rclone downloads page](https://rclone.org/downloads/)
2. Extract the zip file to a location of your choice (e.g., `C:\Program Files\rclone`)
3. Add the folder to your PATH:
   - Right-click on "This PC" or "My Computer" and select "Properties"
   - Click on "Advanced system settings"
   - Click the "Environment Variables" button
   - In the "System variables" section, find and select the "Path" variable
   - Click "Edit"
   - Click "New" and add the path to your rclone folder
   - Click "OK" on all dialogs to save the changes

Method 3: Using Scoop
If you use the [Scoop](https://scoop.sh/) package manager for Windows:
```powershell
scoop install rclone
```

Method 4: WSL (Windows Subsystem for Linux)
If you use WSL, you can follow the Linux instructions below within your WSL environment.

### macOS

If you're using macOS (as I am), the easiest way to install rclone is with Homebrew:

```bash
$ brew install rclone flock
```

### Linux

On most Linux distributions, you can install rclone using your package manager:

Debian/Ubuntu:
```bash
$ sudo apt install rclone
```

Arch Linux
```bash
$ sudo pacman -S rclone
```

## Setting Up rclone with Box

Now that rclone is installed, we need to configure it to work with our Box account.

### Initial Configuration

Run the following command to start the configuration process:

```bash
$ rclone config
```

This interactive setup will walk you through creating a new remote connection. Here's what to expect:

```
No remotes found, make a new one?
n) New remote
s) Set configuration password
q) Quit config
n/s/q> n
name> box
```

Enter `n` to create a new remote, and name it `box` (or whatever you prefer).

```
Type of storage to configure.
Choose a number from below, or type in your own value
[list of storage types]
XX / Box
   \ "box"
[more options]
Storage> box
```

Choose `box` from the list of storage types.

```
Box App Client Id - leave blank normally.
client_id> 

Box App Client Secret - leave blank normally.
client_secret>
```

Unless you've created your own Box App (I'll show you how later), leave these blank and press Enter.

```
Box App config.json location
Leave blank normally.
Enter a string value. Press Enter for the default ("").
box_config_file>

Box App Primary Access Token
Leave blank normally.
Enter a string value. Press Enter for the default ("").
access_token>
```

Again, leave these blank and press Enter.

```
Enter a string value. Press Enter for the default ("user").
Choose a number from below, or type in your own value
 1 / Rclone should act on behalf of a user
   \ "user"
 2 / Rclone should act on behalf of a service account
   \ "enterprise"
box_sub_type>
```

Press Enter to select the default option (`user`).

```
Remote config
Use web browser to automatically authenticate rclone with remote?
 * Say Y if the machine running rclone has a web browser you can use
 * Say N if running rclone on a (remote) machine without web browser access
If not sure try Y. If Y failed, try N.
y) Yes
n) No
y/n> y
```

Type `y` and press Enter to authenticate via your web browser.

A browser window should open automatically. Log in to your Box account and authorize rclone for access. Once authorized, the browser window will display a success message, and you can close it and return to the terminal.

```
If your browser doesn't open automatically go to the following link: http://127.0.0.1:53682/auth?state=XXXXXXXXXXXXXXXXXXXXXX
Log in and authorize rclone for access
Waiting for code...
Got code
Configuration complete.
Options:
- type: box
- client_id:
- client_secret:
- token: {"access_token":"XXX","token_type":"bearer","refresh_token":"XXX","expiry":"XXX"}
Keep this "remote" remote?
y) Yes this is OK
e) Edit this remote
d) Delete this remote
y/e/d> y
```

Type `y` and press Enter to save the configuration.

### Testing the Connection

Let's make sure our connection works by listing the files in your Box account:

```bash
$ rclone ls box:
```

This command should list all files at the root of your Box account. If you see the file listing, congratulations – your rclone configuration is working correctly!

### Creating a Backup Script

Now that rclone is configured, let's create a backup script to automate the process. The script will synchronize specified directories from your local machine to Box.

Here's a basic example:

```bash
#!/bin/bash
SOURCE="$HOME"
DEST="box:backup"
EXCLUDE_FILE="$HOME/.config/rclone/exclude_backup"

rclone sync --update --verbose --transfers 30 --checkers 8 \
  --contimeout 60s --timeout 300s --retries 3 --low-level-retries 10 \
  --stats 30s --exclude-from "$EXCLUDE_FILE" \
  --delete-excluded "$SOURCE" "$DEST"
```

Let's break down what this script does:

- `SOURCE="$HOME"` - Sets the source directory to your home directory.
- `DEST="box:backup"` - Sets the destination to a folder called "backup" in your Box account.
- `EXCLUDE_FILE="$HOME/.config/rclone/exclude_backup"` - Specifies a file containing patterns of files/directories to exclude.
- `rclone sync` - Synchronizes the source directory to the destination.
  - `--update` - Skip files that are newer on the destination.
  - `--verbose` - Show detailed progress.
  - `--transfers 30` - Number of file transfers to run in parallel.
  - `--checkers 8` - Number of checkers to run in parallel.
  - `--contimeout 60s` - Connect timeout.
  - `--timeout 300s` - I/O timeout.
  - `--retries 3` - Number of retries if a file transfer fails.
  - `--low-level-retries 10` - Number of low-level retries.
  - `--stats 30s` - Print stats every 30 seconds.
  - `--exclude-from "$EXCLUDE_FILE"` - Read exclude patterns from the specified file.
  - `--delete-excluded` - Delete files from the destination that are excluded.

### Creating an Exclude File

The exclude file is crucial for efficient backups. It prevents unnecessary files from being backed up, saving both time and storage space.

For macOS/Linux:

Create the exclude file:

```bash
$ mkdir -p ~/.config/rclone
$ touch ~/.config/rclone/exclude_backup
```

For Windows:

Create the exclude file:

```bat
mkdir "C:\Users\YourUsername\rclone"
echo. > "C:\Users\YourUsername\rclone\exclude_backup.txt"
```

Now edit this file with your favorite text editor and add patterns for files and directories you want to exclude from your backups.

Example for macOS:
```
# Temporary files
*.tmp
*.temp
.DS_Store

# Cache directories
/Users/*/Library/Caches/**
/Users/*/Library/Application Support/Google/Chrome/Default/Cache/**
/Users/*/Library/Containers/com.docker.docker/**

# Package managers
/Users/*/node_modules/**
/Users/*/.npm/**
/Users/*/.cargo/**
/Users/*/.rustup/**

# Virtual environments
/Users/*/venv/**
/Users/*/.venv/**
/Users/*/env/**
/Users/*/.env/**

# Large data and logs
*.log
*.iso
*.dmg
```

Example for Windows:
```
# Temporary files
*.tmp
*.temp
Thumbs.db

# Cache directories
C:\Users\*\AppData\Local\Temp\**
C:\Users\*\AppData\Local\Google\Chrome\User Data\Default\Cache\**
C:\Users\*\AppData\Local\Docker\**

# Package managers
C:\Users\*\node_modules\**
C:\Users\*\AppData\Roaming\npm\**
C:\Users\*\.cargo\**
C:\Users\*\.rustup\**

# Virtual environments
C:\Users\*\venv\**
C:\Users\*\.venv\**
C:\Users\*\env\**
C:\Users\*\.env\**

# Large data and logs
*.log
*.iso
*.wim
```

Feel free to customize this list according to your needs. The patterns follow the same format as `.gitignore` files, with a few additions:

- `*` matches any sequence of non-separator characters
- `**` matches any sequence of characters including separators
- `?` matches any single non-separator character
- `[chars]` matches any character in the set
- `{alt1,alt2}` matches any of the alternatives

### Making the Script Executable

Save your backup script to a file, e.g., `~/bin/backup_to_box.sh`, and make it executable:

```bash
$ mkdir -p ~/bin
$ nano ~/bin/backup_to_box.sh
# Paste the script content and save
$ chmod +x ~/bin/backup_to_box.sh
```

### Enhancing Your Backup Script

Let's improve our basic script with some additional features. I'll provide examples for both macOS/Linux and Windows.

For macOS/Linux:

```bash
#!/bin/bash

# Configuration
SOURCE="$HOME"
DEST="box:backup"
EXCLUDE_FILE="$HOME/.config/rclone/exclude_backup"
LOG_FILE="$HOME/.local/share/backup/rclone_backup.log"
LOCK_FILE="/tmp/box_backup.lock"

# Create log directory if it doesn't exist
mkdir -p "$(dirname "$LOG_FILE")"
mkdir -p "$HOME/.local/share/backup"

# Save a list of installed packages before backup
if command -v brew >/dev/null 2>&1; then
    /opt/homebrew/bin/brew list > "$HOME/.local/share/backup/brew_list.txt"
fi

# Use flock to ensure only one instance runs at a time
if command -v flock >/dev/null 2>&1; then
    exec /opt/homebrew/bin/flock -n "$LOCK_FILE" rclone sync \
        --update --verbose --transfers 30 --checkers 8 \
        --contimeout 60s --timeout 300s --retries 3 \
        --low-level-retries 10 --stats 30s \
        --exclude-from "$EXCLUDE_FILE" --delete-excluded \
        "$SOURCE" "$DEST" 2>&1 | tee -a "$LOG_FILE"
else
    # If flock is not available, just run rclone
    rclone sync --update --verbose --transfers 30 --checkers 8 \
        --contimeout 60s --timeout 300s --retries 3 \
        --low-level-retries 10 --stats 30s \
        --exclude-from "$EXCLUDE_FILE" --delete-excluded \
        "$SOURCE" "$DEST" 2>&1 | tee -a "$LOG_FILE"
fi
```

For Windows:

```bat
@echo off
setlocal enabledelayedexpansion

:: Configuration
set "SOURCE=C:\Users\YourUsername"
set "DEST=box:windows_backup"
set "EXCLUDE_FILE=C:\Users\YourUsername\rclone\exclude_backup.txt"
set "LOG_FILE=C:\Users\YourUsername\rclone\logs\rclone_backup.log"
set "LOCK_FILE=C:\Users\YourUsername\rclone\backup.lock"
set "DATE_TIME=%date:~-4,4%%date:~-7,2%%date:~-10,2%_%time:~0,2%%time:~3,2%%time:~6,2%"
set "DATE_TIME=!DATE_TIME: =0!"

:: Create log directory if it doesn't exist
if not exist "C:\Users\YourUsername\rclone\logs" mkdir "C:\Users\YourUsername\rclone\logs"

:: Save a list of installed programs before backup (using PowerShell)
powershell -Command "Get-ItemProperty HKLM:\Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall\* | Select-Object DisplayName | Sort-Object -Property DisplayName | Out-File -FilePath 'C:\Users\YourUsername\rclone\installed_programs.txt'"

:: Check if another instance is already running
if exist "%LOCK_FILE%" (
    echo Another backup is already in progress. Exiting... >> "%LOG_FILE%"
    exit /b 1
)

:: Create the lock file
echo %DATE_TIME% > "%LOCK_FILE%"

:: Start the backup
echo Starting backup at %DATE_TIME% >> "%LOG_FILE%"

:: Run rclone
"C:\Program Files\rclone\rclone.exe" sync ^
    --update --verbose --transfers 30 --checkers 8 ^
    --contimeout 60s --timeout 300s --retries 3 ^
    --low-level-retries 10 --stats 30s ^
    --exclude-from "%EXCLUDE_FILE%" --delete-excluded ^
    "%SOURCE%" "%DEST%" >> "%LOG_FILE%" 2>&1

:: Remove the lock file
del "%LOCK_FILE%"

echo Backup completed at %date% %time% >> "%LOG_FILE%"
echo. >> "%LOG_FILE%"
```

The Windows script includes:
1. Proper path handling for Windows file systems
2. Lock file mechanism to prevent multiple instances
3. Capturing installed programs using PowerShell
4. Detailed logging with timestamps

This enhanced script adds:

1. Logging to a file for easier troubleshooting
2. A lock mechanism to prevent multiple instances from running simultaneously
3. Automatic saving of installed packages (in this case, Homebrew packages)

### Automating Backups

Now that we have our script, let's set it up to run automatically at regular intervals.

#### Using cron (macOS/Linux):

On macOS and Linux, cron is the traditional way to schedule recurring tasks.

Edit your crontab file:

```bash
$ crontab -e
```

Here's my personal crontab setup that runs the backup twice daily (8 AM and 8 PM) and logs the output:

```
0 8 * * * /Users/charlie/.local/bin/backup-rclone &> /Users/charlie/.config/rclone/backup-rclone.log
0 20 * * * /Users/charlie/.local/bin/backup-rclone &> /Users/charlie/.config/rclone/backup-rclone.log
```

Here's what the numbers mean:
- `0` - minute (0-59)
- `8/20` - hour (0-23), running at 8 AM and 8 PM
- `*` - day of month (1-31)
- `*` - month (1-12)
- `*` - day of week (0-7, both 0 and 7 represent Sunday)

{{ note(clickable=true, header="Note", body="The cron job runs in a limited environment, so you might need to use full paths to all executables in your script. Notice how I've used absolute paths in my example above.") }}

#### Using launchd (macOS)

On macOS, you can also use launchd, which offers more flexibility than cron.

Create a plist file at `~/Library/LaunchAgents/com.user.box-backup.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.user.box-backup</string>
    <key>Program</key>
    <string>/Users/YOUR_USERNAME/bin/backup_to_box.sh</string>
    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>2</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>
    <key>StandardOutPath</key>
    <string>/Users/YOUR_USERNAME/.local/share/backup/stdout.log</string>
    <key>StandardErrorPath</key>
    <string>/Users/YOUR_USERNAME/.local/share/backup/stderr.log</string>
    <key>RunAtLoad</key>
    <false/>
</dict>
</plist>
```

Replace `YOUR_USERNAME` with your actual username. Then load the job:

```bash
$ launchctl load ~/Library/LaunchAgents/com.user.box-backup.plist
```

#### Using Task Scheduler (Windows)

Windows users can use Task Scheduler for automated backups. Here's a detailed guide:

1. First, create a batch file for your rclone command. Create a new file called `backup_to_box.bat` in an appropriate location (e.g., `C:\Users\YourUsername\Scripts\`):

```bat
@echo off
echo Starting Box backup at %date% %time% >> "C:\Users\YourUsername\backup_logs.txt"

:: Set paths with quotes to handle spaces in filenames
set SOURCE="C:\Users\YourUsername"
set DEST="box:windows_backup"
set EXCLUDE_FILE="C:\Users\YourUsername\rclone\exclude_backup.txt"

:: Create directories if they don't exist
if not exist "C:\Users\YourUsername\rclone" mkdir "C:\Users\YourUsername\rclone"

:: Run rclone with appropriate parameters
"C:\Program Files\rclone\rclone.exe" sync --update --verbose --transfers 30 ^
  --checkers 8 --contimeout 60s --timeout 300s --retries 3 ^
  --low-level-retries 10 --stats 30s ^
  --exclude-from "%EXCLUDE_FILE%" --delete-excluded ^
  "%SOURCE%" "%DEST%" >> "C:\Users\YourUsername\backup_logs.txt" 2>&1

echo Backup completed at %date% %time% >> "C:\Users\YourUsername\backup_logs.txt"
echo. >> "C:\Users\YourUsername\backup_logs.txt"
```

2. Now set up the task:
   - Open Task Scheduler (search for it in the Start menu)
   - Click "Create Task" (not "Create Basic Task" for more options)
   - On the General tab:
     - Enter a Name (e.g., "Box Backup")
     - Select "Run whether user is logged on or not" for unattended operation
     - Check "Run with highest privileges"

   - On the Triggers tab:
     - Click "New" to add a trigger
     - Select "Daily" and set it to run at your preferred time(s)
     - You can add multiple triggers for morning and evening backups

   - On the Actions tab:
     - Click "New"
     - Action: "Start a program"
     - Program/script: Browse to your batch file (`C:\Users\YourUsername\Scripts\backup_to_box.bat`)

   - On the Conditions tab:
     - Uncheck "Start the task only if the computer is on AC power" if you want it to run on battery
     - Consider checking "Start only if the following network connection is available" if you want it to run only on certain networks

   - On the Settings tab:
     - Check "Run task as soon as possible after a scheduled start is missed"
     - Set "If the task fails, restart every:" to handle temporary failures

3. Click "OK" and enter your password when prompted.

{{ note(clickable=true, header="Note", body="Windows paths use backslashes (\\) instead of forward slashes. Make sure all your paths use the correct format. Also, if you install rclone in a non-standard location, adjust the path to rclone.exe accordingly.") }}

## Advanced rclone Features

### Bandwidth Limiting

If you don't want your backups to saturate your internet connection, you can limit the bandwidth:

```bash
rclone sync --bwlimit 1M ...
```

This limits the transfer to 1 megabyte per second. You can also specify a time schedule:

```bash
rclone sync --bwlimit "08:00,512k 12:00,1M 18:00,512k 23:00,2M" ...
```

This sets different limits throughout the day.

Windows Example:
```bat
rclone sync --bwlimit "08:00,512k 12:00,1M 18:00,512k 23:00,2M" ^
  "C:\Users\YourUsername" box:backup
```

### Encryption

If you're concerned about the privacy of your data in the cloud, rclone supports encryption:

```bash
# Create an encrypted remote
$ rclone config
n) New remote
...
name> box-crypt
...
Type of storage> crypt
Remote to encrypt/decrypt> box:encrypted
...
```

Then use `box-crypt:` as your destination in your backup script.

### Fast Listing

For large directories with many files, you can speed up operations with fast list:

```bash
rclone sync --fast-list ...
```

This uses more memory but can significantly speed up the listing process.

### Mount

One of my favorite features is the ability to mount your Box storage as a local filesystem:

For macOS/Linux:
```bash
$ rclone mount box: ~/box --vfs-cache-mode writes &
```

For Windows:
```bat
rclone mount box: X: --vfs-cache-mode writes
```

This mounts your entire Box account at `~/box` on macOS/Linux or as drive `X:` on Windows. You can then browse it like any local directory.

{{ note(clickable=true, header="Note", body="For Windows users, the mount command requires WinFsp to be installed. Download it from <a href='https://winfsp.dev/'>https://winfsp.dev/</a> and install it before attempting to mount.") }}

### Serve

Rclone can also serve your files over HTTP, WebDAV, FTP, or SFTP:

```bash
$ rclone serve http box: --addr :8080
```

This allows you to access your Box files through a web browser at `http://localhost:8080`.

### Filtering Options

Rclone offers powerful filtering beyond the exclude file:

```bash
rclone sync --min-size 100k --max-size 5M ... # Only files between 100KB and 5MB
rclone sync --include "*.jpg" --include "*.png" ... # Only include JPGs and PNGs
rclone sync --exclude-if-present .norclone ... # Skip directories with .norclone file
```

## Troubleshooting

### Authentication Errors

If you encounter authentication errors, you may need to reauthorize rclone:

```bash
$ rclone config reconnect box:
```

### Connection Timeouts

For unreliable internet connections, increase the timeout values:

```bash
rclone sync --contimeout 120s --timeout 600s ...
```

### Path Issues on Windows

Windows users might encounter issues with path formats:

1. Backslash vs. Forward Slash: Windows uses backslashes (`\`) in file paths, but you need to escape them in batch files with another backslash or use caret (`^`) before special characters.

2. Long Path Names: If you encounter "path too long" errors, you can prefix your paths with `\\?\` to enable long path support:
   ```bat
   rclone sync "\\?\C:\Very Long Path\..." box:backup
   ```

3. Spaces in Paths: Always enclose paths with spaces in quotes:
   ```bat
   rclone sync "C:\Users\Your Name\Documents" box:backup
   ```

### Sync Taking Too Long

If syncs are taking too long, consider:
- Refining your exclude list
- Using `--max-age` to only sync recent files
- Using `--size-only` to compare file sizes instead of modification times
- Using `--transfers` to adjust concurrent transfers (higher for fast connections)

### Windows-Specific Performance Tips

Windows users can improve performance with:

1. Disable Virus Scanning for rclone: Add exclusions in your antivirus for rclone.exe and your backup directories.

2. Adjust Priorities: Run rclone with higher priority:
   ```bat
   start /b /high rclone sync ...
   ```

3. Disable Indexing: Disable Windows Search indexing on your backup directories.

### Logging and Debugging

For detailed troubleshooting, add the `-vv` flag for very verbose output:

```bash
$ rclone sync -vv ...
```

For even more detailed logs:

```bash
rclone sync --dump headers --dump bodies ...
```

This will dump all HTTP headers and response bodies to the log.

### Windows Event Log Integration

Windows users can log to the Windows Event Log:

```bat
rclone sync ... --log-file=eventlog:rclone
```

You can then view these logs in the Windows Event Viewer.

## Conclusion

Setting up automated backups to Box using rclone is a powerful way to ensure your important data is safely stored in the cloud. The initial setup might seem a bit technical, but once configured, your backup system will run reliably with minimal maintenance.

Remember that a good backup strategy follows the "3-2-1 rule":
- 3 copies of your data
- 2 different storage types
- 1 copy offsite

Box with rclone helps you satisfy the offsite requirement, but consider combining it with local backups for a comprehensive strategy.

I hope this guide helps you keep your data safe! Let me know in the comments if you have any questions or suggestions for improving this backup system.
