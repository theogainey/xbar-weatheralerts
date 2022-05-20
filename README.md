# xbar NWS Weather and Alerts

xbar plug to get Weather and Severe Weather Alerts in your macOS menu bar.
Weather Data powered by The National Weather Service API.

![' '](https://github.com/theogainey/xbar-weatheralerts/blob/main/example.png)

## Getting Started

In order to run this app both xbar and Deno must be installed

### xbar

[xbar](https://github.com/matryer/xbar) (the BitBar reboot) lets you put the
output from any script/program in your macOS menu bar.

To install
[Download the latest release of xbar.](https://github.com/matryer/xbar/releases)

### Deno

[Deno](https://github.com/denoland/deno) is a simple, modern and secure runtime
for JavaScript and TypeScript that uses V8 and is built in Rust.

Shell (Mac, Linux):

```sh
curl -fsSL https://deno.land/x/install/install.sh | sh
```

[Homebrew](https://formulae.brew.sh/formula/deno) (Mac):

```sh
brew install deno
```

See
[deno_install](https://github.com/denoland/deno_install/blob/master/README.md)
and [releases](https://github.com/denoland/deno/releases) for other options.

### Install this plugin

To install this plugin copy the contents of `weatherAlerts.1min.ts` into your
xbar plugin directory. The plugin directory is folder on your Mac where the
plugins live, located at `~/Library/Application Support/xbar/plugins.`

```
curl -sL https://raw.githubusercontent.com/theogainey/xbar-weatheralerts/weatherAlerts.1min.ts -o weatherAlerts.1min.ts
```

Ensure that the file is executable by using the command
`chmod +x weatherAlerts.1min.ts`.
[Read more.](https://github.com/matryer/xbar#installing-plugins)
