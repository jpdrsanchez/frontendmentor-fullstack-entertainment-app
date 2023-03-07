import { AuthenticateViewerUseCase } from '@application/use-cases/authenticate-viewer.usecase'
import { JWTGuard } from '@infra/auth/guards/jwt.guard'
import { TokenAuthData } from '@infra/auth/interfaces/token-auth-data.interface'
import { GenerateTokenService } from '@infra/auth/services/generate-token.service'
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { ApplicationExceptionPresenter } from '@presenters/exceptions/application.exception'
import { AuthMeViewModel } from '@presenters/view-models/auth-me.view-model'
import { AuthenticateViewerDto } from '../dtos/authenticate-viewer.dto'
import { CurrentViewer } from '@infra/auth/decorators/current-viewer.decorator'

@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authenticateViewer: AuthenticateViewerUseCase,
    private readonly generateTokenService: GenerateTokenService
  ) {}

  @Post('login')
  async login(@Body() authenticateViewerDto: AuthenticateViewerDto) {
    const authenticateOrFail = await this.authenticateViewer.execute({
      email: authenticateViewerDto.email,
      password: authenticateViewerDto.password
    })

    if (authenticateOrFail.isLeft())
      throw ApplicationExceptionPresenter.toHttp(authenticateOrFail.value)

    const token = this.generateTokenService.generate({
      data: {
        email: authenticateOrFail.value.email,
        id: authenticateOrFail.value.id
      }
    })
    return AuthMeViewModel.toHttp(authenticateOrFail.value, token)
  }

  @UseGuards(JWTGuard)
  @Get('me')
  async me(@CurrentViewer() viewer: TokenAuthData) {
    return viewer
  }
}
