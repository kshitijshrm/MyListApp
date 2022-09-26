/* eslint-disable */
export const protobufPackage = 'os1.core.organization';

/** org id and domain uniquly identify a developer/ subscriber org */
export interface OrganizationMetadata {
  organizationId: string;
  domain: string;
  dns: string;
}

/** org identifier with team id unqiely identifies a team */
export interface OrganizationTeamMetadata {
  organization: OrganizationMetadata | undefined;
  teamId: string;
}

export interface OrganizationIdentifier {
  organizationId: string;
}

export interface OrganizationDomainIdentifier {
  organizationId: string;
  domain: string;
}

export interface OrganizationTeamIdentifier {
  organizationId: string;
  teamId: string;
}

export const OS1_CORE_ORGANIZATION_PACKAGE_NAME = 'os1.core.organization';

function createBaseOrganizationMetadata(): OrganizationMetadata {
  return { organizationId: '', domain: '', dns: '' };
}

export const OrganizationMetadata = {
  fromJSON(object: any): OrganizationMetadata {
    return {
      organizationId: isSet(object.organizationId)
        ? String(object.organizationId)
        : '',
      domain: isSet(object.domain) ? String(object.domain) : '',
      dns: isSet(object.dns) ? String(object.dns) : '',
    };
  },

  toJSON(message: OrganizationMetadata): unknown {
    const obj: any = {};
    message.organizationId !== undefined &&
      (obj.organizationId = message.organizationId);
    message.domain !== undefined && (obj.domain = message.domain);
    message.dns !== undefined && (obj.dns = message.dns);
    return obj;
  },
};

function createBaseOrganizationTeamMetadata(): OrganizationTeamMetadata {
  return { organization: undefined, teamId: '' };
}

export const OrganizationTeamMetadata = {
  fromJSON(object: any): OrganizationTeamMetadata {
    return {
      organization: isSet(object.organization)
        ? OrganizationMetadata.fromJSON(object.organization)
        : undefined,
      teamId: isSet(object.teamId) ? String(object.teamId) : '',
    };
  },

  toJSON(message: OrganizationTeamMetadata): unknown {
    const obj: any = {};
    message.organization !== undefined &&
      (obj.organization = message.organization
        ? OrganizationMetadata.toJSON(message.organization)
        : undefined);
    message.teamId !== undefined && (obj.teamId = message.teamId);
    return obj;
  },
};

function createBaseOrganizationIdentifier(): OrganizationIdentifier {
  return { organizationId: '' };
}

export const OrganizationIdentifier = {
  fromJSON(object: any): OrganizationIdentifier {
    return {
      organizationId: isSet(object.organizationId)
        ? String(object.organizationId)
        : '',
    };
  },

  toJSON(message: OrganizationIdentifier): unknown {
    const obj: any = {};
    message.organizationId !== undefined &&
      (obj.organizationId = message.organizationId);
    return obj;
  },
};

function createBaseOrganizationDomainIdentifier(): OrganizationDomainIdentifier {
  return { organizationId: '', domain: '' };
}

export const OrganizationDomainIdentifier = {
  fromJSON(object: any): OrganizationDomainIdentifier {
    return {
      organizationId: isSet(object.organizationId)
        ? String(object.organizationId)
        : '',
      domain: isSet(object.domain) ? String(object.domain) : '',
    };
  },

  toJSON(message: OrganizationDomainIdentifier): unknown {
    const obj: any = {};
    message.organizationId !== undefined &&
      (obj.organizationId = message.organizationId);
    message.domain !== undefined && (obj.domain = message.domain);
    return obj;
  },
};

function createBaseOrganizationTeamIdentifier(): OrganizationTeamIdentifier {
  return { organizationId: '', teamId: '' };
}

export const OrganizationTeamIdentifier = {
  fromJSON(object: any): OrganizationTeamIdentifier {
    return {
      organizationId: isSet(object.organizationId)
        ? String(object.organizationId)
        : '',
      teamId: isSet(object.teamId) ? String(object.teamId) : '',
    };
  },

  toJSON(message: OrganizationTeamIdentifier): unknown {
    const obj: any = {};
    message.organizationId !== undefined &&
      (obj.organizationId = message.organizationId);
    message.teamId !== undefined && (obj.teamId = message.teamId);
    return obj;
  },
};

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
