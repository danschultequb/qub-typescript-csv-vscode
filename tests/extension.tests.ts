import * as assert from "assert";
import * as interfaces from "qub-vscode/interfaces";
import * as mocks from "qub-vscode/mocks";
import * as qub from "qub";
import * as csv from "qub-csv";

import * as e from "../sources/extension";

suite("Extension", () => {
    suite("constructor()", () => {
        test("with telemetry enabled", () => {
            const platform = new mocks.Platform();
            const extension = new e.Extension(platform);
            assert.deepStrictEqual(extension.name, "qub-csv-vscode");

            extension.dispose();
        });

        test("with telemetry disabled", () => {
            const platform = new mocks.Platform();
            platform.setConfiguration(new mocks.Configuration({
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
            const platform = new mocks.Platform();
            const extension = new e.Extension(platform);

            const openedDocument = new mocks.TextDocument("html", "mock-uri", "I'm not csv!");
            platform.openTextDocument(openedDocument);

            assert(qub.isDefined(platform.getActiveTextEditor()));
            assert.deepStrictEqual(platform.getActiveTextEditor().getDocument(), openedDocument);
        });

        test("with csv document", () => {
            const platform = new mocks.Platform();
            const extension = new e.Extension(platform);

            const openedDocument = new mocks.TextDocument("csv", "mock-uri", "");
            platform.openTextDocument(openedDocument);

            assert(qub.isDefined(platform.getActiveTextEditor()));
            assert.deepStrictEqual(platform.getActiveTextEditor().getDocument(), openedDocument);
        });
    });
});