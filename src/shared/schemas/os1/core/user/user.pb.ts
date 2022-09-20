/* eslint-disable */
import { RecordStatus, RecordAudit } from '../common/common.pb';

export const protobufPackage = 'os1.core.user';

export interface User {
  id: UserIdentifier | undefined;
  authId: UserAuthIdentifier | undefined;
  userName: string;
  humanName: HumanName | undefined;
  email: Email | undefined;
  aggrements: UserAggrement | undefined;
  verification: UserVerification | undefined;
  recordStatus: RecordStatus | undefined;
  recordAudit: RecordAudit | undefined;
}

export interface UserIdentifier {
  userId: string;
}

export interface UserAuthIdentifier {
  keycloakUserId: string;
}

export interface Email {
  email: string;
  domain: string;
}

export interface HumanName {
  firstName: string;
  middleName: string;
  lastName: string;
}

export interface UserVerification {
  isEmailVerified: string;
}

export interface UserAggrement {
  isTermsAccepted: boolean;
  isPrivacyAccepted: boolean;
  isMarketingPromotionsAccepted: boolean;
}

export const OS1_CORE_USER_PACKAGE_NAME = 'os1.core.user';

function createBaseUser(): User {
  return {
    id: undefined,
    authId: undefined,
    userName: '',
    humanName: undefined,
    email: undefined,
    aggrements: undefined,
    verification: undefined,
    recordStatus: undefined,
    recordAudit: undefined,
  };
}

export const User = {
  fromJSON(object: any): User {
    return {
      id: isSet(object.id) ? UserIdentifier.fromJSON(object.id) : undefined,
      authId: isSet(object.authId)
        ? UserAuthIdentifier.fromJSON(object.authId)
        : undefined,
      userName: isSet(object.userName) ? String(object.userName) : '',
      humanName: isSet(object.humanName)
        ? HumanName.fromJSON(object.humanName)
        : undefined,
      email: isSet(object.email) ? Email.fromJSON(object.email) : undefined,
      aggrements: isSet(object.aggrements)
        ? UserAggrement.fromJSON(object.aggrements)
        : undefined,
      verification: isSet(object.verification)
        ? UserVerification.fromJSON(object.verification)
        : undefined,
      recordStatus: isSet(object.recordStatus)
        ? RecordStatus.fromJSON(object.recordStatus)
        : undefined,
      recordAudit: isSet(object.recordAudit)
        ? RecordAudit.fromJSON(object.recordAudit)
        : undefined,
    };
  },

  toJSON(message: User): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id ? UserIdentifier.toJSON(message.id) : undefined);
    message.authId !== undefined &&
      (obj.authId = message.authId
        ? UserAuthIdentifier.toJSON(message.authId)
        : undefined);
    message.userName !== undefined && (obj.userName = message.userName);
    message.humanName !== undefined &&
      (obj.humanName = message.humanName
        ? HumanName.toJSON(message.humanName)
        : undefined);
    message.email !== undefined &&
      (obj.email = message.email ? Email.toJSON(message.email) : undefined);
    message.aggrements !== undefined &&
      (obj.aggrements = message.aggrements
        ? UserAggrement.toJSON(message.aggrements)
        : undefined);
    message.verification !== undefined &&
      (obj.verification = message.verification
        ? UserVerification.toJSON(message.verification)
        : undefined);
    message.recordStatus !== undefined &&
      (obj.recordStatus = message.recordStatus
        ? RecordStatus.toJSON(message.recordStatus)
        : undefined);
    message.recordAudit !== undefined &&
      (obj.recordAudit = message.recordAudit
        ? RecordAudit.toJSON(message.recordAudit)
        : undefined);
    return obj;
  },
};

function createBaseUserIdentifier(): UserIdentifier {
  return { userId: '' };
}

export const UserIdentifier = {
  fromJSON(object: any): UserIdentifier {
    return {
      userId: isSet(object.userId) ? String(object.userId) : '',
    };
  },

  toJSON(message: UserIdentifier): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    return obj;
  },
};

function createBaseUserAuthIdentifier(): UserAuthIdentifier {
  return { keycloakUserId: '' };
}

export const UserAuthIdentifier = {
  fromJSON(object: any): UserAuthIdentifier {
    return {
      keycloakUserId: isSet(object.keycloakUserId)
        ? String(object.keycloakUserId)
        : '',
    };
  },

  toJSON(message: UserAuthIdentifier): unknown {
    const obj: any = {};
    message.keycloakUserId !== undefined &&
      (obj.keycloakUserId = message.keycloakUserId);
    return obj;
  },
};

function createBaseEmail(): Email {
  return { email: '', domain: '' };
}

export const Email = {
  fromJSON(object: any): Email {
    return {
      email: isSet(object.email) ? String(object.email) : '',
      domain: isSet(object.domain) ? String(object.domain) : '',
    };
  },

  toJSON(message: Email): unknown {
    const obj: any = {};
    message.email !== undefined && (obj.email = message.email);
    message.domain !== undefined && (obj.domain = message.domain);
    return obj;
  },
};

function createBaseHumanName(): HumanName {
  return { firstName: '', middleName: '', lastName: '' };
}

export const HumanName = {
  fromJSON(object: any): HumanName {
    return {
      firstName: isSet(object.firstName) ? String(object.firstName) : '',
      middleName: isSet(object.middleName) ? String(object.middleName) : '',
      lastName: isSet(object.lastName) ? String(object.lastName) : '',
    };
  },

  toJSON(message: HumanName): unknown {
    const obj: any = {};
    message.firstName !== undefined && (obj.firstName = message.firstName);
    message.middleName !== undefined && (obj.middleName = message.middleName);
    message.lastName !== undefined && (obj.lastName = message.lastName);
    return obj;
  },
};

function createBaseUserVerification(): UserVerification {
  return { isEmailVerified: '' };
}

export const UserVerification = {
  fromJSON(object: any): UserVerification {
    return {
      isEmailVerified: isSet(object.isEmailVerified)
        ? String(object.isEmailVerified)
        : '',
    };
  },

  toJSON(message: UserVerification): unknown {
    const obj: any = {};
    message.isEmailVerified !== undefined &&
      (obj.isEmailVerified = message.isEmailVerified);
    return obj;
  },
};

function createBaseUserAggrement(): UserAggrement {
  return {
    isTermsAccepted: false,
    isPrivacyAccepted: false,
    isMarketingPromotionsAccepted: false,
  };
}

export const UserAggrement = {
  fromJSON(object: any): UserAggrement {
    return {
      isTermsAccepted: isSet(object.isTermsAccepted)
        ? Boolean(object.isTermsAccepted)
        : false,
      isPrivacyAccepted: isSet(object.isPrivacyAccepted)
        ? Boolean(object.isPrivacyAccepted)
        : false,
      isMarketingPromotionsAccepted: isSet(object.isMarketingPromotionsAccepted)
        ? Boolean(object.isMarketingPromotionsAccepted)
        : false,
    };
  },

  toJSON(message: UserAggrement): unknown {
    const obj: any = {};
    message.isTermsAccepted !== undefined &&
      (obj.isTermsAccepted = message.isTermsAccepted);
    message.isPrivacyAccepted !== undefined &&
      (obj.isPrivacyAccepted = message.isPrivacyAccepted);
    message.isMarketingPromotionsAccepted !== undefined &&
      (obj.isMarketingPromotionsAccepted =
        message.isMarketingPromotionsAccepted);
    return obj;
  },
};

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
