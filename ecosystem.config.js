module.exports = {
	apps: [
		{
			name: '8003-coding-challenge-app',
			script: 'node_modules/next/dist/bin/next',
			args: 'start -p 8003', 
			cwd: './',
			exec_mode: 'fork',
			watch: false
		}
	]
}