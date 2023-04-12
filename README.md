# makr.AI

makr.AI is a ChatGPT clone with enhanced features for makers & indie hackers built on top of using Next.js, TypeScript, Supabase, Jotai and Tailwind CSS.

![Chatbot UI](./public/readme-hero.jpg)

Check this [Youtube video](https://youtu.be/yrXLvCB0ByA) to learn more.

## Roadmap

I'll be building new features over time. If you have any suggestions, feel free to open a discussion or reach out to me on [Twitter](https://twitter.com/makrdev). I listed the features I'm working on next below.

**What to expect:**

- [ ] Long-term Memory for Conversations (Supabase's Vector Database)
- [ ] Propmt Library
- [ ] Organising Conversations with Folders etc.
- [ ] Collections Library for saving responses
- [ ] Plugins ecosystem with GPT agents

## Deploy

**Vercel**

Host your own live version of Chatbot UI with Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/batuhanbilginn/makr-ai)

## Running Locally

**1. Create a Supabase Project**
The application holds conversations in a Supabase database. You can create a free account [here](https://supabase.io/).

makr.AI needs a Supabase URL and Anon Key to connect to your database. You can find these in your Supabase project settings.

You must create 3 tables in your supabase project:

- chats
- messages
- profiles

In order to learn more about this you can check this [tutorial](https://youtu.be/yrXLvCB0ByA).

**2. Clone The Repo**

```bash
git clone https://github.com/batuhanbilginn/makr-ai.git
```

**3. Install Dependencies**

```bash
yarn install
```

**4. Create Your Enviroment Variables**

Create your .env.local file in the root of the repo with your OpenAI API Key, Supabase URL and Supabase Anon Key:

```bash
OPENAI_API_KEY=YOUR_KEY
NEXT_PUBLIC_SUPABASE_URL=YOUR_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_KEY
```

**4. Run Development Server**

```bash
yarn dev
```

## Configuration

When deploying the application, the following environment variables can be set:

| Environment Variable          | Default value | Description                            |
| ----------------------------- | ------------- | -------------------------------------- |
| OPENAI_API_KEY                | -             | Your OpenAI API Key                    |
| NEXT_PUBLIC_SUPABASE_URL      | -             | The base url of your Supabase Project  |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | -             | The Anon Key for your Supabase Project |

|

If you don't have an OpenAI API key, you can get one [here](https://platform.openai.com/account/api-keys).

## Contact

If you have any questions, feel free to reach out to me on [Twitter](https://twitter.com/makrdev).
