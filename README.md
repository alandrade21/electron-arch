[![Electron Logo](https://www.vectorlogo.zone/logos/electronjs/electronjs-icon.svg)](https://electronjs.org/)

[![License](https://img.shields.io/badge/License-AGPL--3-brightgreen.svg)](LICENSE.md)

# Introduction

This is a software archtecture lib, with common solutions used by my apps.

# Mediators

## EnvironmentMediator (envMediator)

Class to verify if the app is runnin in development environment. This is made to allow that a "production" version can be used in the same machine used to development, preserving the production database and configuration files.

To the environment be identified as development, the app must be started with the command `ELECTRON_ENV=dev electron .`. The best way to use this is create an script in package.json file.

To test the environment, use `envMediator.isDev()`. If true, you are in development environment.