<p align="center">
  <img width="84" alt="Nonsavang Temple Logo" src="https://brsqcdlrwftfrrfdanov.supabase.co/storage/v1/object/public/images/logo-compressed.png">
  <h1 align="center">Nonsavang Temple V1</h1>
</p>

<p align="center">
 The Income & Expense management website for Nonsavang Temple.
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#clone-and-run-locally"><strong>Clone and run locally</strong></a> ·
  <a href="#license"><strong>License</strong></a>
</p>
<br/>

## Features

- Financial Management
  - User accounts and authentication
  - Donation tracking as primary income
  - Categorized income and expense transactions
  - Multiple financial accounts and currencies
  - Transaction approval and rejection roles
- Tracking and Reporting
  - Track income and expenses from various sources
  - Detailed financial reporting
  - Shared visibility of finances


## Demo

You can view a fully working demo at [Nonsavang Temple](https://nonsavang-temple.tyecode.space/).

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Clone the repository using the git clone command

   ```bash
   git clone https://github.com/tyecode/nonsavang-temple--web-client.git
   ```

3. Use `cd` to change into the app's directory

   ```bash
   cd name-of-new-app
   ```

4. Rename `.env.local.example` to `.env` and update the following:

   ```
   DATABASE_URL=[INSERT YOUR DATABASE URL]
   NEXT_PUBLIC_SUPABASE_URL=[INSERT YOUR SUPABASE URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT YOUR SUPABASE ANON KEY]
   NEXT_PUBLIC_SUPABASE_SERVICE_ROLE=[INSERT YOUR SUPABASE SERVICE ROLE]
   NEXT_PUBLIC_SUPABASE_BUCKET_PATH=[INSERT YOUR SUPABASE BUCKET PATH]
   NEXT_PUBLIC_SUPABASE_AUTH_COOKIE_NAME=[INSERT YOUR SUPABASE AUTH COOKIE NAME]
   NEXT_PUBLIC_SITE_URL=[INSERT YOUR HOST OR DOMAIN NAME]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

5. Install the project dependencies and start the local development server:

   If you're using `npm`, run the following commands:

   ```bash
   npm install
   npm run dev
   ```

   If you're using `yarn`, use these commands instead:

   ```bash
   yarn
   yarn dev
   ```

   The local server should now be running on [localhost:3000](http://localhost:3000/).

## License

Licensed under the [GNU GPLv3](https://choosealicense.com/licenses/gpl-3.0/). Please read the terms of this license before making modifications to this project.
