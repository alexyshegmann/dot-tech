---
title: 'Astro deployment with rsync and Github Actions'
excerpt: What are Github Actions and how I leveraged them to automate the deployment of my blog.
publishedAt: 2025-06-22T17:30:00-0600
image: ../../assets/blog/2025/06/github-actions.jpeg
project: ah-dot-tech
tags:
  - Exploring tech
  - Quick how-to
  - DevOps
  - Github Actions
  - CI CD
---
# Astro deployment with rsync and Github Actions

When I started working on this blog, the idea was to build and ship as fast as possible. I wanted to start blogging right away. This meant that I spinned up my local Astro install and shoved that into an empty github repo. Whenever I pushed any change (even a post), I committed it to the Repo and pushed it to main, then I logged into my box, pulled and built. Every. Single. Time.

I was kind of sick of it, so I started looking into something I wanted to check for a while now: Github Actions.

At work we are already using it, but it was a black box for me. I didn't like that, so I wanted to demystify this tech for myself and now I'll try to do the same for you.

## What are Github Actions

They are tasks that run triggered by something happening on the repo (eg: a merge, but it can also be a PR or even a timer). They are super powerful because they run on a container and they are defined with YAML files by using a specific syntax.

There is also a marketplace. Here you can find a bunch of Actions created by the community and leverage that in your own pipelines. 

## The lingo

Ok, so let's define a couple of terms:

- **Workflow**: it's a configurable automated process that will run one or more jobs (in parallel by default).
- **Job**: a series of actions running in a single runner environment.
- **Runner**: a container based on a docker image.
- **Action**: the actual step of the job. It performs certain actions in the environment and runs sequentially.

## What I want to accomplish 

Ok, so these are my requirements:

1. I need this to be automatic: when I merge to main, the thing gets to prod.
2. My domain points to my Digital Ocean multipurpose droplet. I want to keep it that way.
3. I don't want to waste droplet resources in containerizing the thing and serving it in an esoteric way. I just want the build it shoved in my vhost.

## The repo setup

I want to keep it simple. I'm the only one contributing here and I don't have a release process, so it's ok to just have main and named branches. I won't need the classic develop and release branches from Gitflow.

## Designing the workflow

Ok, so let's draft our build and deployment steps so we don't forget anything:

### 1. Checking out the repo

First thing first. We need to remember the context in which we are working. Think of it as a fresh install of an ubuntu box.
We need our source code in the container, sonthe first thing we would do is to clone the project.

### 2. Installing node

We have our code, but how are we supposed to build this without node and npm?

Steps 1 and 2 can be switched, so it's a matter of preferences. 

### 3. Building the site

For the site to be visible and ready, we have to build it using Astro. It takes our source files and content and spits out HTML, Javascript, CSS and all our optimized assets. A second step takes in the build and indexes the site for the search feature. This also creates some files in the build.

### 4. Deploying the site

I need to move the artifacts from the Runner —a fancy word for the container— into our production environment.

Yeah, I know there are a million options out there, scalable as hell, managed, autoprovisionable... that's overkill, my friend. I decided I just need to scp or rsync the files into my box. If this blog somehow grows beyond this simple approach, I can just switch it afterwards.

## Security 

In order to push the build directly into prod, I need the runner to access my droplet. We need to do this securely. I don't want to be "that guy" that pushes sensitive information in the repo.

Luckily for us, we have a bunch of tools to make it secure.

### SSH keys

We can build a key to be used just by Github to access my droplet. I just have to make sure I change it every couple of months.

To set this up, using your current machine run the following:

```shell
ssh-keygen -t ed25519 -C "your_email@example.com"
```

This will prompt you with a couple of questions. I recommend using `github` or something like that as the name of the files so you know for sure which ones you have to rotate. Also remember to leave empty the password so the key can be used for automation.

Now, you will copy your public key to the server you want to deploy to with:

```shell
ssh-copy-id -i your_key_name.pub your_deployment_username@your_host
```

Make sure you are setting this up in a user with the least amount of privileges, so avoid uploading this with root or a sudoer.

### Github Secrets

The secure way of storing sensitive information is using Secrets. It is an encrypted data store that helps us share private info with our action. It even tries to hide the data if it somehow leaks via the console or logs (it's not 100% safe, so please don't echo your secrets).

The way to set it up is by browsing into your repo in Github and clicking on Settings. Under Security > Secrets and variables you will see Actions. You might need to create an Environment to bind your secret to your environment.

In my case, I stored the server host, user, key and destination. I really didn't want to expose my folder structure or even my username.

## The workflow

Now it's party time. We will create our workflow based on the steps we jotted down:

```yaml
name: Deploy to Prod
on:
  push:
  branches:
    - main
```

This first few lines set the name of the workflow and tell the engine to run it on push on the `main` branch.

