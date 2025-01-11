import * as core from '@actions/core';
import { context } from '@actions/github';
import { isBlank, getBooleanInput, getNumberInput } from '@yakubique/atils/dist';

enum Inputs {
    Repository = 'repository',
    PreReleases = 'pre',
    Debug = 'debug',
    Details = 'details',
    SortVersions = 'sort',
    Limit = 'limit',
}

export interface ActionInputs {
    repository: string;
    owner: string;
    preReleases: boolean;
    debug: boolean;
    details: boolean;
    sortVersions: number;
    limit: number;
}

export function getInputs(): ActionInputs {
    const result: ActionInputs | any = {};

    const repository = core.getInput(Inputs.Repository, { required: false });
    if (isBlank(repository)) {
        result.repository = `${context.repo.repo}`;
        result.owner = `${context.repo.owner}`;
    } else if (repository.includes('/')) {
        const [owner, repo] = repository.split('/');
        result.repository = repo;
        result.owner = owner;
    } else {
        result.repo = repository;
        result.owner = `${context.repo.owner}`;
    }

    let sortVersions = core.getInput(Inputs.SortVersions, { required: false });
    if (isBlank(sortVersions)) {
        result.sortVersions = -1;
    } else {
        sortVersions = sortVersions.trim().toLowerCase();
        if (sortVersions === 'asc') {
            result.sortVersions = -1;
        } else if (sortVersions === 'desc') {
            result.sortVersions = 1;
        } else {
            core.warning('Unexpected value of `sortVersions`. Using default instead.');
            result.sortVersions = -1;
        }
    }

    result.debug = getBooleanInput(Inputs.Debug, { required: false });
    result.preReleases = getBooleanInput(Inputs.PreReleases, { required: false });
    result.details = getBooleanInput(Inputs.Details, { required: false });
    result.limit = getNumberInput(Inputs.Limit, { required: false });

    return result;
}
