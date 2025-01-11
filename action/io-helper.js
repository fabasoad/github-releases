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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInputs = void 0;
const core = __importStar(require("@actions/core"));
const github_1 = require("@actions/github");
const dist_1 = require("@yakubique/atils/dist");
var Inputs;
(function (Inputs) {
    Inputs["Repository"] = "repository";
    Inputs["PreReleases"] = "pre";
    Inputs["Debug"] = "debug";
    Inputs["Details"] = "details";
    Inputs["SortVersions"] = "sort";
    Inputs["Limit"] = "limit";
})(Inputs || (Inputs = {}));
function getInputs() {
    const result = {};
    const repository = core.getInput(Inputs.Repository, { required: false });
    if ((0, dist_1.isBlank)(repository)) {
        result.repository = `${github_1.context.repo.repo}`;
        result.owner = `${github_1.context.repo.owner}`;
    }
    else if (repository.includes('/')) {
        const [owner, repo] = repository.split('/');
        result.repository = repo;
        result.owner = owner;
    }
    else {
        result.repo = repository;
        result.owner = `${github_1.context.repo.owner}`;
    }
    let sortVersions = core.getInput(Inputs.SortVersions, { required: false });
    if ((0, dist_1.isBlank)(sortVersions)) {
        result.sortVersions = -1;
    }
    else {
        sortVersions = sortVersions.trim().toLowerCase();
        if (sortVersions === 'asc') {
            result.sortVersions = -1;
        }
        else if (sortVersions === 'desc') {
            result.sortVersions = 1;
        }
        else {
            core.warning('Unexpected value of `sortVersions`. Using default instead.');
            result.sortVersions = -1;
        }
    }
    result.debug = (0, dist_1.getBooleanInput)(Inputs.Debug, { required: false });
    result.preReleases = (0, dist_1.getBooleanInput)(Inputs.PreReleases, { required: false });
    result.details = (0, dist_1.getBooleanInput)(Inputs.Details, { required: false });
    result.limit = (0, dist_1.getNumberInput)(Inputs.Limit, { required: false });
    return result;
}
exports.getInputs = getInputs;
