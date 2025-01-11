"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github_1 = require("@actions/github");
const io_helper_1 = require("./io-helper");
const dist_1 = require("@yakubique/atils/dist");
var Outputs;
(function (Outputs) {
    Outputs["releases"] = "releases";
})(Outputs || (Outputs = {}));
const setOutputs = (0, dist_1.buildOutput)(Outputs);
(function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const inputs = (0, io_helper_1.getInputs)();
            core.info(`Getting versions for:\n  repository: ${inputs.repository}\n  owner: ${inputs.owner}`);
            const github = (0, github_1.getOctokit)(process.env.GITHUB_TOKEN);
            const listResponse = yield github.rest.repos.listReleases({
                owner: inputs.owner,
                repo: inputs.repository
            });
            if (listResponse.status !== 200) {
                throw new Error(`Unexpected http ${listResponse.status} during get release list`);
            }
            const releaseList = listResponse.data
                .filter(release => !release.draft &&
                (!release.prerelease || inputs.preReleases));
            releaseList.sort((a, b) => inputs.sortVersions * (new Date(b.published_at).getTime() -
                new Date(a.published_at).getTime()));
            let releases = releaseList
                .slice(0, inputs.limit == 0 ? releaseList.length : inputs.limit)
                .map(x => ({
                name: x.name,
                tag_name: x.tag_name,
                prerelease: x.prerelease,
                published_at: x.published_at
            }));
            if (inputs.details) {
                setOutputs({ releases }, inputs.debug);
            }
            else {
                setOutputs({ releases: releases.map((x) => x.tag_name) }, inputs.debug);
            }
            core.info('Get release has finished successfully');
        }
        catch (err) {
            core.setFailed(err.message);
        }
    });
})();
