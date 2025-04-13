import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { CountryResponseDto } from './dto/country-response.dto';

@Injectable()
export class CountryService {
  private readonly baseUrl = 'https://api.country.is';

  constructor(private readonly logger: Logger) {}

  async getCountry(ip: string): Promise<CountryResponseDto> {
    const url = `${this.baseUrl}/${ip}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      this.logger.error(`CountryService/getCountry - ${error.message}`);
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }
}
