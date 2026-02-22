import { Body, Param, Query, Route, Routes } from '../../commons/decorators/routes-register';

@Routes('/')
export class HealthCheckRoutes {

  @Route('get', '/')
  public healthCheck() {
    return {
      status: 'OK'
    };
  }

  @Route('get', '/ping')
  public ping() {
    return {
      status: 'Ping'
    };
  }

  @Route('get', '/dynamic/:id/ping/:name')
  public pingDynamic(@Param('id') id: string, @Param('name') name: string, @Query('t') t: string) {
    return {
      id,
      name,
      t
    };
  }

  @Route('post', '/dynamic/:id/ping/:name')
  public pingDynamicPost(@Param('id') id: string,
    @Param('name') name: string,
    @Query('t') t: string,
    @Body() body: any
  ) {
    return {
      id,
      name,
      t,
      body
    };
  }
}