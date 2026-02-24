
import pino from 'pino';

/**
 * GESTALTUNG SECURE LOGGER
 * Configured with PII and credential redaction for browser/edge telemetry.
 */
const logger = pino({
  browser: {
    asObject: true
  },
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers["x-figma-token"]',
      'req.body.password',
      'req.body.apiKey',
      '*.apiKey',
      '*.password',
      '*.token',
      'figmaToken'
    ],
    remove: true
  }
});

export default logger;
