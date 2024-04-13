# The Chat App - Real Time Notes

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

### Backoff and Retry

❓ What if a polling request fails? You don't want to thundering-herd yourself by hammering your own API with more requests, but you also want the user to get back in once it's not failing anymore.

👉 So how do we balance a good user experience (recovering as fast as possible) with technical needs (allowing your servers space to recover)? Back off strategies!

<hr />

# HTTP/2

In 2015 we got HTTP/2 ratified as the official new standard of HTTP. It added a bunch of new features, here a few highlights

👉 We can now multiplex requests, meaning you can send many individual messages over a single connection. With 1.1 we had to do a whole new connection with headers, handshakes, security, etc. for every single request. With 2, you can reuse the same connection for multiple things.

👉 Better compression strategies. Without getting into too much details, HTTP 2 allows for compression to happen at a finer grain details and thus allows better compression

👉 Request prioritization. You can say some things are lower priority (like maybe images) and others are higher (like stylesheets.)

<hr />

# WebSockets By Hand

👉 WebSockets are a primitive built into both browsers and backends alike that allow to us to have a long-running connection that allows clients to push data to servers and servers to push data to clients

👉 As opposed to long-polling where we had a client that requesting and posting data to and from a server over many small connections, a WebSocket is one long-running connection where servers can push data to clients and vice versa

👉 This is `true realtime` because it <strong>allows both sides to engage in realtime communication.</strong>

👉 With Polling: We have to create too many requests and established new connection for each request <br />
👉 With Http/2 it's just realtime on 1 direction (from server), the client just read the responses back from the server in one long http request.

👉👉 That's how sockets work: they make a normal TCP/IP connection but after that connection is established, it requests an `upgrade` to a socket connection
