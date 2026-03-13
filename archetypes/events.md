---
title: '{{ replace .File.ContentBaseName "-" " " | title }}'
date: {{ .Date }}
draft: true
event_date: {{ .Date | time.Format "2006-01-02" }}
event_time: "18:30"
event_duration: "2h"
venue: ""
venue_address: ""
eventbrite_url: ""
meetup_url: ""
past: false
featured: false
speakers: []
tags: []
categories: ["meetup"]
description: ""
---
