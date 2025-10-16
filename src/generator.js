const { rsgData } = require('./commands');

class ShellGenerator {
    static generateCommand(template, params) {
        let command = template;
        
        // Replace all placeholders
        command = command.replace(/{ip}/g, params.ip);
        command = command.replace(/{port}/g, params.port);
        command = command.replace(/{shell}/g, params.shell || '/bin/bash');
        
        return command;
    }

    static generateListenerCommand(template, port) {
        return template.replace(/{port}/g, port);
    }

    static filterCommandsByPlatform(commands, platform) {
        if (!platform || platform === 'all') return commands;
        
        return commands.filter(cmd => 
            cmd.meta.some(meta => 
                meta.toLowerCase().includes(platform.toLowerCase()) ||
                platform.toLowerCase().includes(meta.toLowerCase())
            )
        );
    }

    static getPlatforms() {
        const platforms = new Set();
        rsgData.reverseShellCommands.forEach(cmd => {
            cmd.meta.forEach(meta => {
                if (['linux', 'windows', 'mac', 'bind', 'msfvenom'].includes(meta)) {
                    platforms.add(meta);
                }
            });
        });
        return Array.from(platforms);
    }

    static getShellsForPlatform(platform) {
        const defaultShells = ['/bin/bash', '/bin/sh', 'cmd', 'powershell'];
        
        if (platform === 'windows') {
            return ['cmd', 'powershell'];
        } else {
            return ['/bin/bash', '/bin/sh', '/bin/zsh'];
        }
    }

    static getListenerCommands(ip, port) {
        return rsgData.listenerCommands.map(([name, cmd]) => ({
            name,
            command: cmd.replace(/{port}/g, port).replace(/{ip}/g, ip)
        }));
    }
}

module.exports = ShellGenerator;