```yaml
jobs:
  buildanddeploy:
    name: Build and deploy
    runs-on: ubuntu-latest
    environment: PROD
    steps:
	  .........
```

Right after that, we define jobs. Each job has some metadata. In this case, I'm adding a human readable name and stating that this job will be running on an ubuntu based image and that this job is related to the prod environment.

Let's define our steps and see how they relate to our draft:

### Check out code base

```yaml
- name: Checkout codebase
  uses: actions/checkout@v2
```

This action is provided by Github and checks out the correct version of our code. No configuration is required.
### Installing node

```yaml 
- name: Setup node
  uses: actions/setup-node@v1
    with:
      node-version: 22
```

This action installs node with the version you want. It's also provided by Github.
### Building the site

```yaml
- name: Install dependencies
  run: npm install
- name: Build site
  run: npm run build
- name: Build pagefind index
  run: npm run index
```

We need a couple of steps to build our site. First, we need to install the node dependencies, then we run the build command from npm and lastly we run the indexing process from npm. Those last two commands are defined in my `package.json#scripts`.
### Deploying the site

The following steps are a bit convoluted, but bear with me:

```yaml
- name: Building the keys to the kingdom
  run: |
    echo "${{secrets.REMOTE_SERVER_KEY}}" > deploy_key
    chmod 600 ./deploy_key
```

This first action will dump a secret called `REMOTE_SERVER_KEY` into a securely owned file. Remember, this is an ephemeral box, so it won't be persisted.

Next we need to clean up our directory:

```yaml
- name: Wipping old release
  run: |
    ssh -i ./deploy_key -o StrictHostKeyChecking=no ${{ secrets.REMOTE_SERVER_USER }}@${{ secrets.REMOTE_SERVER_HOST }} 'rm -rf ${{secrets.REMOTE_SERVER_DEST}}/*'
```

We ssh into our server with our user and host passed down from the secrets vault and we wipe out all the files inside our destination folder (again, passed down from secrets).

Now we rsync our files:

```yaml
- name: Rsync to Prod
  env:
    DEST: ${{ secrets.REMOTE_SERVER_USER }}@${{ secrets.REMOTE_SERVER_HOST }}:${{secrets.REMOTE_SERVER_DEST}}
  run: |
    rsync -chrlvzi --delete \
    -e 'ssh -i ./deploy_key -o StrictHostKeyChecking=no' \
	--exclude '/deploy_key' \
	--exclude '/.*/' \
	--exclude '.*' \
	./dist/ ${{env.DEST}}/
```

This action first sets an environment variable and then runs rsync via ssh.

## How to test this without pushing to Github every time potentially wiping out my entire droplet because of a typo.

I was worried sick about this, but I found a tool called  [act](https://nektosact.com/) that allows you to test your workflows locally. This is great because you can check if you are leaking passwords or whatever in the logs and you can iterate faster.

You can even simulate the secrets vault by creating an env file:

```env
# .secrets
# Github secrets - To be used with `act`
REMOTE_SERVER_KEY="-----BEGIN OPENSSH PRIVATE KEY-----
    <<redacted>>
-----END OPENSSH PRIVATE KEY-----"
REMOTE_SERVER_HOST=your_host
REMOTE_SERVER_USER=your_deployment_username
REMOTE_SERVER_DEST=/path/to/vhosts/your_domain/public
```

Then you can run Act simulating a push with:

```shell
act push --secret-file=.secrets
```

The only caveat is that the runners Act provides are not a 1:1 replica of the runners Github provides —kinda; there's an image available that matches Github's, but it's around 18 GB—. This is something I found out the hard way. Apparently the runner I chose didn't include sudo, ssh nor rsync, so I have to install them locally. This is why I added a conditional step at the beginning of the workflow:

```yaml
- name: Install Act dependencies
  if: ${{ env.ACT }}
  run: |
    apt-get update && apt-get install sudo -y
    sudo apt-get install openssh-client rsync -y
```

This action runs only if the environment variable `ACT` is set to true. In this case, it will update and install sudo, openssh-client and rsync. To set the variable before running act, you can use this command:

```shell
ACT=true act push --secret-file=.env
```
 
 ## Where to go from here

Some security hardenings include setting up a `known_hosts` file instead of setting `StrictHostKeyChecking` to `no`  and configuring the Github ssh key to only allow certain commands.

There's also a way to make the site available even during the deployment. We could have a folder with the code, a symbolic link pointing to it and our web server root pointing to the symbolic link. This way, we can rsync to a new directory and only when ready, we can change the symlink to point to the new directory, then we can delete the old folder. Seamles!

There are also some integrations with communication platforms so you get a nice notification whenever a deployment fails or succeeds.

## Conclusion

I'm no devops, but after working on this for a couple of days, I took a look at our workflows at work and I got them. They are easy once you understand the tech behind them:

A yaml file defines a couple of steps to perform when something happens in your repo. The syntax is clear and very human readable.
