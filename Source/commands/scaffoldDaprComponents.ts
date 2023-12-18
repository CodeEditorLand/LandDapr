// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as path from "path";
import * as fs from "fs/promises";
import * as vscode from "vscode";
import * as nls from "vscode-nls";
import { ConflictHandler } from "../scaffolding/conflicts";
import {
	scaffoldPubSubComponent,
	scaffoldStateStoreComponent,
	scaffoldZipkinComponent,
} from "../scaffolding/daprComponentScaffolder";
import { Scaffolder } from "../scaffolding/scaffolder";
import { TemplateScaffolder } from "../scaffolding/templateScaffolder";
import { getLocalizationPathForFile } from "../util/localization";

const localize = nls.loadMessageBundle(getLocalizationPathForFile(__filename));

async function scaffoldDaprComponents(
	scaffolder: Scaffolder,
	templateScaffolder: TemplateScaffolder,
): Promise<void> {
	const rootWorkspaceFolderPath = (vscode.workspace.workspaceFolders ?? [])[0]
		?.uri?.fsPath;

	if (!rootWorkspaceFolderPath) {
		throw new Error(
			localize(
				"commands.scaffoldDaprTasks.noWorkspaceError",
				"To scaffold Dapr component files, first open a folder or workspace.",
			),
		);
	}

	const componentsPath = path.join(rootWorkspaceFolderPath, "components");

	await fs.mkdir(componentsPath, { recursive: true });

	// NOTE: As this command is now secondary (scaffolding now done for the user as part of `dapr init`),
	//       we'll simply skip upon finding conflicts; there's likely little need to overwrite existing
	//       components.
	const onConflict: ConflictHandler = () => Promise.resolve({ type: "skip" });

	await scaffoldStateStoreComponent(
		scaffolder,
		templateScaffolder,
		componentsPath,
		onConflict,
	);
	await scaffoldPubSubComponent(
		scaffolder,
		templateScaffolder,
		componentsPath,
		onConflict,
	);
	await scaffoldZipkinComponent(
		scaffolder,
		templateScaffolder,
		componentsPath,
		onConflict,
	);

	// TODO: Consider UX to prompt the user to update existing tasks' componentsPath property.
	//       (It's not clear the expected usage use of this feature warrants the work.)
}

const createScaffoldDaprComponentsCommand =
	(scaffolder: Scaffolder, templateScaffolder: TemplateScaffolder) =>
	(): Promise<void> =>
		scaffoldDaprComponents(scaffolder, templateScaffolder);

export default createScaffoldDaprComponentsCommand;
