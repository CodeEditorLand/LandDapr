// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IActionContext } from "@microsoft/vscode-azext-utils";
import * as nls from "vscode-nls";

import { DaprApplication } from "../../services/daprApplicationProvider";
import { UserInput } from "../../services/userInput";
import { getLocalizationPathForFile } from "../../util/localization";
import DaprApplicationNode from "../../views/applications/daprApplicationNode";

const localize = nls.loadMessageBundle(getLocalizationPathForFile(__filename));

async function browseToApplication(
	application: DaprApplication,
	ui: UserInput,
): Promise<void> {
	if (application.appPort === undefined) {
		throw new Error(
			localize(
				"commands.applications.browseToApplication.noAppPort",
				"No port is associated with the application '{0}'.",
				application.appId,
			),
		);
	}

	// TODO: Is this app always HTTP?
	await ui.openExternal(`http://localhost:${application.appPort}`);
}

const createBrowseToApplicationCommand =
	(ui: UserInput) =>
	(
		context: IActionContext,
		node: DaprApplicationNode | undefined,
	): Promise<void> => {
		if (node === undefined) {
			throw new Error(
				localize(
					"commands.applications.browseToApplication.noPaletteSupport",
					"Browsing requires selecting an application in the Dapr view.",
				),
			);
		}

		return browseToApplication(node.application, ui);
	};

export default createBrowseToApplicationCommand;
