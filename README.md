<div align="center">
  <img src="./assets/logo.svg" height="100"/>
</div>

<h1 align="center">Recursion Tree Visualizer</h1>

<p align="center">Tool for visualizing any generic recursive function written in JavaScript or Python.</p>

## Overview

Stop drawing recursion trees by hand. Watch the [demo video](https://youtu.be/1f-KeeN8AHs) or check out the [live project](https://recursion.now.sh).

### Folders structure

- `packages/web`: react user interface.
- `packages/lambda`: serverless lambda function to execute user-defined code remotely.
<!-- - `packages/common`: shared code between web and lambda -->

## Local development

### Web

In the `packages/web` directory, run:

```bash
# to install all dependencies
$ npm install

# to run the app on localhost
$ npm run start
```

### Server

In the `packages/server` directory, run:

```bash
# to install all dependencies
$ npm install

# to run the app on localhost
$ npm run serve
```

## Acknowledgements

Thanks to [Drawing Presentable Trees](https://llimllib.github.io/pymag-trees/#foot5) and [Improving Walker's Algorithm to Run in Linear Time](http://dirk.jivas.de/papers/buchheim02improving.pdf) articles I implemented Reingold-Tilford's algorithm to position each node of the tree on a 2D plane in an aesthetically pleasing way.

## Compatibility

For a better experience, I recommend using a chromium-based browser like Chrome or Edge.
