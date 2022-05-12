import moment from "moment"
import { getLocale } from "umi"
import { JMTInterface } from "./interfaces/jmt.interface"
declare global {
	const API_ENV: string

	interface Window {
		routerBase: string
		publicPath: string
		JMT: JMTInterface
		openUrlInFocusWindow: Function
	}
}

//moment跟随全局语言
moment.locale(getLocale())
//监控集成
import * as Sentry from "@sentry/react"
import { BrowserTracing } from "@sentry/tracing"

Sentry.init({
	dsn: "https://0d4363d33f6e4502aa24a2373bb49956@sentry.3dyunzhan.com/6",
	integrations: [new BrowserTracing()],
	tracesSampleRate: 1.0,
	environment: API_ENV || "test"
})
