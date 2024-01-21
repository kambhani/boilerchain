# Boilerchain
This project was submitted to Boilermake XI. What follows below is a reflection of my journey creating this application.

## Inspiration
I've always been interested at the possibilities between tech and finance, so when the opportunity presented itself at Boilermake XI, I took it. Nowadays, you hear a lot about NFTs, cryptocurrencies, and the like, but the understanding of how these technologies work is rather low. Two days ago, I was no exception. And while I'm far from an expert in blockchain, cryptocurrencies, and the like, I'd say that I've learned a thing or two.

## What it does
Boilerchain is a web app where you can mine cryptocurrency (called Boilercoin) and send it to other users on the site. To make mining the currency on a browser possible, the proof-of-work algorithm is extremely weak.

## How I built it
The blockchain itself was built in Python, using various cryptographic protocols like hashing and concepts like proof-of-work. The blockchain (and user information like balances and blocks mined) are stored in Redis Cloud for fast access. This information is made visible to the web app through the use of FastAPI. The web app was built with React, Vite, ChakraUI, and TailwindCSS. Authentication was handled through AWS Amplify, which is also used on the backend to validate requests. Finally, Docker files are used to allow for easy virtualization.

## Challenges I ran into
While I was familiar with most of the frontend technologies, I had none with the backend technologies. I had to learn Redis and FastAPI with no experience, which was a bit of a learning curve. I also had no idea how to build a cryptocurrency, and that involved a lot of reading and understanding how they work. Finally, I had never written a Dockerfile before, and that took some experimenting and A LOT of Stack Overflow.

## Accomplishments that I'm proud of
While the frontend is visually appealing, I had plenty of experience with that coming in, so it's not my main takeaway from this hackathon. Rather, as mentioned earlier, it was taking Redis, FastAPI, and Docker from zero experience to production-level application that I'm most proud of. And let's not forget the actual cryptocurrency that I built!

## What I learned
The main things I learned were of course the theory behind cryptocurrencies and the plethora of technologies that I used. Besides that, the biggest takeaway for me is that I can build a quality app in 36 hours if I set my mind to it. I won't lie – this was incredibly exhausting, especially for a solo developer. But I'm extremely proud of what I made, and I see great things ahead.

## What's next for Boilerchain
Right now, only the actual blocks are cryptographically secured; the transactions are not. Real-world cryptocurrencies also cryptographically secure these as well, and this is something that I would implement given more time. The other major difference from a real-world cryptocurrency is the centralization. In Boilerchain, the Redis database is the single source of truth. In the real-world, cryptocurrencies are decentralized and truth is determined via consensus protocols. Unfortunately, distributed networks and consensus protocols were not things I was familiar with, and as a graduate-level course (CS 505), were not things I was going to be able to learn in 36 hours. Given more time, I would learn and implement a decentralized version of Boilerchain. Finally, the cryptographic protocol is very weak (otherwise you wouldn't be able to mine it in a browser). Future iterations of Boilerchain would move away from browser mining and increase the security of the underlying blockchain.
