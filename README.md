how to run 
npm i -> npm run dev

deploy link: https://genesis-web-test-npntkngrp-tuvacats-projects.vercel.app/


folder structure:
/app : pages, proxy api folder (view pages)
/components : global components that can recycle used
/modules : seperate into 2 subfolder /views and components
- /views : represent view that will hold all components in /modules/components
- /components : build each part a page in here
/types: declare interface in here to export
/providers: hold ts/tsx function that can reuse like format, convert, etc...
/layouts : build layout in here warp it in /app/layout.tsx
/ultis: add import framework, package config in here
/hooks: include custom hooks to call api, response scale mobile and desktop and state
