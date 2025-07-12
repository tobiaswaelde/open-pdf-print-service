# Open PDF Print Service

![Docker Build](https://github.com/tobiaswaelde/open-pdf-print-service/actions/workflows/build.yml/badge.svg)
![Docker Deploy](https://github.com/tobiaswaelde/open-pdf-print-service/actions/workflows/deploy.yml/badge.svg)
![Version](https://img.shields.io/github/v/tag/tobiaswaelde/open-pdf-print-service?label=version)

**Open PDF Print Service** is a lightweight and flexible web service that generates PDF documents from any public or protected webpage. It supports advanced rendering options using [Puppeteer](https://pptr.dev/), stores large datasets temporarily for dynamic pages, and offers multiple output formats including direct downloads and base64 responses. 

Whether you're building custom reports, archiving dynamic dashboards, or simply need a print-ready version of a webpage, this tool provides a highly configurable and developer-friendly API to get the job done.


## 📚 Table Of Contents <!-- omit in toc -->
- [✨ Features](#-features)
- [⚙️ Configuration](#️-configuration)
  - [🌍 Environment Variables](#-environment-variables)
- [🚀 Installation](#-installation)
  - [Using Docker](#using-docker)
  - [Local Development (Node.js)](#local-development-nodejs)
- [📡 API Usage](#-api-usage)
  - [Data](#data)
  - [PDF Print](#pdf-print)
- [📦 Changelog](#-changelog)
- [🧩 License](#-license)
- [🛠️ Contributing](#️-contributing)



## ✨ Features

- 🔗 Convert any valid URL into a downloadable PDF
- 💾 Store and retrieve complex data via the API for use during rendering
- 🖨️ Advanced PDF print options:
  - Custom page sizes (A4, Letter, etc.)
  - Landscape or portrait orientation
  - Header/footer display control
  - Custom margins
  - Background rendering options
  - Element wait selectors
- 📤 Multiple output formats:
  - File download
  - Raw text content
  - Base64-encoded string
- 🔐 Optional token-based endpoint protection



## ⚙️ Configuration

### 🌍 Environment Variables

| Variable                  | Type     | Required | Default Value | Description                                               |
| ------------------------- | -------- | :------: | ------------- | --------------------------------------------------------- |
| PORT                      | `number` |    ❌     | `3001`        | The port the webserver should listen to.                  |
| DATABASE_URL              | `string` |    ✅     |               | The database URL.                                         |
| SHADOW_DATABASE_URL       | `string` |    ✅     |               | The shadow database URL (used for migrations).            |
| API_TOKEN                 | `string` |    ❌     |               | If set, the `/data` & `/pdf` endpoints will be protected. |
| DATA_KEEP_SECONDS         | `number` |    ❌     | `86400`       | Number of seconds to keep created data in DB.             |
| PUPPETEER_TIMEOUT         | `number` |    ❌     | `60000`       | Timeout for Puppeteer browser launch in milliseconds.     |
| KEEP_BROWSER_OPEN_SECONDS | `number` |    ❌     | `10`          | Number of seconds to keep browser open after printing.    |



## 🚀 Installation

### Using Docker

Use the example [`compose.yaml`](./docker/compose.example.yaml) to spin up the service with Docker.

```bash
docker compose -f ./docker/compose.example.yaml up -d
```


### Local Development (Node.js)
```sh
yarn install
yarn build
node ./build/index.js
```



## 📡 API Usage

The API is documented with Swagger/OpenAPI and can be viewed at: `http://localhost:3001/api`.

### Data
Use these endpoints to upload large JSON data that cannot be passed through a query string. This data can then be accessed by the frontend of the rendered page before printing.

#### Create data
Use these endpoints to upload large JSON data that cannot be passed through a query string. This data can then be accessed by the frontend of the rendered page before printing.

**POST** `/api/data`

**Request Body:**
```jsonc
{
  "json": {
    // some very large json object
  },
  "deleteAfterUse": true, // (optional, default: true) if set to true, data will be deleted after retrieved using GET /api/data/:id
}
```

**Response:**
```jsonc
{
  "id": "00000000-0000-0000-0000-000000000000",
  "createdAt": "2025-07-11T17:48:03.643Z",
  "deleteAfterUse": true,
  "json": {
    // some very large json object
  }
}
```

#### Get data
Retrieves the uploaded data by ID. If `deleteAfterUse` was set, the data is deleted after retrieval.

**GET** `/api/data/:id`

**Response:**
```jsonc
{
  "id": "00000000-0000-0000-0000-000000000000",
  "createdAt": "2025-07-11T17:48:36.009Z",
  "deleteAfterUse": true,
  "json": {
    // some very large json object
  }
}
```

#### Delete data
Deletes the uploaded data manually.

**DELETE** `/api/data/:id`

**Response:**
```jsonc
{
  "id": "00000000-0000-0000-0000-000000000000",
  "createdAt": "2025-07-11T17:48:36.009Z",
  "deleteAfterUse": true,
  "json": {
    // some very large json object
  }
}
```

### PDF Print
Use this endpoint to print any website to PDF.

**GET** `/api/pdf`

**Request Body:**
```jsonc
{
  "url": "https://google.com",
  "format": "a4",
  "landscape": false,
  "margins": {
    "top": "2.5cm",
    "bottom": "3%",
    "left": "20px",
    "right": 5
  },
  "displayHeaderFooter": true,
  "omitBackground": false,
  "printBackground": true,
  "waitForSelector": "body.ready", // would wait for a body tag with class="ready"
  "base64": false,
  "filename": "google", // file will be downloaded as "google.pdf"
}
```

##### PrintOptionsDto
| Property            | Type                      | Required | Default | Description                                                                                                                |
| ------------------- | ------------------------- | :------: | ------- | -------------------------------------------------------------------------------------------------------------------------- |
| url                 | `string`                  |    ✅     |         | The URL of the page to print.                                                                                              |
| format              | `string`                  |    ❌     | `'a4'`  | The page format. One of `letter` \|`legal` \|`tabloid` \|`ledger` \|`a0` \|`a1` \|`a2` \|`a3` \|`a4` \|`a5` \|`a6`.        |
| landscape           | `boolean`                 |    ❌     | `false` | If `true` the page will be printed in landscape mode.                                                                      |
| margins             | [MarginsDto](#marginsdto) |    ❌     |         | Custom page margins.                                                                                                       |
| displayHeaderFooter | `boolean`                 |    ❌     | `true`  | If `true`, display the default header and footer containing e.g. filename and timestamp.                                   |
| omitBackground      | `boolean`                 |    ❌     | `false` | If `true`, backfground will be omitted.                                                                                    |
| printBackground     | `boolean`                 |    ❌     | `false` | If `true`, background graphics will be printed.                                                                            |
| waitForSelector     | `string`                  |    ❌     |         | Wait for the given selector until PDF generation starts.                                                                   |
| base64              | `boolean`                 |    ❌     | `false` | If `true` the result will be the file content as Base64.                                                                   |
| filename            | `string`                  |    ❌     |         | If set, the browser will attempt to download the file (only if `base64`=`false`). You probably need to omit the extension. |

##### MarginsDto
| Property | Type                 | Required | Description                                                       |
| -------- | -------------------- | :------: | ----------------------------------------------------------------- |
| top      | `string` \| `number` |    ❌     | Top page margin (e.g. `'2.5cm'` \| `'3%'` \| `'20px'` \| `5`).    |
| bottom   | `string` \| `number` |    ❌     | Bottom page margin (e.g. `'2.5cm'` \| `'3%'` \| `'20px'` \| `5`). |
| left     | `string` \| `number` |    ❌     | Left page margin (e.g. `'2.5cm'` \| `'3%'` \| `'20px'` \| `5`).   |
| right    | `string` \| `number` |    ❌     | Right page margin (e.g. `'2.5cm'` \| `'3%'` \| `'20px'` \| `5`).  |



## 📦 Changelog
See the [CHANGELOG.md](./CHANGELOG.md) for details on what’s new in recent versions.



## 🧩 License
MIT – feel free to use, adapt, and contribute.



## 🛠️ Contributing
Issues and PRs are welcome! If you find a bug or have a feature request, open an [issue](https://github.com/tobiaswaelde/open-pdf-print-service/issues).
