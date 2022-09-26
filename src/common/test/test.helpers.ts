import { faker } from '@faker-js/faker';
import {
  PlatformRequestContext,
  TestHelpersBase,
} from '@foxtrotplatform/developer-platform-core-lib';
export class TestHelpers extends TestHelpersBase {
  static CreatePlatformContext(): PlatformRequestContext {
    const ctx: PlatformRequestContext = {
      userId: faker.datatype.uuid(),
      requestId: faker.datatype.uuid(),
      correlationId: faker.datatype.uuid(),
      causationId: faker.datatype.uuid(),
    };
    return ctx;
  }
}
