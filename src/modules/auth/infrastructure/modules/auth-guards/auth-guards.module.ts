import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserRepositoryModule } from '@modules/users/infrastructure/modules/user-repository/user-repository.module';
import { JwtAccessStrategy } from '../../strategies/jwt-access.strategy';
import { JwtAuthGuard } from '../../../presentation/guards/jwt-auth.guard';

@Module({
  imports: [
    UserRepositoryModule,
    PassportModule.register({ session: false }),
    JwtModule.register({}),
  ],
  providers: [JwtAuthGuard, JwtAccessStrategy],
  exports: [JwtAuthGuard, PassportModule, JwtModule],
})
export class AuthGuardsModule {}
