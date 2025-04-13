import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CountryService } from './country.service';

@Module({
  imports: [HttpModule],
  providers: [CountryService],
  exports: [CountryService],
})
export class CountryModule {}
