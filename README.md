# Open PDF Print Service

![Docker Build](https://github.com/tobiaswaelde/open-pdf-print-service/actions/workflows/build.yml/badge.svg)
![Docker Deploy](https://github.com/tobiaswaelde/open-pdf-print-service/actions/workflows/deploy.yml/badge.svg)
![Version](https://img.shields.io/github/v/tag/tobiaswaelde/open-pdf-print-service?label=version)

A lightweight service that takes a URL and generates a downloadable PDF file from its rendered content.

## 📚 Table Of Contents <!-- omit in toc -->
- [✨ Features](#-features)
- [⚙️ Configuration](#️-configuration)
  - [🌍 Environment Variables](#-environment-variables)
- [🚀 Installation](#-installation)
  - [Using Docker](#using-docker)
  - [Local (Node.js example)](#local-nodejs-example)
- [📡 API Usage](#-api-usage)
  - [Data](#data)
  - [PDF](#pdf)
- [📦 Changelog](#-changelog)



## ✨ Features
- 🔗 Generate a downloadable PDF from any given URL
- 🗃️ Temporarily store data in a database to fetch later during rendering
- 🖨️ Flexible print options:
  - Page size (e.g. A4, Letter)
  - Landscape or portrait
  - With or without default header and footer
  - Custom margins
  - *and more (see below)*
- 📤 Multiple output formats:
  - File download
  - Raw text content
  - Base64-encoded string


## ⚙️ Configuration
### 🌍 Environment Variables
| Variable                  | Type     | Required | Default Value | Description                                               |
| ------------------------- | -------- | -------- | ------------- | --------------------------------------------------------- |
| PORT                      | `number` | no       | `3001`        | The port the webserver should listen to.                  |
| DATABASE_URL              | `string` | yes      |               | The database URL.                                         |
| SHADOW_DATABASE_URL       | `string` | yes      |               | The shadow database URL (used for migrations).            |
| API_TOKEN                 | `string` | no       |               | If set, the `/data` & `/pdf` endpoints will be protected. |
| DATA_KEEP_SECONDS         | `number` | no       | `86400`       | Number of seconds to keep created data in DB.             |
| PUPPETEER_TIMEOUT         | `number` | no       | `60000`       | Timeout for Puppeteer browser launch in milliseconds.     |
| KEEP_BROWSER_OPEN_SECONDS | `number` | no       | `10`          | Number of seconds to keep browser open after printing.    |
|                           |          |          |               |                                                           |


## 🚀 Installation
### Using Docker
Check out the example [compose.yaml](./docker/compose.example.yaml) for a basic deployment setup.

### Local (Node.js example)
```sh
yarn install
yarn build
node ./build/index.js
```

## 📡 API Usage
For a interactive documentation & testing suite using Swgger, check out the OpenAPI documentation on `http://localhost:3001/api`.

### Data
If the website you want to print, needs a lot of data and the data is too much to pass over query params, you can temporary store your data using the API.

#### Create data
You can upload any daty you want as long as it can be serialized to a `JsonValue` (`string`, `number`, `boolean`, `object`).

**API Endpoint:** `POST /api/data`

**Request Body:**
```jsonc
{
  "json": {
    // some very large json object
  },
  "deleteAfterUse": true, // if set to true, data will be deleted after retrieved using GET /api/data/:id
}
```

**Response:**
```jsonc
{
  "id": "string",
  "createdAt": "2025-07-11T17:48:03.643Z",
  "deleteAfterUse": true,
  "json": {
    // some very large json object
  }
}
```

#### Get data
You can fetch your created data using the ID. If the data was created with `deleteAfterUse: true`, it will now be deleted.

**API Endpoint:** `GET /api/data/:id`

**Response:**
```jsonc
{
  "id": "string",
  "createdAt": "2025-07-11T17:48:36.009Z",
  "deleteAfterUse": true,
  "json": {
    // some very large json object
  }
}
```

#### Delete data

**API Endpoint:** `DELETE /api/data/:id`

**Response:**
```jsonc
{
  "id": "string",
  "createdAt": "2025-07-11T17:48:36.009Z",
  "deleteAfterUse": true,
  "json": {
    // some very large json object
  }
}
```

### PDF
Use this endpoint to print any website to PDF.

**API Endpoint:** `GET /api/pdf`

**Request Body:**
```jsonc
{
  // The URL of the page to print.
  "url": "https://google.com",

  // The page format. One of `letter`, `legal`, `tabloid`, `ledger`, `a0`, `a1`, `a2`, `a3`, `a4`, `a5`, `a6`. Default: `a4`
  "format": "a4",

  // If `true` the page will be printed in landscape mode.
  "landscape": false,

  // Custom page margins.
  "margins": {
    "top": "2.5cm",
    "bottom": "3%",
    "left": "20px",
    "right": 5
  },

  // If `true`, display the default header and footer containing e.g. filename and timestamp.
  "displayHeaderFooter": true,

  // If `true`, backfground will be omitted.
  "omitBackground": false,

  // If `true`, background graphics will be printed.
  "printBackground": true,

  // Wait for the given selector until PDF generation starts.
  "waitForSelector": "body.ready", // would wait for a body tag with class="ready"

  // If `true` the result will be the file content as Base64.
  "base64": false,

  // If set, the browser will attempt to download the file (only if `base64`=`false`).
  "filename": "google", // file will be downloaded as "google.pdf"
}
```

##### PrintOptionsDto
| Property  | Data type                 | Required | Default Value | Description                                                                                                             |
| --------- | ------------------------- | -------- | ------------- | ----------------------------------------------------------------------------------------------------------------------- |
| url       | `string`                  | yes      |               | The URL of the page to print.                                                                                           |
| format    | `string`                  | no       | `a4`          | The page format. One of `letter`, `legal`, `tabloid`, `ledger`, `a0`, `a1`, `a2`, `a3`, `a4`, `a5`, `a6`. Default: `a4` |
| landscape | `boolean`                 | no       | `false`       | If `true` the page will be printed in landscape mode.                                                                   |
| margins   | [MarginsDto](#marginsdto) |          |               | Custom page margins.                                                                                                    |
|           |                           |          |               |                                                                                                                         |
|           |                           |          |               |                                                                                                                         |

##### MarginsDto
| Property | Data type            | Required | Description |
| -------- | -------------------- | -------- | ----------- |
| top      | `string` \| `number` | no       |             |
| bottom   | `string` \| `number` | no       |             |
| left     | `string` \| `number` | no       |             |
| right    | `string` \| `number` | no       |             |

## 📦 Changelog
See the [CHANGELOG.md](./CHANGELOG.md) for details on what’s new in recent versions.