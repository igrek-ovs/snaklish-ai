import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { CountryResponseDto } from './dto/country-response.dto';

@Injectable()
export class CountryService {
  private readonly baseUrl = 'https://api.country.is';
  private readonly logger = new Logger(CountryService.name);

  async getCountry(ip: string): Promise<CountryResponseDto> {
    const url = `${this.baseUrl}/${ip}`;
    try {
      const response = await axios.get<CountryResponseDto>(url);
      this.logger.log(
        `Successfully fetched country data for IP: ${ip} - Country: ${response.data.country}`,
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch country data';
      this.logger.error(
        `Failed to fetch country data for IP: ${ip} - ${errorMessage}`,
        error.stack,
      );
      throw new HttpException(
        'Failed to fetch country data',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
