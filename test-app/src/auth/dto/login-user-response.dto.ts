import { ApiProperty } from '@nestjs/swagger';

export class LoginUserResponseDto {
    @ApiProperty({
        example: { access_token: 'someEncodedToken' }
    })
    jwt: {
        access_token: string;
    };
}
