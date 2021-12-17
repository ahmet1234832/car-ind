import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ApprovedReportDto {
  @IsBoolean()
  @IsNotEmpty()
  approved: boolean;
}
