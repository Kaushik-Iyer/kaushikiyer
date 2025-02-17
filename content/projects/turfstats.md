---
title: "Soccer Drop In Statistics Logger"
date: 2024-12-01T00:00:00-05:00
draft: false
description: "A live personal project in which users can log in, put in their drop in soccer statistics (goals, assists, position played), and visualize them over time, along with latest scores around the world, grounds nearby, and injuries data too."
technologies:
  - Python
  - React
  - Websockets
  - Full Stack Development
github: "https://github.com/Kaushik-Iyer/turf-logger-backend"
type: "projects"
image: "images/turf.png"
demo: "https://myfootballstats.social"
---
This was a personal project on which I worked at during summer 2024. Since a long time I had been wanting to develop a proper project from scratch which was not a youtube tutorial or a walkthrough. All of the ideas for this project were things that I wanted to implement. The whole backend and frontend has been done by myself, and since I like working on backend more, unfortunately the frontend aesthetics and accessibility are not upto the mark. Anyway, the frontend is in React, and backend built in python's FASTAPI. The scores are regularly updated from a third party API through websockets, the nearby grounds are fetched by using the user's location and Google Places API. The website also performs Google OAuth 2.0 through the frontend itself. A large part of the project also involved figuring out the hosting aspects, including getting a domain, and hosting the frontend as well as the backend folders. I eventually got a domain free for a year through name.com, hosted the frontend through cloudflare pages in their free tier, and got to host the backend in heroku for 2 years through Github's Student Developer Pack.