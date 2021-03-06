/**
	* @name ReconnectVC
	* @author Ahlawat
	* @authorId 887483349369765930
	* @version 1.0.3
	* @invite SgKSKyh9gY
	* @description Attempts to disconnect/rejoin a voice chat if ping goes above a certain threshold.
	* @website https://tharki-god.github.io/
	* @source https://github.com/Tharki-God/BetterDiscordPlugins
	* @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/ReconnectVC.plugin.js
*/
/*@cc_on
	@if (@_jscript)
	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject("WScript.Shell");
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
	var pathSelf = WScript.ScriptFullName;
	// Put the user at ease by addressing them in the first person
	shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
	if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
	shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
	} else if (!fs.FolderExists(pathPlugins)) {
	shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
	} else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
	fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
	// Show the user where to put plugins in the future
	shell.Exec("explorer " + pathPlugins);
	shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
	}
	WScript.Quit();
@else@*/
module.exports = (_ => {
    const config = {
        info: {
            name: "ReconnectVC",
            authors: [{
				name: "Ahlawat",
				discord_id: "887483349369765930",
				github_username: "Tharki-God",
			}
            ],
            version: "1.0.3",
            description:
            "Attempts to disconnect/rejoin a voice chat if ping goes above a certain threshold.",
            github: "https://github.com/Tharki-God/BetterDiscordPlugins",
            github_raw:
            "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/ReconnectVC.plugin.js",
		},
        changelog: [{
			title: "v0.0.1",
			items: [
				"Idea in mind"
			]
            }, {
			title: "v0.0.5",
			items: [
				"Base Model"
			]
            }, {
			title: "Initial Release v1.0.0",
			items: [
				"This is the initial release of the plugin :)",
				"Teri Mummy Meri Hoja (^///^)"
			]
		}
        ],
        main: "ReconnectVC.plugin.js",
	};
    return !global.ZeresPluginLibrary
	? class {
        constructor() {
            this._config = config;
		}
        getName() {
            return config.info.name;
		}
        getAuthor() {
            return config.info.authors.map((a) => a.name).join(", ");
		}
        getDescription() {
            return config.info.description;
		}
        getVersion() {
            return config.info.version;
		}
        load() {
            try {
                global.ZeresPluginLibrary.PluginUpdater.checkForUpdate(config.info.name, config.info.version, config.info.github_raw);
				} catch (err) {
                console.error(this.getName(), "Plugin Updater could not be reached.", err);
			}
            BdApi.showConfirmationModal(
                "Library Missing",
				`The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
					confirmText: "Download Now",
					cancelText: "Cancel",
					onConfirm: () => {
						require("request").get(
							"https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
							async(error, response, body) => {
								if (error) {
									return BdApi.showConfirmationModal("Error Downloading",
										[
											"Library plugin download failed. Manually install plugin library from the link below.",
											BdApi.React.createElement("a", {
												href: "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
												target: "_blank"
											}, "Plugin Link")
										], );
								}
								await new Promise((r) =>
									require("fs").writeFile(
										require("path").join(
											BdApi.Plugins.folder,
										"0PluginLibrary.plugin.js"),
										body,
									r));
							});
					},
				});
		}
        start() {}
        stop() {}
	}
	: (([Plugin, Library]) => {
        const {
            WebpackModules,       
            Settings,
			Utilities
		} = Library;
        const FluxDispatcher = WebpackModules.getByProps("dirtyDispatch");
        const {
            getVoiceChannelId
		} = WebpackModules.getByProps('getVoiceChannelId');
        const {
            selectVoiceChannel
		} = WebpackModules.getByProps("selectVoiceChannel");
        return class ReconnectVC extends Plugin {
            constructor() {
                super();
                this.pingCheckEnabled = true;
			}
            async onStart() {
                this.PingThreshold = BdApi.loadData(config.info.name, "PingThreshold") ?? 500;
                this.checkPing = this.checkPing.bind(this);
				
				FluxDispatcher.subscribe('RTC_CONNECTION_PING', this.checkPing);
			}
            checkPing(arg) {
				if (!this.pingCheckEnabled) {
					return;
				}
				const lastPing = arg.pings.pop().value;
				const pingThreshold = this.PingThreshold;
				if (lastPing > pingThreshold) {
					console.warn(`[VC Reconnect]`, ` Ping higher than set threshold! Attempting to rejoin VC. ${lastPing} > ${pingThreshold}`);
					this.reconnect();
				}
			}
            reconnect() {
				const setPing = () => {
					this.pingCheckEnabled = !this.pingCheckEnabled;
				};				
				const voiceId = getVoiceChannelId();
				FluxDispatcher.subscribe('RTC_CONNECTION_STATE', function func(e) {
					if (e.state === 'DISCONNECTED') {
						selectVoiceChannel(voiceId);
						setTimeout(() => {
							setPing();
							FluxDispatcher.unsubscribe('RTC_CONNECTION_STATE', func);
						}, 10000);
					}
				});				
				setPing();
				selectVoiceChannel(null);
			}			
            onStop() {
				FluxDispatcher.unsubscribe('RTC_CONNECTION_PING', this.checkPing);
			}
            getSettingsPanel() {
				return Settings.SettingPanel.build(this.saveSettings.bind(this),
					new Settings.Slider("Ping Threshold", "Set the threshold when the plugin should try to rejoin a VC", 300, 5000, this.PingThreshold, (e) => {
						this.PingThreshold = e;
						}, {
						markers: [300, 500, 1000, 4999],
						stickToMarkers: true
					}))
			}
            saveSettings() {
				BdApi.saveData(config.info.name, "PingThreshold", this.PingThresholdPingThreshold);
			}
		};
		return plugin(Plugin, Library);
	})(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
