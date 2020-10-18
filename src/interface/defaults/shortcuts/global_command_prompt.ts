import CommandPrompt from '../../constructors/command.prompt'
import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import PluginsRegistry from 'PluginsRegistry'
import About from '../dialogs/about'
import Languages from '../../collections/languages'
import configEditor from '../tabs/config.editor.js'
import Settings from '../windows/settings'
import Welcome from '../windows/welcome'
import Store from '../windows/store'

//Command: Open the global command prompt (default: Ctrl+P)
RunningConfig.on('command.openCommandPrompt', () => {
	new CommandPrompt({
		name: 'global',
		showInput: true,
		inputPlaceHolder: 'Enter a command',
		options: [
			{
				label: 'Open Settings',
				action: () => Settings().launch(),
			},
			{
				label: 'Open Projects',
				action: () => Welcome().launch(),
			},
			{
				label: 'Open Workspaces',
				action: () => {
					Welcome({
						defaultPage: 'workspaces',
					}).launch()
				},
			},
			{
				label: 'Open Store',
				action: () => Store().launch(),
			},
			{
				label: 'Open About',
				action: () => About().launch(),
			},
			{
				label: 'Open Manual Configuration',
				action: () => configEditor(),
			},
			{
				label: 'Set Theme',
				action: () => {
					const configuredTheme = StaticConfig.data.appTheme
					const registry = PluginsRegistry.registry.data.list
					new CommandPrompt({
						showInput: true,
						inputPlaceHolder: 'Select a theme',
						options: [
							...Object.keys(registry)
								.map(name => {
									const pluginInfo = registry[name]
									if (pluginInfo.type == 'theme') {
										return {
											label: name,
											selected: configuredTheme === name,
										}
									}
								})
								.filter(Boolean),
						],
						onSelected(res) {
							StaticConfig.data.appTheme = res.label
						},
						onScrolled(res) {
							StaticConfig.data.appTheme = res.label
						},
					})
				},
			},
			{
				label: 'Set zoom',
				action: () => {
					new CommandPrompt({
						showInput: false,
						options: [
							{
								label: 'Default',
								action() {
									StaticConfig.data.appZoom = 1
								},
							},
							{
								label: 'Increase',
								action() {
									StaticConfig.data.appZoom += 0.1
								},
							},
							{
								label: 'Decrease',
								action() {
									StaticConfig.data.appZoom -= 0.1
								},
							},
						],
					})
				},
			},
			{
				label: 'Set Language',
				action: () => {
					const configuredLanguage = StaticConfig.data.language
					new CommandPrompt({
						showInput: true,
						inputPlaceHolder: 'Select a language',
						options: [
							...Object.keys(Languages).map(lang => {
								const languageName = Languages[lang].name
								return {
									data: lang,
									label: languageName,
									selected: configuredLanguage === languageName,
								}
							}),
						],
						onSelected(res) {
							StaticConfig.data.appLanguage = res.data
						},
						onScrolled(res) {
							StaticConfig.data.appLanguage = res.data
						},
					})
				},
			},
			...RunningConfig.data.globalCommandPrompt,
		],
	})
})
