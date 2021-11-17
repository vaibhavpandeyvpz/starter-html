# starter-html

Boilerplate project to kick-start HTML websites, powered by [Gulp](https://gulpjs.com/), uses [Sass](https://sass-lang.com/) for stylesheets, [Babel](https://babeljs.io/) for using ESx in scripts and [Nunjucks](https://mozilla.github.io/nunjucks/) for templating.

In addition, it also configuration for a built-in server (with support for live reload) to speed up development.

## How to use?

Make sure you have [Node.js](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/) installed.
Install all project dependencies using below command:

```shell
yarn install
```

The sources reside in [src](src) folder and you would mostly be working inside it unless you know what you are doing.
To build the project, run below command:

```shell
yarn build:dev # during development

# or

yarn build:prod # for minified assets in production
```

Files to be deployed will be built into the `build` folder.

## License

See [LICENSE](LICENSE) file.
