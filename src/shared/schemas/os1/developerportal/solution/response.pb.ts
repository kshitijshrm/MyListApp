/* eslint-disable */
import { SolutionVersionIdentifier } from './identifiers.pb';
import { Solution } from './solution.pb';

export const protobufPackage = 'os1.developerportal.solution';

export interface RegisterSolutionResponse {
  id: SolutionVersionIdentifier | undefined;
}

export interface AddSolutionVersionResponse {
  id: SolutionVersionIdentifier | undefined;
}

export interface GetSolutionBySolutionIdResponse {
  solution: Solution | undefined;
}

export interface GetSolutionByVersionIdResponse {
  solution: Solution | undefined;
}

export interface ListSolutionsByOrgResponse {
  solution: Solution[];
}

export const OS1_DEVELOPERPORTAL_SOLUTION_PACKAGE_NAME =
  'os1.developerportal.solution';

function createBaseRegisterSolutionResponse(): RegisterSolutionResponse {
  return { id: undefined };
}

export const RegisterSolutionResponse = {
  fromJSON(object: any): RegisterSolutionResponse {
    return {
      id: isSet(object.id)
        ? SolutionVersionIdentifier.fromJSON(object.id)
        : undefined,
    };
  },

  toJSON(message: RegisterSolutionResponse): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? SolutionVersionIdentifier.toJSON(message.id)
        : undefined);
    return obj;
  },
};

function createBaseAddSolutionVersionResponse(): AddSolutionVersionResponse {
  return { id: undefined };
}

export const AddSolutionVersionResponse = {
  fromJSON(object: any): AddSolutionVersionResponse {
    return {
      id: isSet(object.id)
        ? SolutionVersionIdentifier.fromJSON(object.id)
        : undefined,
    };
  },

  toJSON(message: AddSolutionVersionResponse): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? SolutionVersionIdentifier.toJSON(message.id)
        : undefined);
    return obj;
  },
};

function createBaseGetSolutionBySolutionIdResponse(): GetSolutionBySolutionIdResponse {
  return { solution: undefined };
}

export const GetSolutionBySolutionIdResponse = {
  fromJSON(object: any): GetSolutionBySolutionIdResponse {
    return {
      solution: isSet(object.solution)
        ? Solution.fromJSON(object.solution)
        : undefined,
    };
  },

  toJSON(message: GetSolutionBySolutionIdResponse): unknown {
    const obj: any = {};
    message.solution !== undefined &&
      (obj.solution = message.solution
        ? Solution.toJSON(message.solution)
        : undefined);
    return obj;
  },
};

function createBaseGetSolutionByVersionIdResponse(): GetSolutionByVersionIdResponse {
  return { solution: undefined };
}

export const GetSolutionByVersionIdResponse = {
  fromJSON(object: any): GetSolutionByVersionIdResponse {
    return {
      solution: isSet(object.solution)
        ? Solution.fromJSON(object.solution)
        : undefined,
    };
  },

  toJSON(message: GetSolutionByVersionIdResponse): unknown {
    const obj: any = {};
    message.solution !== undefined &&
      (obj.solution = message.solution
        ? Solution.toJSON(message.solution)
        : undefined);
    return obj;
  },
};

function createBaseListSolutionsByOrgResponse(): ListSolutionsByOrgResponse {
  return { solution: [] };
}

export const ListSolutionsByOrgResponse = {
  fromJSON(object: any): ListSolutionsByOrgResponse {
    return {
      solution: Array.isArray(object?.solution)
        ? object.solution.map((e: any) => Solution.fromJSON(e))
        : [],
    };
  },

  toJSON(message: ListSolutionsByOrgResponse): unknown {
    const obj: any = {};
    if (message.solution) {
      obj.solution = message.solution.map((e) =>
        e ? Solution.toJSON(e) : undefined,
      );
    } else {
      obj.solution = [];
    }
    return obj;
  },
};

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
