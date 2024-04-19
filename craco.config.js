const path = require('path');
const { ESLINT_MODES, whenProd  } = require('@craco/craco');
const cssnano = require('cssnano');
const {
	compilerOptions: { paths },
} = require('./tsconfig.json');

module.exports = {
	webpack: {
		alias: Object.keys(paths).reduce(
			(all, alias) => ({
				...all,
				[alias.replace('/*', '')]: path.resolve(
					__dirname,
					'src',
					paths[alias][0].replace('/*', '')
				),
			}),
			{}
		),
	},
	style: {
		modules: {
			localIdentName: '[path][name]__[local]--[hash:base64:5]',
		},
		css: {
			modules: {
				rules: [
					{
						test: /\.css$/i,
						use: ["style-loader", "css-loader"],
						options: {
							url: true,
						},
					},
				]
			}
		},
		sass: {
			module: {
				rules: [
					{
						test: /\.s[ac]ss$/i,
						use: [
							"style-loader",
							"css-loader",
							{
								loader: "sass-loader",
								options: {
									implementation: require("sass"),
								},
							},
						],
					},
				],
			},
		},
	},
	postcss: {
		plugins: (plugins) => whenProd(() => [...plugins, cssnano], []),
	},
	eslint: {
		mode: 'file',
		
	},
	typescript: {
		enableTypeChecking: true,
	},
	jest: {
		configure: {
			moduleNameMapper: Object.keys(paths).reduce(
				(all, alias) => ({
					...all,
					[alias.replace('/*', '/(.*)')]: path.join(
						'<rootDir>/src/',
						paths[alias][0].replace('/*', '/$1')
					),
				}),
				{}
			),
		},
	},
};