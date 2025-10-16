#!/usr/bin/env node

const inquirer = require('inquirer');
const { rsgData, CommandType } = require('./commands');
const ShellGenerator = require('./generator');
const { Logger, Clipboard, Display } = require('./utils');

class ReverseShellMaker {
    constructor() {
        this.params = {
            ip: '',
            port: '',
            platform: '',
            shell: ''
        };
    }

    async init() {
        Display.showBanner();
        await this.getUserInput();
    }

    async getUserInput() {
        // Get IP address
        const ipAnswer = await inquirer.prompt([
            {
                type: 'input',
                name: 'ip',
                message: 'Enter your IP address:',
                validate: (input) => {
                    if (!input) return 'IP address is required';
                    return true;
                }
            }
        ]);

        // Get port
        const portAnswer = await inquirer.prompt([
            {
                type: 'input',
                name: 'port',
                message: 'Enter port number:',
                default: '4444',
                validate: (input) => {
                    const port = parseInt(input);
                    if (isNaN(port) || port < 1 || port > 65535) {
                        return 'Please enter a valid port number (1-65535)';
                    }
                    return true;
                }
            }
        ]);

        // Get platform
        const platformAnswer = await inquirer.prompt([
            {
                type: 'list',
                name: 'platform',
                message: 'Select target platform:',
                choices: [
                    { name: 'Linux', value: 'linux' },
                    { name: 'Windows', value: 'windows' },
                    { name: 'macOS', value: 'mac' },
                    { name: 'All Platforms', value: 'all' }
                ]
            }
        ]);

        this.params = {
            ...this.params,
            ip: ipAnswer.ip,
            port: portAnswer.port,
            platform: platformAnswer.platform
        };

        await this.selectShellType();
    }

    async selectShellType() {
        const shellTypeAnswer = await inquirer.prompt([
            {
                type: 'list',
                name: 'shellType',
                message: 'Select shell type:',
                choices: [
                    { name: 'Reverse Shell', value: 'reverse' },
                    { name: 'Bind Shell', value: 'bind' },
                    { name: 'MSFVenom Payload', value: 'msfvenom' }
                ]
            }
        ]);

        await this.selectSpecificCommand(shellTypeAnswer.shellType);
    }

    async selectSpecificCommand(shellType) {
        let commands = [];
        let title = '';

        switch (shellType) {
            case 'reverse':
                commands = ShellGenerator.filterCommandsByPlatform(
                    rsgData.reverseShellCommands.filter(cmd => 
                        cmd.meta.includes(CommandType.ReverseShell)
                    ),
                    this.params.platform
                );
                title = 'Reverse Shell Commands';
                break;
            case 'bind':
                commands = ShellGenerator.filterCommandsByPlatform(
                    rsgData.reverseShellCommands.filter(cmd => 
                        cmd.meta.includes(CommandType.BindShell)
                    ),
                    this.params.platform
                );
                title = 'Bind Shell Commands';
                break;
            case 'msfvenom':
                commands = rsgData.reverseShellCommands.filter(cmd => 
                    cmd.meta.includes(CommandType.MSFVenom)
                );
                title = 'MSFVenom Payloads';
                break;
        }

        if (commands.length === 0) {
            Logger.error('No commands found for the selected platform and type.');
            process.exit(1);
        }

        const commandChoices = commands.map(cmd => ({
            name: `${cmd.name} (${cmd.meta.join(', ')})`,
            value: cmd
        }));

        const commandAnswer = await inquirer.prompt([
            {
                type: 'list',
                name: 'command',
                message: `Select ${title.toLowerCase()}:`,
                choices: commandChoices,
                pageSize: 15
            }
        ]);

        await this.handleShellSelection(commandAnswer.command, shellType);
    }

    async handleShellSelection(selectedCommand, shellType) {
        // Get shell type if needed
        if (selectedCommand.command.includes('{shell}')) {
            const shells = ShellGenerator.getShellsForPlatform(this.params.platform);
            const shellAnswer = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'shell',
                    message: 'Select shell:',
                    choices: shells
                }
            ]);
            this.params.shell = shellAnswer.shell;
        }

        // Generate the final command
        const finalCommand = ShellGenerator.generateCommand(selectedCommand.command, this.params);

        // Display results
        console.log('\n' + '='.repeat(60));
        Logger.success('Reverse Shell Generated Successfully!');
        console.log('='.repeat(60));

        Display.showCommandBox(selectedCommand.name, finalCommand, this.params.platform);

        // Show listener commands for reverse shells
        if (shellType === 'reverse' || shellType === 'msfvenom') {
            this.showListenerCommands();
        }

        // Copy to clipboard option
        const copyAnswer = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'copy',
                message: 'Copy command to clipboard?',
                default: true
            }
        ]);

        if (copyAnswer.copy) {
            const copied = await Clipboard.copyToClipboard(finalCommand);
            if (copied) {
                Logger.success('Command copied to clipboard!');
            } else {
                Logger.error('Failed to copy to clipboard.');
            }
        }

        // Ask if user wants to generate another
        const againAnswer = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'again',
                message: 'Generate another reverse shell?',
                default: false
            }
        ]);

        if (againAnswer.again) {
            await this.getUserInput();
        } else {
            Logger.info('Happy hacking! 🚀');
            process.exit(0);
        }
    }

    showListenerCommands() {
    const listeners = ShellGenerator.getListenerCommands(this.params.ip, this.params.port);
    
    console.log(chalk.yellow.bold('\nListener Commands:'));
    console.log(chalk.gray('Run one of these on your machine to receive the connection:\n'));
    
    listeners.forEach((listener, index) => {
        Logger.command(`${listener.command}`);
        console.log(chalk.gray(`   # ${listener.name}\n`));
    });
}

// ADD THIS NEW METHOD FOR BIND SHELLS
showConnectionCommands(ip, port) {
    console.log(chalk.yellow.bold('\nConnection Commands:'));
    console.log(chalk.gray('Run one of these on your machine to connect to the bind shell:\n'));
    
    const connections = [
        ['nc', `nc ${ip} ${port}`],
        ['ncat', `ncat ${ip} ${port}`],
        ['telnet', `telnet ${ip} ${port}`],
        ['socat', `socat - TCP:${ip}:${port}`]
    ];
    
    connections.forEach(([name, cmd]) => {
        Logger.command(`${cmd}`);
        console.log(chalk.gray(`   # ${name}\n`));
    });
}
}

// Add chalk import at the top
const chalk = require('chalk');

// Run the application
async function main() {
    try {
        const app = new ReverseShellMaker();
        await app.init();
    } catch (error) {
        Logger.error('An error occurred: ' + error.message);
        process.exit(1);
    }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
    Logger.error('Uncaught exception: ' + error.message);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    Logger.error('Unhandled rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

if (require.main === module) {
    main();
}



module.exports = ReverseShellMaker;