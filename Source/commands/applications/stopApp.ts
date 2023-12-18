// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IActionContext } from "@microsoft/vscode-azext-utils";
import * as nls from "vscode-nls";
import { DaprCliClient } from "../../services/daprCliClient";
import { UserInput } from "../../services/userInput";
import { getLocalizationPathForFile } from "../../util/localization";
import DaprApplicationNode from "../../views/applications/daprApplicationNode";

const localize = nls.loadMessageBundle(getLocalizationPathForFile(__filename));

export async function stopApp(
	daprCliClient: DaprCliClient,
	ui: UserInput,
	node: DaprApplicationNode | undefined,
): Promise<void> {
	try {
		return daprCliClient.stopApp(node?.application);
	} catch {
		await ui.showWarningMessage(
			localize(
				"commands.invokeCommon.stopAppError",
				"Failed to stop application '{0}'",
				node?.application.appId,
			),
			{ modal: true },
		);
	}
}

const createStopCommand =
	(daprCliClient: DaprCliClient, ui: UserInput) =>
	(
		context: IActionContext,
		node: DaprApplicationNode | undefined,
	): Promise<void> =>
		stopApp(daprCliClient, ui, node);

export default createStopCommand;
