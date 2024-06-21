+++
title = "Making a website with the Rust static site generator: Zola"
date = "2024-06-15"
draft = true

[extra]
comment = true

[taxonomies]
tags=["tutorial", "educational"]
+++

# Motivation

I’m convinced everything you do expresses your personal self; what’s more egoistical than a personal blog? Moreover, as somebody with numerous interests (and a habit of spamming friends with links), having a personal website where I can spam to my heart’s delight makes sense. Naturally, one random day, I decided to do just that: make a website. Unfortunately, while my brain thrives endlessly creatively, my time does not; thus, instead of creating my website from scratch, I opted for a quicker solution: a static site generator. After a simple search, I found many solutions, such as WordPress. Yet, my heart settled on Zola, a rust static site generator! With this motivation out the way, here is what you should expect from this blog:

- An introduction to Zola and static site generators benefits
- A simple tutorial to Zola
- Configuring Zola and adding a theme
- Hosting on GitHub actions
- My experience with creating a theme for Zola and advance modifications
- Creating an exciting shortcode to add a “Note” to your blog
- Constructive criticism for Zola
- Final thoughts

Hopefully, these summaries will interest you as we start right away!

# An introduction to Zola and static site generators benefits

## What are static site generators?

Static site generators are tools that generate static HTML files (a website) from templates and content files. These tools are popular for creating blogs and sites because they are simple to use, secure, and customizable. So simple in fact, you can host and maintain these sites in ten minutes without the burden of worrying about security or if your site looks different on other devices.
