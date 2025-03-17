import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Payload } from 'src/types';

export const User = createParamDecorator(
  (data: keyof Payload, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: Payload }>();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
