// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IActionContext } from "@microsoft/vscode-azext-utils";
import * as vscode from "vscode";
import { DaprApplicationProvider } from "../../services/daprApplicationProvider";
import { DaprClient } from "../../services/daprClient";
import { UserInput } from "../../services/userInput";
import DaprApplicationNode from "../../views/applications/daprApplicationNode";
import { invoke } from "./invokeCommon";

export async function invokeGet(
	context: IActionContext,
	daprApplicationProvider: DaprApplicationProvider,
	daprClient: DaprClient,
	outputChannel: vscode.OutputChannel,
	ui: UserInput,
	workspaceState: vscode.Memento,
	node: DaprApplicationNode | undefined,
): Promise<void> {
	return invoke(
		context,
		daprApplicationProvider,
		daprClient,
		outputChannel,
		ui,
		workspaceState,
		node?.application,
	);
}

const createInvokeGetCommand =
	(
		daprApplicationProvider: DaprApplicationProvider,
		daprClient: DaprClient,
		outputChannel: vscode.OutputChannel,
		ui: UserInput,
		workspaceState: vscode.Memento,
	) =>
	(
		context: IActionContext,
		node: DaprApplicationNode | undefined,
	): Promise<void> =>
		invokeGet(
			context,
			daprApplicationProvider,
			daprClient,
			outputChannel,
			ui,
			workspaceState,
			node,
		);

export default createInvokeGetCommand;
