# Ignite Front-end

## Table of contents

- [Description](#description)
- [How to test](#how-to-test)
- [License](#license)
- [How it works](#how-it-works)
- [How to run](#how-to-run)
- [Current Stage of project](#current-stage-of-project)

## Description

[Ignite](http://ignite.so/) is a decentralized social network, which allows everyone to share her/his mind freely via texts and media files. All the posts are distributed through Ethereum blockchain and stored immutable in Distributed Data Storage. This storage is able to store necessary data and media for a period of 10-100 years. It is based on Bit Torrent File System, so Ignite could not be blocked by any form of barrier or firewall.

Our mission is to create a free flow of information online. It is a way to communicate globally that supports individual liberty of everyone without any form of censorship. Due to its decentralized nature Ignite will not be governed by anyone and cannot be controlled by authorities.

## How to test

....

## License

Prometeus Network is licensed under the Apache software license (see LICENSE [file](https://github.com/Prometeus-Network/prometeus/blob/master/LICENSE)). Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either \express or implied.

Prometeus Network makes no representation or guarantee that this software (including any third-party libraries) will perform as intended or will be free of errors, bugs or faulty code. The software may fail which could completely or partially limit functionality or compromise computer systems. If you use or implement it, you do so at your own risk. In no event will Prometeus Network be liable to any party for any damages whatsoever, even if it had been advised of the possibility of damage.

As such this codebase should be treated as experimental and does not contain all currently developed features. Prometeus Network will be delivering regular updates.

## How it works

Our primary target is to implement some standard social networks features:

- Sign up / Sign in - account/wallet creation and login feature; — чсайнап нельзя на прайват бете
- Post - share text or media file and write it directly into ethereum blockchain;
- Repost - share post you like;
- Follow / Unfollow - don’t miss posts from your favorite users;
- Like - let your favourite authors know that you agree with their position;
- Comment / Discuss - share your opinion with the others in hot discussions.

## How to run

### Prerequisites

In order to run Data Mart node, you have to install:
- Docker. You can find installation instructions on [official website](https://docs.docker.com/install/)
- Docker-compose, which can be found [here](https://docs.docker.com/compose/install/)

### Build and run process

Firstly, you need to clone this repository with the following command:

```git clone https://github.com/Prometeus-Network/ignite-blockchain.git```

After repository is cloned, you need to initialize submodules with the following commands:

```git submodule init```

```git submodule update```

#### Running inside Docker

In order to run Data Mart node inside Docker container, you need to do the following:

- Create`.env` file in project's **root** directory and configure environmental variables. It is required to configure environmental variables 
- While in project directory, run the following command:

```docker-compose -f docker-compose-production.yml up --build```
or 
```docker-compose -f docker-compose-production.yml up --build -d``` 
if you want to run the application in detached mode.

## Current Stage of project

Ignite decentralized social network is now in  private beta testing stage. 

Please visit Ignite [demo page](http://beta.ignite.so/) to apply for the test account.
