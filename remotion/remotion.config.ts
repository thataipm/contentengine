/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.overrideWebpackConfig(enableTailwind);
// Three.js does not render correctly with Chromium's default GL renderer;
// @remotion/three's own docs recommend angle. Applies to CLI render/still
// (this pipeline's only render path) — a future Node-API render script would
// need chromiumOptions.gl passed explicitly instead, per the note above.
Config.setChromiumOpenGlRenderer("angle");
