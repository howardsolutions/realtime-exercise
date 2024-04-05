# The Chat App

## Overview

Anyone can connect to a URL and begin chatting about anything.

## Product requirements

- User needs to be able to Post a New Message
- User needs to be able to see old messages from the chat when they first connect
- User needs to be able to see their own message
- User needs to be able to see new messages posted by other people

As you may imagine, there are many ways to architect this system and some work better in some ways and worse in others. In other words, there are trade-offs. We're going to start with perhaps the simplest approach to this problem: the humble long-poll.

# POLLING

## 1. Long Polling

- is really a way of saying "making a lot of requests".
- there's no special technology here, just making an AJAX call on some interval.
- this is the most basic, low level simpliest implementation of real time
- you wrote an endpoint, call it a lot

### First problem with the Chat app

when user switch to another tab, for a really long time, the client application still pulling new request behind the scene.

👉 If you want to not pause when unfocused, setTimeout is a good way. If you do want to pause, `requestAnimationFrame` will automatically pause when the window isn't in use. In general, when on the fence, I'd prefer the latter as a better implementation.
