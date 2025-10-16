const chalk = require('chalk');
const clipboardy = require('clipboardy');
// For boxen v6+ use this:
const boxen = require('boxen').default;

// OR if that doesn't work, use this alternative:
// const { default: boxen } = require('boxen');
class Logger {
    static success(message) {
        console.log(chalk.green('✓') + ' ' + message);
    }

    static error(message) {
        console.log(chalk.red('✗') + ' ' + message);
    }

    static info(message) {
        console.log(chalk.blue('ℹ') + ' ' + message);
    }

    static warning(message) {
        console.log(chalk.yellow('⚠') + ' ' + message);
    }

    static command(message) {
        console.log(chalk.cyan('$') + ' ' + message);
    }
}

class Clipboard {
    static async copyToClipboard(text) {
        try {
            await clipboardy.write(text);
            return true;
        } catch (error) {
            // Try alternative method for Linux
            try {
                const { execSync } = require('child_process');
                // Try xclip first
                execSync('echo "' + text.replace(/"/g, '\\"') + '" | xclip -selection clipboard', { stdio: 'ignore' });
                return true;
            } catch (xclipError) {
                // Try xsel as fallback
                try {
                    const { execSync } = require('child_process');
                    execSync('echo "' + text.replace(/"/g, '\\"') + '" | xsel --clipboard --input', { stdio: 'ignore' });
                    return true;
                } catch (xselError) {
                    return false;
                }
            }
        }
    }
}

class Display {
    static showBanner() {
        const banner = boxen(
            chalk.blue.bold('Reverse Shell Generator') + '\n' +
            chalk.gray('CTF/Pentesting Tool\n') +
            chalk.gray('Generate reverse shells for various platforms'),
            {
                padding: 1,
                margin: 1,
                borderStyle: 'round',
                borderColor: 'blue'
            }
        );
        console.log(banner);
    }

    static showCommandBox(title, command, platform = '') {
        const platformInfo = platform ? chalk.yellow(`Platform: ${platform}`) + '\n\n' : '';
        const box = boxen(
            platformInfo + chalk.green(command),
            {
                title: chalk.blue.bold(title),
                titleAlignment: 'center',
                padding: 1,
                margin: 1,
                borderStyle: 'round',
                borderColor: 'green'
            }
        );
        console.log(box);
    }

    static showListenerCommands(ip, port) {
        console.log(chalk.yellow.bold('\nListener Commands:'));
        console.log(chalk.gray('Run one of these on your machine to receive the connection:\n'));
    }
}

module.exports = { Logger, Clipboard, Display };