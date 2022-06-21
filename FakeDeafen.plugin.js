/**
	* @name FakeDeafen
	* @author Ahlawat
	* @authorId 887483349369765930
	* @version 1.0.7
	* @invite SgKSKyh9gY
	* @description FakeDefen to Trick your Friends
	* @website https://tharki-god.github.io/
	* @source https://github.com/Tharki-God/BetterDiscordPlugins
	* @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/FakeDeafen.plugin.js
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
module.exports = (() => {
    const config = {
        info: {
            name: "FakeDeafen",
            authors: [{
				name: "Ahlawat",
				discord_id: "887483349369765930",
				github_username: "Tharki-God",
			},
            ],
            version: "1.0.7",
            description: "FakeDefen to Trick your Friends",
            github: "https://github.com/Tharki-God/BetterDiscordPlugins",
            github_raw: "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/FakeDeafen.plugin.js",
		},
        changelog: [{
			title: "v0.2.3",
			items: [
				"Easier To use Now"
			]
            }, {
			title: "v0.2.4",
			items: [
				"Reindented file"
			]
            }, {
			title: "v0.2.6",
			items: [
				"Fixed some bugs, and made the code better looking."
			]
            }, {
			title: "v0.3.7",
			items: [
				"Updater Library, Meta Update url having bugs."
			]
            }, {
			title: "v0.3.8",
			items: [
				"Wifey.exe executed, lol ヾ(•ω•`)o."
			]
            }, {
			title: "v0.3.9",
			items: [
				"Refractor"
			]
            }, {
			title: "v0.4.0",
			items: [
				"Library Handler"
			]
            }, {
			title: "Initial Release v1.0.0",
			items: [
				"This is the initial release of the plugin :)",
				"Fool them all (●'◡'●)"
			]
            }, {
			title: "v1.0.2",
			items: [
				"Added Fake Video",
				"Removed Useless code"
			]
		}, {
			title: "v1.0.6",
			items: [
				"Option to toogle without disabling plugin itself."
			]
		}
		
        ],
        main: "FakeDeafen.plugin.js",
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
            Patcher,
            DiscordModules,
            Settings,
            Modals,
            ReactTools
		} = Library;
        const {
            getVoiceChannelId
		} = WebpackModules.getByProps('getVoiceChannelId');
        const {
            selectVoiceChannel
		} = WebpackModules.getByProps("selectVoiceChannel");
        const {
            toggleSelfMute
		} = WebpackModules.getByProps("toggleSelfMute")
		const {
            React,
            SoundModule
		} = DiscordModules;
        const sounds = WebpackModules.getByProps('getDesktopType');
        const icon = DiscordModules.React.createElement('path', {
            style: {
                fill: 'currentColor'
			},
            d: "M17.2903 4.14004L17.2203 7.93004C17.2103 8.45004 17.5403 9.14004 17.9603 9.45004L20.4403 11.33C22.0303 12.53 21.7703 14 19.8703 14.6L16.6403 15.61C16.1003 15.78 15.5303 16.37 15.3903 16.92L14.6203 19.86C14.0103 22.18 12.4903 22.41 11.2303 20.37L9.47027 17.52C9.15027 17 8.39027 16.61 7.79027 16.64L4.45027 16.81C2.06027 16.93 1.38027 15.55 2.94027 13.73L4.92027 11.43C5.29027 11 5.46027 10.2 5.29027 9.66004L4.27027 6.42004C3.68027 4.52004 4.74027 3.47004 6.63027 4.09004L9.58027 5.06004C10.0803 5.22004 10.8303 5.11004 11.2503 4.80004L14.3303 2.58004C16.0003 1.39004 17.3303 2.09004 17.2903 4.14004Z M21.4403 20.4702L18.4103 17.4402C18.1203 17.1502 17.6403 17.1502 17.3503 17.4402C17.0603 17.7302 17.0603 18.2102 17.3503 18.5002L20.3803 21.5302C20.5303 21.6802 20.7203 21.7502 20.9103 21.7502C21.1003 21.7502 21.2903 21.6802 21.4403 21.5302C21.7303 21.2402 21.7303 20.7602 21.4403 20.4702Z"
		});
        const enabledIcon = w => React.createElement('svg', {
            viewBox: '0 0 24 24',
            width: w,
            height: w,
            style: {
                'margin-left': '-2px'
			}
		}, icon);
        const disabledIcon = w => React.createElement('svg', {
            viewBox: '0 0 24 24',
            width: w,
            height: w,
            style: {
                'margin-left': '-2px'
			}
		},
		icon,
		React.createElement('polygon', {
			style: {
				fill: '#a61616'
			},
			points: '22.6,2.7 22.6,2.8 19.3,6.1 16,9.3 16,9.4 15,10.4 15,10.4 10.3,15 2.8,22.5 1.4,21.1 21.2,1.3 '
		}));
        const Sounds = {
            ENABLE: 'ptt_start',
            DISABLE: 'ptt_stop'
		};
        return class FakeDeafen extends Plugin {
            sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
			}
            showDisclaimer() {
                Modals.showAlertModal("Instructions...", "You can choose either you want to fake mute or defen in settings. \n\n  (By Default it fakes both). \n\n You will retain the set status till you disable the plugin. \n\n You don't need to reload discord for joining another voice chat anymore. \n\n Thats it, Enjoy fooling people ψ(._. )>")
                BdApi.saveData(config.info.name, "firstRun", false);
			}
            onStart() {
                this.loadSettings();
                this.init();
			}
            async init() {
                if (this.firstRun)
				this.showDisclaimer();
                if (this.enabled)
				await this.fakeIt();
                if (this.statusPicker)
				this.patchStatusPicker();
                if (this.userPanel)
				this.patchPanelButton();
			}
            loadSettings() {
                this.mute = BdApi.loadData(config.info.name, "mute") ?? true;
                this.deaf = BdApi.loadData(config.info.name, "deaf") ?? true;
                this.video = BdApi.loadData(config.info.name, "video") ?? false;
                this.firstRun = BdApi.loadData(config.info.name, "firstRun") ?? true;
                this.enabled = BdApi.loadData(config.info.name, "enabled") ?? true;
                this.statusPicker = BdApi.loadData(config.info.name, "statusPicker") ?? true;
                this.userPanel = BdApi.loadData(config.info.name, "userPanel") ?? false;
                this.playAudio = BdApi.loadData(config.info.name, "playAudio") ?? this.userPanel;
			}
            async fakeIt() {
                const voiceStateUpdate = WebpackModules.getByPrototypes("voiceStateUpdate");
                Patcher.after(voiceStateUpdate.prototype, "voiceStateUpdate", (instance, args) => {
                    instance.send(4, {
                        guild_id: args[0].guildId,
                        channel_id: args[0].channelId,
                        preferredRegion: args[0].preferredRegion,
                        self_mute: this.mute || args[0].selfMute,
                        self_deaf: this.deaf || args[0].selfDeaf,
                        self_video: this.video || args[0].selfVideo
					})
				});
                await this.sleep(500);
                this.update();
                this.enabled = true;
                BdApi.saveData(config.info.name, "enabled", this.enabled);
			}
            patchStatusPicker() {
                const StatusPicker = WebpackModules.getByProps('status', 'statusItem');
                const SideBar = WebpackModules.getByProps('MenuItem');
                Patcher.before(SideBar, 'default', (_, args) => {
                    if (args[0]?.navId != 'status-picker')
					return args;
                    const [{
						children
					}
                    ] = args;
                    const invisibleStatus = children.find(c => c?.props?.id == 'invisible');
                    if (!children.find(c => c?.props?.id == 'fake-deafen')) {
                        children.splice(children.indexOf(invisibleStatus) + 1, 0, React.createElement(SideBar.MenuItem, {
							id: 'fake-deafen',
							keepItemStyles: true,
							action: () => {
								return this.toogle();
							},
							render: () => React.createElement('div', {
								className: StatusPicker.statusItem,
								'aria-label': `${this.enabled ? 'Unfake' : 'Fake'} Sounds Status`
                                }, this.enabled ? disabledIcon('16') : enabledIcon('16'), React.createElement('div', {
									className: StatusPicker.status
                                    }, `${this.enabled ? 'Unfake' : 'Fake'} Sounds Status`), React.createElement('div', {
									className: StatusPicker.description
								}, `Weather to ${this.enabled ? 'unfake' : 'fake'} Deafen/Mute/Video for others.`))
						}));
					}
				});
			}
            async patchPanelButton() {
				const classes = await WebpackModules.getByProps('container', 'usernameContainer')
				let PanelButton = WebpackModules.getByDisplayName("PanelButton")
				let Account = ReactTools.getReactInstance(document.querySelector(`.${classes.container}`)).return?.stateNode;
				Patcher.after(Account.__proto__, "render", (_, __, {
					props
				}) => {
				props.children[1].props.children.unshift(DiscordModules.React.createElement(PanelButton, {
					icon: () => this.enabled ? enabledIcon('20') : disabledIcon('20'),
					tooltipText: `${this.enabled ? 'Unfake' : 'Fake'} Sound Stautus`,
					onClick: () => {
						this.toogle();
						if (this.playAudio)
						SoundModule.playSound(this.fixated ? Sounds.ENABLE : Sounds.DISABLE, 0.5);
					}
				}))
				});
			}
			unfakeIt() {
				Patcher.unpatchAll();
				this.update();
				this.enabled = false;
				BdApi.saveData(config.info.name, "enabled", this.enabled);
				this.init();
			}
			onStop() {
				Patcher.unpatchAll();
			}
			update() {
				const notifications = sounds.getState();
				const toCheck = ["mute", "unmute"];
				const toToggle = toCheck.filter(sound => !notifications.disabledSounds.includes(sound));
				if (toToggle.length > 0)
				notifications.disabledSounds = toToggle.concat(notifications.disabledSounds)
				toggleSelfMute().then(async() => {
					await this.sleep(100);
					toggleSelfMute();
					if (toToggle.length > 0)
					notifications.disabledSounds = notifications.disabledSounds.filter((sound) => !toToggle.includes(sound))
				});
			}
			toogle() {
				this.enabled ? this.unfakeIt() : this.fakeIt();
			}
			getSettingsPanel() {
				return Settings.SettingPanel.build(this.saveSettings.bind(this),
					new Settings.SettingGroup("What to fake?", {
						collapsible: true,
						shown: false
						}).append(new Settings.Switch("Mute", "Weather you want to fake the mute or not.", this.mute, (e) => {
							this.mute = e;
						}),
						new Settings.Switch("Deaf", "Weather you want to fake the deaf or not.", this.deaf, (e) => {
							this.deaf = e;
						}),
						new Settings.Switch("Video", "Weather you want to fake the video or not.", this.video, (e) => {
							this.video = e;
						})),
						new Settings.SettingGroup("Toogle Options", {
							collapsible: true,
							shown: false
							}).append(new Settings.Switch("Status Picker", "Add Option in status Picker to toogle fake.", this.statusPicker, (e) => {
								this.statusPicker = e;
							}),
							new Settings.Switch("User Panel", "Add Button in in user panel to toogle fake.", this.userPanel, (e) => {
								this.userPanel = e;
							}),
							new Settings.Switch("Play Audio", "Play Audio on clicking button in user panel.", this.playAudio, (e) => {
								this.playAudio = e;
							})))
			}
			saveSettings() {
				BdApi.saveData(config.info.name, "mute", this.mute);
				BdApi.saveData(config.info.name, "deaf", this.deaf);
				BdApi.saveData(config.info.name, "video", this.video);
				BdApi.saveData(config.info.name, "statusPicker", this.statusPicker);
				BdApi.saveData(config.info.name, "userPanel", this.userPanel);
				BdApi.saveData(config.info.name, "playAudio", this.playAudio);
				Patcher.unpatchAll();
				this.init();
			}
		};
		return plugin(Plugin, Library);
	})(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
