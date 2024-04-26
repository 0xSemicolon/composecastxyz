# ComposeCast.xyz

There are a series of verbs in the farcaster ecosystem, such as viewing a cast, viewing a profile, retweeting and composing a cast which require intimate knowledge of a user's preferences which are currently very hard to do at the protocol level.

Compose cast aims to give farcasters control over one of these verbs: 'compose a cast'. 

It is not reasonable to expect a frame developer, or a read-only client developer to know the users preferences. Additionally these preferences might not be publicly inferrable. You might for instance be able to infer that a user prefers to compose casts through warpcast because their messages are usually signed by warpcast. However, in the future it's more likely most apps will sign through some third party like Neynar which obfuscates the origin. Additionally if we find ourselves in a world where users self sign messages more frequently, (i.e. via self hosted applications) then we won't be able to infer this publicly.

Therefore we need a repository for that preference information - ideally in a way that's privacy preserving. My solution to this is composecast.xyz. The preferences of a user are stored purely on device (in IndexedDB). At time of writing there are a few preferences supported:

1) What are my favorite clients (Starred)
2) Do I want to automatically fulfill requests through a client.

There's a lot more preference data to be captured though. In the future there will be 1000s of domain specific clients. If I'm being prompted to cast about movies, I might not want to automatically fulfill to warpcast but rather to rottentomatoes (or whatever).

## 💿 Install

Set up your project using your preferred package manager. Use the corresponding command to install the dependencies:

| Package Manager                                                | Command        |
|---------------------------------------------------------------|----------------|
| [yarn](https://yarnpkg.com/getting-started)                   | `yarn install` |
| [npm](https://docs.npmjs.com/cli/v7/commands/npm-install)     | `npm install`  |
| [pnpm](https://pnpm.io/installation)                          | `pnpm install` |
| [bun](https://bun.sh/#getting-started)                        | `bun install`  |

After completing the installation, your environment is ready for Vuetify development.

## 💡 Usage

This section covers how to start the development server and build your project for production.

### Starting the Development Server

To start the development server with hot-reload, run the following command. The server will be accessible at [http://localhost:3000](http://localhost:3000):

```bash
yarn dev
```

(Repeat for npm, pnpm, and bun with respective commands.)

> Add NODE_OPTIONS='--no-warnings' to suppress the JSON import warnings that happen as part of the Vuetify import mapping. If you are on Node [v21.3.0](https://nodejs.org/en/blog/release/v21.3.0) or higher, you can change this to NODE_OPTIONS='--disable-warning=5401'. If you don't mind the warning, you can remove this from your package.json dev script.

### Building for Production

To build your project for production, use:

```bash
yarn build
```

(Repeat for npm, pnpm, and bun with respective commands.)

Once the build process is completed, your application will be ready for deployment in a production environment.

## 💪 Support ComposeCast.xyz Development

👋 Hey I'm https://warpcast.com/semicolon.eth - biggest help is if you are building your own client, or know someone who is, let them know about this project and if they can implement a source then awesome! ⬆️ Client diversity ⬆️



## 💪 Support Vuetify Development

This project is built with [Vuetify](https://vuetifyjs.com/en/), a UI Library with a comprehensive collection of Vue components. Vuetify is an MIT licensed Open Source project that has been made possible due to the generous contributions by our [sponsors and backers](https://vuetifyjs.com/introduction/sponsors-and-backers/). If you are interested in supporting this project, please consider:

- [Requesting Enterprise Support](https://support.vuetifyjs.com/)
- [Sponsoring John on Github](https://github.com/users/johnleider/sponsorship)
- [Sponsoring Kael on Github](https://github.com/users/kaelwd/sponsorship)
- [Supporting the team on Open Collective](https://opencollective.com/vuetify)
- [Becoming a sponsor on Patreon](https://www.patreon.com/vuetify)
- [Becoming a subscriber on Tidelift](https://tidelift.com/subscription/npm/vuetify)
- [Making a one-time donation with Paypal](https://paypal.me/vuetify)

## 📑 License
[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2016-present Vuetify, LLC
