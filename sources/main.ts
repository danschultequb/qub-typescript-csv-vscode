'use strict';

import * as vscode from "vscode";
import * as qubVSCode from "qub-vscode/vscode";

import * as csv from "./extension";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(new csv.Extension(new qubVSCode.Platform()));
}