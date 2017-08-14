import * as assert from "assert";
import * as qubvscode from "qub-vscode";
import * as qubvscodemock from "qub-vscode/mock";
import * as qub from "qub";
import * as csv from "qub-csv";

import * as e from "../sources/extension";

suite("Extension", () => {
    suite("constructor()", () => {
        test("with telemetry enabled", () => {
            const platform = new qubvscodemock.Platform();
            const extension = new e.Extension(platform);
            assert.deepStrictEqual(extension.name, "qub-csv-vscode");

            extension.dispose();
        });

        test("with telemetry disabled", () => {
            const platform = new qubvscodemock.Platform();
            platform.setConfiguration(new qubvscodemock.Configuration({
                "qub-csv-vscode": {
                    "telemetry": {
                        "enabled": false
                    }
                }
            }));

            const extension = new e.Extension(platform);
            assert.deepStrictEqual(extension.name, "qub-csv-vscode");

            extension.dispose();
        });
    });

    suite("on document opened", () => {
        test("with non-csv document", () => {
            const platform = new qubvscodemock.Platform();
            const extension = new e.Extension(platform);

            const openedDocument = new qubvscodemock.TextDocument("html", "mock-uri", "I'm not csv!");
            platform.openTextDocument(openedDocument);

            assert(qub.isDefined(platform.getActiveTextEditor()));
            assert.deepStrictEqual(platform.getActiveTextEditor().getDocument(), openedDocument);
        });

        test("with csv document", () => {
            const platform = new qubvscodemock.Platform();
            const extension = new e.Extension(platform);

            const openedDocument = new qubvscodemock.TextDocument("csv", "mock-uri", "");
            platform.openTextDocument(openedDocument);

            assert(qub.isDefined(platform.getActiveTextEditor()));
            assert.deepStrictEqual(platform.getActiveTextEditor().getDocument(), openedDocument);
        });
    });
});