// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { firstValueFrom } from "rxjs";
import * as nls from "vscode-nls";
import { DaprApplicationProvider } from "../services/daprApplicationProvider";
import { TelemetryProvider } from "../services/telemetryProvider";
import { getLocalizationPathForFile } from "../util/localization";
import CustomExecutionTaskProvider from "./customExecutionTaskProvider";
import { TaskDefinition } from "./taskDefinition";

const localize = nls.loadMessageBundle(getLocalizationPathForFile(__filename));

export interface DaprdDownTaskDefinition extends TaskDefinition {
	appId?: string;
	type: "daprd-down";
}

export default class DaprdDownTaskProvider extends CustomExecutionTaskProvider {
	constructor(
		daprApplicationProvider: DaprApplicationProvider,
		telemetryProvider: TelemetryProvider,
	) {
		super(
			(definition, writer) => {
				return telemetryProvider.callWithTelemetry(
					"vscode-dapr.tasks.dapr-down",
					async () => {
						const daprdDownDefinition =
							definition as DaprdDownTaskDefinition;

						if (daprdDownDefinition.appId === undefined) {
							throw new Error(
								localize(
									"tasks.daprdDownTaskProvider.appIdError",
									"The 'appId' property must be set.",
								),
							);
						}

						const applications = await firstValueFrom(
							daprApplicationProvider.applications,
						);

						applications
							.filter(
								(application) =>
									application.appId ===
									daprdDownDefinition.appId,
							)
							.forEach((application) =>
								process.kill(application.pid, "SIGKILL"),
							);

						writer.writeLine(
							localize(
								"tasks.daprdDownTaskProvider.shutdownMessage",
								"Shutting down daprd...",
							),
						);
					},
				);
			},
			/* isBackgroundTask: */ false,
			/* problemMatchers: */ [],
		);
	}
}
