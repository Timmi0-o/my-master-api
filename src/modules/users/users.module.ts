import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from './infrastructure/modules/user/user.module';
import { UserProfileModule } from './infrastructure/modules/user-profile/user-profile.module';
import { UserProfilesController } from './presentation/http/controllers/user-profiles.controller';
import { UsersController } from './presentation/http/controllers/users.controller';

@Module({
  imports: [forwardRef(() => AuthModule), UserModule, UserProfileModule],
  controllers: [UsersController, UserProfilesController],
  exports: [UserModule, UserProfileModule],
})
export class UsersModule {}
