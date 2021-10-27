
function getConfig(env) {

	// env is set by the 'buildEnvronment' and/or 'environment' plugin options (see webpack.config.js),
	// or by the code at the end of this file if using without webpack
	dojoConfig = {
		baseUrl: '.',
		packages: [
			{ name: 'dojo',location: env.dojoRoot + '/dojo',	lib: '.'},
			{ name: 'dijit',location: env.dojoRoot + '/dijit',	lib: '.'},
			{ name: 'dojox', location: env.dojoRoot + '/dojox',	lib: '.'},
			{ name: "ac", location: env.auditCaseJSRoot },			
			{ name: "ibm", location: env.sourcesRoot },	
		
			
		],

		paths: {
			js: "js",
			theme: "theme",
		},

		deps: ["ac_build_bootstrap"],

		async: true,
		has: {'dojo-config-api': false},	// Don't need the config API code in the embedded Dojo loader

		
	};
	return dojoConfig;
}


// For Webpack, export the config.  This is needed both at build time and on the client at runtime
// for the packed application.
if (typeof module !== 'undefined' && module) {
	module.exports = getConfig;
}
