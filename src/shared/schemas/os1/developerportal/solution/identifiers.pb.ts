/* eslint-disable */
export const protobufPackage = 'os1.developerportal.solution';

export interface SolutionIdentifier {
  solutionId: string;
}

export interface SolutionVersionIdentifier {
  solutionId: string;
  solutionVersionId: string;
}

export const OS1_DEVELOPERPORTAL_SOLUTION_PACKAGE_NAME =
  'os1.developerportal.solution';

function createBaseSolutionIdentifier(): SolutionIdentifier {
  return { solutionId: '' };
}

export const SolutionIdentifier = {
  fromJSON(object: any): SolutionIdentifier {
    return {
      solutionId: isSet(object.solutionId) ? String(object.solutionId) : '',
    };
  },

  toJSON(message: SolutionIdentifier): unknown {
    const obj: any = {};
    message.solutionId !== undefined && (obj.solutionId = message.solutionId);
    return obj;
  },
};

function createBaseSolutionVersionIdentifier(): SolutionVersionIdentifier {
  return { solutionId: '', solutionVersionId: '' };
}

export const SolutionVersionIdentifier = {
  fromJSON(object: any): SolutionVersionIdentifier {
    return {
      solutionId: isSet(object.solutionId) ? String(object.solutionId) : '',
      solutionVersionId: isSet(object.solutionVersionId)
        ? String(object.solutionVersionId)
        : '',
    };
  },

  toJSON(message: SolutionVersionIdentifier): unknown {
    const obj: any = {};
    message.solutionId !== undefined && (obj.solutionId = message.solutionId);
    message.solutionVersionId !== undefined &&
      (obj.solutionVersionId = message.solutionVersionId);
    return obj;
  },
};

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
