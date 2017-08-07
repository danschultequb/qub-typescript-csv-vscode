'use strict';

import * as applicationInsights from "qub-telemetry-applicationinsights";
import * as fs from "fs";
import * as interfaces from "qub-vscode/interfaces";
import * as moment from "moment";
import * as path from "path";
import * as qub from "qub";
import * as telemetry from "qub-telemetry";
import * as csv from "qub-csv";

let packageJson: any;
function getPackageJson(): any {
    if (!packageJson) {
        packageJson = qub.getPackageJson(__dirname);
    }
    return packageJson;
}

export class Extension extends interfaces.LanguageExtension<csv.Table> {
    constructor(platform: interfaces.Platform) {
        super(getPackageJson().name, getPackageJson().version, "csv", platform);

        this.updateActiveDocumentParse();

        const telemetryEnabled: boolean = this.getConfigurationValue("telemetry.enabled", true);
        if (telemetryEnabled) {
            const settingsFilePath: string = this.getSettingsFilePath();
            let settingsJSON: any;
            try {
                const settingsFileContents: string = fs.readFileSync(settingsFilePath, "utf8");
                settingsJSON = JSON.parse(settingsFileContents);
            }
            catch (e) {
                settingsJSON = {};
            }

            const lastActivationDateAndTimeName: string = "lastActivationDateAndTime";
            const lastActivationDateAndTime: string = settingsJSON[lastActivationDateAndTimeName];

            const now: moment.Moment = moment();
            const pad = (value: number) => {
                let valueString: string = value.toString();
                if (valueString.length === 1) {
                    valueString = "0" + valueString;
                }
                return valueString;
            };

            const year: number = now.year();
            const month: number = now.month() + 1;
            const day: number = now.date();
            const nowDateAndTime: string = `${year}-${pad(month)}-${pad(day)}`;
            if (lastActivationDateAndTime !== nowDateAndTime) {
                const appInsights = new applicationInsights.Telemetry({ instrumentationKey: "76ecf6d3-ec1a-45df-b29a-553fd25f5562" });

                appInsights.write(new telemetry.Event("Activated", {
                    "extensionVersion": this.version,
                    "machineId": platform.getMachineId()
                }));
                appInsights.close();

                settingsJSON[lastActivationDateAndTimeName] = nowDateAndTime;

                const foldersToCreate = new qub.Stack<string>();
                let folderPath: string = path.dirname(settingsFilePath);
                while (!fs.existsSync(folderPath)) {
                    foldersToCreate.push(folderPath);
                    folderPath = path.dirname(folderPath);
                }

                while (foldersToCreate.any()) {
                    fs.mkdirSync(foldersToCreate.pop());
                }

                const settingsJSONString: string = JSON.stringify(settingsJSON)
                fs.writeFileSync(settingsFilePath, settingsJSONString, "utf8");
            }
        }
    }

    protected isParsable(textDocument: interfaces.TextDocument): boolean {
        return textDocument && textDocument.getLanguageId().toLowerCase() === "csv";
    }

    protected parseDocument(documentText: string): csv.Table {
        return csv.parse(documentText);
    }
}