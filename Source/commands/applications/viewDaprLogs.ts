// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IActionContext } from "@microsoft/vscode-azext-utils";
import * as nls from "vscode-nls";

import { getLocalizationPathForFile } from "../../util/localization";
import DaprApplicationNode from "../../views/applications/daprApplicationNode";
import { viewLogs } from "./viewLogs";

const localize = nls.loadMessageBundle(getLocalizationPathForFile(__filename));

const createViewDaprLogsCommand =
	() =>
	(
		context: IActionContext,
		node: DaprApplicationNode | undefined,
	): Promise<void> => {
		if (node === undefined) {
			throw new Error(
				localize(
					"commands.applications.viewDaprLogs.noPaletteSupport",
					"Viewing Dapr logs requires selecting an application in the Dapr view.",
				),
			);
		}

		return viewLogs(node.application, "daprd");
	};

export default createViewDaprLogsCommand;
