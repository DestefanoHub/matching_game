# Matching Game Front-End

This project is the front-end of the matching game. It is created with:
- Vite
- React
- TypeScript
- React-Router
- Redux
- CSS Modules
- SASS

In order to meaningfully interact with the app, the `matching-game-server` project must also be running, as that is the back-end REST API.

## Project Structure

`index.tsx` is the root of the application that encompasses the router and Redux store.

`/pages` contains the components that represent the main application pages. `Layout.tsx` contains the sidebar background and wraps the other page components that use it.

`/components` contains all the other components that make up the elements on the pages. `/generic/Header.tsx` is the root component in the router that wraps all the pages since every page has the header shown. The directory is further broken down to group similar components together.

`/store` contains all the Redux state material.

`/utils` contains various other files such as:
- `gateway.ts` that defines all the API calls.
- `hooks.ts` that provides better TypeScript integration with the app's Redux material.
- `types.ts` where global TypeScript types are defined.

## App usage

`npm start` will launch the app on `localhost:3000`. Make sure to start the `matching-game-server` first or the API calls will fail, though the app will still run.