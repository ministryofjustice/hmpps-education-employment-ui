import { config } from 'dotenv'
import {
  Contracts,
  setup,
  defaultClient,
  TelemetryClient,
  DistributedTracingModes,
  getCorrelationContext,
} from 'applicationinsights'
import { EnvelopeTelemetry } from 'applicationinsights/out/Declarations/Contracts'
import { RequestHandler } from 'express'
import type { ApplicationInfo } from '../applicationInfo'

export type ContextObject = {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  [name: string]: any
}

export function initialiseAppInsights(): void {
  // Loads .env file contents into | process.env
  config()

  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    // eslint-disable-next-line no-console
    console.log('Enabling azure application insights')

    setup().setDistributedTracingMode(DistributedTracingModes.AI_AND_W3C).start()
  }
}

export function buildAppInsightsClient(
  { applicationName, buildNumber }: ApplicationInfo,
  overrideName?: string,
): TelemetryClient {
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    defaultClient.context.tags['ai.cloud.role'] = overrideName || applicationName
    defaultClient.context.tags['ai.application.ver'] = buildNumber
    defaultClient.addTelemetryProcessor(addUserDataToRequests)

    defaultClient.addTelemetryProcessor(operationNameProcessor)
    return defaultClient
  }
  return null
}

export function appInsightsMiddleware(): RequestHandler {
  return (req, res, next) => {
    res.prependListener('finish', () => {
      const context = getCorrelationContext()
      if (context && req.route) {
        context.customProperties.setProperty('operationName', `${req.method} ${req.route?.path}`)
      }
    })
  }
}

export function operationNameProcessor({ tags, data }: EnvelopeTelemetry, contextObjects: ContextObject): boolean {
  const customProperties = contextObjects?.correlationContext?.customProperties
  const operationNameOverride =
    customProperties instanceof Map ? customProperties.get('operationName') : customProperties?.operationName

  if (operationNameOverride) {
    // eslint-disable-next-line no-param-reassign,no-multi-assign
    tags['ai.operation.name'] = data.baseData.name = operationNameOverride
  }
  return true
}

export function addUserDataToRequests(envelope: EnvelopeTelemetry, contextObjects: ContextObject) {
  const isRequest = envelope.data.baseType === Contracts.TelemetryTypeString.Request
  if (isRequest) {
    const { username, activeCaseLoadId } = contextObjects?.['http.ServerRequest']?.res?.locals?.user || {}
    if (username) {
      const { properties } = envelope.data.baseData
      // eslint-disable-next-line no-param-reassign
      envelope.data.baseData.properties = {
        username,
        activeCaseLoadId,
        ...properties,
      }
    }
  }
  return true
}
