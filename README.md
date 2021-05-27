[![Electron Logo](https://www.vectorlogo.zone/logos/electronjs/electronjs-icon.svg)](https://electronjs.org/)

[![License](https://img.shields.io/badge/License-AGPL--3-brightgreen.svg)](LICENSE.md)

# Introduction

This is a software architecture lib written in TypeScript, with common electron solutions used by my apps.

Topics:

1. [Installation](#installation)
1. [Functionalities](#functionalities)
   1. [Error Abstraction](#error-abstraction)
   1. [EnvironmentDetector](#environmentdetector)
   1. [MainWindowController](#mainwindowcontroller)
   1. [ConfigData](#configdata)
   1. [ConfigFileManager](#configfilemanager)
   1. [AppConfigurator](#appconfigurator)

## Functionalities in Alphabetical Order

1. [AppConfigurator](#appconfigurator)
1. [ConfigData](#configdata)
1. [ConfigFileError](#configfileerror)
1. [ConfigFileManager](#configfilemanager)
1. [DatabaseFileError](#databasefileerror)
1. [DatabaseFileManager](#databasefilemanager)
1. [EnvironmentDetector](#environmentdetector)
1. [ErrorWrapper](#errorwrapper)
1. [InvalidParameterError](#invalidparametererror)
1. [InvalidPlatformError](#invalidplatformerror)
1. [MainWindowController](#mainwindowcontroller)
1. [MainWindowAlreadyInitializedError](#mainwindowalreadyinitializederror)
1. [MainWindowNotInitializedError](#mainwindownotinitializederror)
1. [UnexpectedError](#unexpectederror)

# Installation

Install with: `npm i @alandrade21/electron-arch -S`

It is not necessary to import an @types. This project has all the necessary definitions.

# Functionalities

## Error Abstraction

This lib deliver some classes for error abstraction, facilitating the error type detection.

### ErrorWrapper

This is intended as a super class of all specific error classes used during development. It encapsulates a message (required) and a JS error object (or anything throw during execution) (default null). It also provides a string type field (default null), in the case it would be necessary to provide additional typing info.

To use:

```typescript
import { ErrorWrapper } from '@alandrade21/electron-arch';

export class MyCustomError extends ErrorWrapper {}
```

This class provide a `consoleLog(): void` method that prints the error to the console in the format:

```typescript
console.log(`${this.className}. Message: ${this.message}. Error Type: ${this.type}. Original Error: ${this.error}`)
```

The `_className` is a protected field that must be overridden in any child class. This variable must be initialized with the name of the Class. This is not obtained during runtime because the minification can change the class name.

The `_type` is another protected field created to act as as classifier string. It's value can be set in constructor but a more common use is to override this field in subclasses.

### InvalidPlatformError

This is an [ErrorWrapper](#errorWrapper) generated by a try to run  the app in a platform different from win32, linux or darwin (macOs), if the app runs at all.

An object of this class has a type with the value `PLATFORM_ERROR` and the message `The operational system ${process.platform} is not supported.`.

To use: `import { InvalidPlatformError } from '@alandrade21/electron-arch';`

### InvalidParameterError

This is an [ErrorWrapper](#errorWrapper) generated by an invalid use of a parameter in a method, like a required parameter not informed.

An object of this class has a type with the value `RUNTIME_ERROR`.

To use: `import { InvalidParameterError } from '@alandrade21/electron-arch';`

### UnexpectedError

This is an [ErrorWrapper](#errorWrapper) to encapsulate unexpected runtime errors.

An object of this class has a type with the value `RUNTIME_ERROR`.

To use: `import { UnexpectedError } from '@alandrade21/electron-arch';`

### ConfigFileError

This is an [ErrorWrapper](#errorWrapper) generated by the [ConfigFileManager](#configfilemanager).

An object of this class has a type with the value `FS_ERROR`, but this type is commonly overwritten with the error code generated by the file system.

To use: `import { ConfigFileError } from '@alandrade21/electron-arch';`

### DatabaseFileError

This is an [ErrorWrapper](#errorWrapper) generated by the [DatabaseFileManager](#databasefilemanager).

An object of this class has a type with the value `FS_ERROR`, but this type is commonly overwritten with the error code generated by the file system.

To use: `import { DatabaseFileError } from '@alandrade21/electron-arch';`

### MainWindowAlreadyInitializedError

This is an [ErrorWrapper](#errorWrapper) generated by the [MainWindowController](#mainwindowcontroller) if the programmer tries to initialize an already initialized main window.

An object of this class has a type with the value `INIT_ERROR`, and a message with the value `Main window already initialized`.

To use: `import { MainWindowAlreadyInitializedError } from '@alandrade21/electron-arch';`

### MainWindowNotInitializedError

This is an [ErrorWrapper](#errorWrapper) generated by the [MainWindowController](#mainwindowcontroller) if the programmer tries to access the main window before it is initialized.

An object of this class has a type with the value `INIT_ERROR`, and a message with the value `Main window not initialized`.

To use: `import { MainWindowNotInitializedError } from '@alandrade21/electron-arch';`

## EnvironmentDetector

Class to verify if the app is running in development environment. This is made to allow that a "production" version can be used in the same machine used to development, preserving the production database and configuration files.

To the environment be identified as development, the app must be started with the command `ELECTRON_ENV=dev electron .`. The best way to use this is create an script in package.json file.

To use: `import { envDetector } from '@alandrade21/electron-arch';`

To test the environment, use `envDetector.isDev()`. If true, you are in development environment.

To see some environment variables, use `envDetector.printEnvironment()`. This method prints its output to the console.

## MainWindowController

This is an abstraction to the electron main window initialization, created according to <https://medium.com/@davembush/typescript-and-electron-the-right-way-141c2e15e4e1>.

To use: `import { MainWindowController } from '@alandrade21/electron-arch';`

### MainWindowController Usage

This class have some static utility methods. They must be called only after `app.on('ready')` event.

#### Main window initialization

After `app.on('ready')` event call `MainWindowController.initialize()`. If the main window is already initialized when this static method is called, an  [MainWindowAlreadyInitializedError](#mainwindowalreadyinitializederror) is thrown.

The main window created by this method is not showed automatically. To show the window call `MainWindowController.mainWindow.show()`.

If the app is fired in development environment (see [EnvironmentDetector](#environmentdetector)) with the --serve parameter, the main window will be loaded with the content of `http://localhost:4200`. Else, the main window will be loaded with the file `./dist/index.html`.

If the app is fired in development environment (see [EnvironmentDetector](#environmentdetector)), the dev tools will be opened.

#### Main window access

To access the main window created use `MainWindowController.mainWindow`. This will throw an [MainWindowNotInitializedError](#mainwindownotinitializederror) if the main window were not initialized yet.

## ConfigData

The electron app has its configuration options saved inside a configuration file. Inside the electron app this file is represented by an object that holds all configuration data. This object is an instance of a class that implements the ConfigData interface.

This interface has no contracts and only is used by means of type safety.

To use:

```typescript
import { ConfigData } from '@alandrade21/electron-arch';

export class ConfigOptions implements ConfigData { ... }
```

## ConfigFileManager

This class is responsible to manipulate a configuration file, reading and writing it from disk.

To use:

```typescript
import { ConfigFileManage } from '@alandrade21/electron-arch';
```

### ConfigFileManager Usage

#### ConfigFileManager Instantiation

This class has a constructor with the following signature:

```typescript
constructor(
  fileName: string,
  filePath: string
)
```

The `fileName` parameter is a string with the name of the configuration file, preferably with no extension. The `.json` extension will be used.

The `filePath` parameter is a string with the path to the configuration file. This must be an absolute path.

To call this constructor, see the code below:

```typescript
cfm: ConfigFileManager<ConfigOptions> = new ConfigFileManager<ConfigOptions>(configFileName, configFolder);
```

Please, observe the generics syntax used. In this example the `ConfigOptions` is a class that implements the interface [ConfigData](#configdata) and represents the app config options that will be saved to a configuration file. This means that the ConfigFileManager must know the type that represents the config file, for reasons of type safety.

#### ConfigFileManager Services

##### fileExist(): boolean

Verifies if the config file identified by `filePath/fileName` exists on disk. This is a synchronous service.

If there is an permission access error, a [ConfigFileError](#configfileerror) is thrown with type `EPERM`. If an unknown error occurs,a [ConfigFileError](#configfileerror) is thrown with that information and a type from file system, if it exists. In both cases, the original error is stored.

##### readFile(): T

Reads the configuration file from `filePath/fileName` and returns an object of the concrete type representing the configuration options (T - see [instantiation section](#configfilemanager-instantiation) above). This is a synchronous service.

If there are errors, a [ConfigFileError](#configfileerror) is thrown. If the error was caused by permission access, the error has the `EPERM` type. If the file does not exists, the error has the type `ENOENT`. If the error is unknown and there is a file system error type, it will be put in the type field. If there is not possible to generate the object of the type `T` from the raw data read, the type will be `PARSE_ERROR`. In all cases, the original error object is preserved.

##### writeFile(data: T): void

Writes the config file to the disk, replacing its contents if it exists. If the directory does not exists, create it. The parameter `data` is a object of the concrete type representing the configuration options (T - see [instantiation section](#configfilemanager-instantiation) above). This is a synchronous service.

If the parameter `data` is not informed, throws a [InvalidParameterError](#invalidparametererror).

If the file system reports a problem, a [ConfigFileError](#configfileerror) is thrown, preserving the original type.

In both cases the original error is preserved.

### Accessors

This class offers the `fileName` and `filePath` accessors to read these values.

## DatabaseFileManager

This class is responsible to manipulate a skeleton database file, copying it to the location where the user database file should be, during the app initialization cycle.

An skeleton database file is a database file containing only the database structure and
base data. In other words, it's a pristine database, without any user data.

To use:

```typescript
import { DatabaseFileManage } from '@alandrade21/electron-arch';
```

### DatabaseFileManager Usage

#### DatabaseFileManager Instantiation

This class has a constructor with the following signature:

```typescript
constructor(
  fileName: string,
  filePath: string
)
```

The `fileName` parameter is the name of the database file, preferably with no extension. The .sqlite extension will be used.

The `filePath` parameter is a string with the path to the database file. This must be an absolute path.

#### DatabaseFileManager Services

##### fileExist(): boolean

Verifies if the database file identified by `filePath/fileName` exists on disk. This is a synchronous service.

If there is an permission access error, a [DatabaseFileError](#databasefileerror) is thrown with type `EPERM`. If an unknown error occurs,a [DatabaseFileError](#databasefileerror) is thrown with that information and a type from file system, if it exists. In both cases, the original error is stored.

##### copySkellDatabase(skelFileName: string, skelFilePath: string): void

Copies and renames an skeleton sqlite database file to the location where the app database should be placed.

An skeleton database file is a database file containing only the database structure and base data. In other words, its a pristine database, without any user data.

The location and the new name where this skeleton database file will be copied was defined by this constructor.

The `skelFileName` parameter is the name of the skeleton database file.

The `skelFilePath` parameter is a string with the absolute path to the skeleton database file.

This method throws an [InvalidParameterError](#invalidparametererror) if the skelFilePath or skelFileName is empty.

This method throws a [DatabaseFileError](#databasefileerror) if the skelFilePath is not an absolute path, if the user database file already existis, if the skeleton database file does not exists and if an error occurred during the copy.

### Accessors

This class offers the `fileName` and `filePath` accessors to read these values.

## AppConfigurator

This is an abstract super class for local electron app configurator class, with basic configuration functionalities already built.

To use:

```typescript
import { AppConfigurator } from '@alandrade21/electron-arch';

export class InitializationController extends AppConfigurator<ConfigOptions> { ... }
```

In the above code, the class `ConfigOptions` is a class that implements the interface [ConfigData](#configdata) and represents the app config options that will be saved to a configuration file.

### AppConfigurator Usage

#### Instantiation

This super class has a constructor with the following signature:

```typescript
constructor(appName: string, devConfigFolderPath: string, devDataFolderPath: string, configFileName: string = 'config')
```

The `appName` parameter is a string with the name of the app being configured. This name will be used to create a folder structure to host the configuration file. So we recommend that this name has no spaces or special characters. If this parameter is not informed, an [InvalidParameterError](#invalidparametererror) is thrown.

The `devConfigFolderPath` parameter is a string with an absolute path to the development config folder structure. This structure is a copy of the system folders that will be used during production. For more info, see <https://github.com/alandrade21/devTestFolders>. If this parameter is not informed, an [InvalidParameterError](#invalidparametererror) is thrown.

The `devDataFolderPath` parameter is a string with an absolute path to the development data folder structure. This structure is a copy of the system folders that will be used during production. For more info, see <https://github.com/alandrade21/devTestFolders>. If this parameter is not informed, an [InvalidParameterError](#invalidparametererror) is thrown.

The `configFileName` optional parameter is a string with the configuration file name to be used. This file will have the .json extension. If this parameter is omitted, the name `config.json` will be used to the configuration file. If an empty value is passed, the constructor throws an [InvalidParameterError](#invalidparametererror). If the file system detects any problem with this name, the constructor throws a [ConfigFileError](#configfileerror) via the [ConfigFileManager](#configfilemanager).

This constructor verifies which is the user's OS, and choses the config and data folders accordingly.

* If the environment is development (see [EnvironmentDetector](#environmentdetector)), the config folder is set to the value informed in the `devConfigFolderPath` parameter and the data folder is set to the value informed in the `devDataFolderPath` parameter.

* If the environment is not development and the OS is windows, the config folder is set to the folder `.config` inside the app installation folder and the data folder is set to the folder `.data` inside the app installation folder.

* If the environment is not development and the OS Linux, the config folder is set to the folder `.config/<<appName>>/` inside the actual OS user's home folder and the data folder is set to the folder `.local/share/<<appName>>` inside the actual OS user's home folder.

* If the OS is macOS, the config and data folders are set to the folder `Library/Application Support/<<aapName>>/` inside the actual OS user's home folder.

If the OS is not windows, linux or macOs, the app will throw an [InvalidPlatformError](#invalidplatformerror) (if it runs at all).

#### AppConfigurator Services

##### public doConfig(): void

Method to start the app configuration. This super class execute the existence check of the config file. If it exists, the file is read and the options object is initialized. If it not exists, the method that creates the config file is called.

This method should be overridden to execute specific configurations. If this implementation still need to be executed, call super inside your method.

This method throws [ConfigFileError](#configfileerror) generated by the [ConfigFileManager](#configfilemanager).

##### protected abstract createConfigFile(): void

This method must be implemented in you sub class. The implementation of this method should initialize an options object, that implements the interface [ConfigData](#configdata), with the initial value of all options and write it to the disk using the [ConfigFileManager](#configfilemanager) instance created by this super class.

## I18n

This is a simple i18n to translate strings in the main process side.
