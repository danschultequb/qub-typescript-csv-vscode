'use strict';

import * as applicationInsights from "qub-telemetry-applicationinsights";
import * as qubvscode from "qub-vscode";
import * as qub from "qub";
import * as csv from "qub-csv";

let packageJson: any;
function getPackageJson(): any {
    if (!packageJson) {
        packageJson = qub.getPackageJson(__dirname);
    }
    return packageJson;
}

export class Extension extends qubvscode.LanguageExtension<csv.Document> {
    constructor(platform: qubvscode.Platform) {
        super(getPackageJson().name, getPackageJson().version, "csv", platform);

        this.writeActivationTelemetry(() =>
            new applicationInsights.Telemetry({ instrumentationKey: "76ecf6d3-ec1a-45df-b29a-553fd25f5562" }));

        this.updateActiveDocumentParse();
    }

    protected isParsable(textDocument: qubvscode.TextDocument): boolean {
        return textDocument && textDocument.getLanguageId().toLowerCase() === "csv";
    }

    protected parseDocument(documentText: string): csv.Document {
        return csv.parse(documentText);
    }
}