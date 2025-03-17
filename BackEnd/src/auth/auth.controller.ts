import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Headers,
  UsePipes,
} from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { loginDto, loginSchema } from './dto/login.dto';
import { Role } from 'src/shared/enums/role.enum';
import { signUpDto, signUpSchema } from './dto/signup.dto';
import { Throttle } from '@nestjs/throttler';
import { ResetPasswordDTO } from './dto/resetPassword.dto';
import { verifyTokenDto } from './dto/verifyToken.dto';
import { JoiValidationPipe } from 'src/shared/utils/joiValidations';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: loginDto })
  @ApiOperation({ summary: 'User login' })
  @ApiHeader({
    name: 'userType',
    description: 'Type of user logging in',
    required: false,
    schema: { enum: Object.values(Role) },
  })
  @UsePipes(new JoiValidationPipe(loginSchema))
  @Post('login')
  async login(
    @Body() signInDto: loginDto,
    @Headers('userType') userType: string,
  ) {
    const data = await this.authService.login(
      signInDto.email,
      signInDto.password,
      userType,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Login successful',
      data,
    };
  }

  @ApiOperation({ summary: 'User signUp' })
  @ApiBody({ type: signUpDto })
  @Post('signUp')
  @UsePipes(new JoiValidationPipe(signUpSchema))
  async signUp(
    @Body() signUpDto: signUpDto,
    @Headers('userType') userType: Role,
  ) {
    const data = await this.authService.signUp(signUpDto, userType);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
      data,
    };
  }

  @ApiOperation({ summary: 'Send Otp by Email' })
  @Throttle({ default: { limit: 2, ttl: 30 } })
  @Post('sendotp')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        input: { type: 'string' },
      },
    },
  })
  async sendOtp(
    @Body() sendOtpDto: Record<string, any>,
    @Headers('userType') userType: string,
  ) {
    await this.authService.sendVerficationOtp(sendOtpDto.input, userType);
    return {
      statusCode: HttpStatus.OK,
      message: 'OTP sent successfully',
    };
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        otp: {
          type: 'string',
        },
        input: {
          type: 'string',
        },
      },
    },
  })
  @Post('verifyotp')
  @ApiOperation({ summary: 'Verify the otp' })
  async verifyOtp(
    @Body() data: verifyTokenDto,
    @Headers('userType') userType: string = 'USER',
  ) {
    await this.authService.verifyOtp(data.input, data.otp, userType);
    return {
      statusCode: HttpStatus.OK,
      message: 'OTP verified successfully',
    };
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        input: {
          type: 'string',
        },
      },
    },
  })
  @Post('forget')
  @ApiOperation({ summary: 'Send otp for forgot password' })
  async forgetPassword(
    @Body() data: Record<string, any>,
    @Headers('userType') userType: string = 'USER',
  ) {
    await this.authService.forgetPassword(data.input, userType);
    return {
      statusCode: HttpStatus.OK,
      message: 'Reset password link sent successfully',
    };
  }

  @Post('reset')
  @ApiBody({ type: ResetPasswordDTO })
  @ApiOperation({ summary: 'Reset password' })
  async resetPassword(
    @Body() data: ResetPasswordDTO,
    @Headers('userType') userType: string = 'USER',
  ) {
    await this.authService.resetPassword(data, userType);
    return {
      statusCode: HttpStatus.OK,
      message: 'Password reset successfully',
    };
  }

  @Post('otp-valid')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        input: {
          type: 'string',
        },
        otp: {
          type: 'string',
        },
      },
    },
  })
  async otpValid(
    @Body() data: Record<string, any>,
    @Headers('userType') userType: string = 'USER',
  ) {
    const { isValid } = await this.authService.isOtpValid(
      data.input,
      userType,
      data.otp,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'OTP verified successfully',
      data: {
        isValid,
      },
    };
  }
}
